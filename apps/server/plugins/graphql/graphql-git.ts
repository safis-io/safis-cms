import mercurius from 'mercurius';
import fastifyPlugin from 'fastify-plugin';
import type {
  FastifyPluginCallback,
  FastifyPluginOptions,
  FastifyRequest,
  FastifyReply,
} from 'fastify';
import {
  ContentType,
  ContentTypesMap,
  createSchema,
  mapContentTypes,
} from '@safis/cms-schema';
import { GitHubAdapter } from '@safis/cms-github-adapter';

import {
  GitAdaptersEnum,
  CMSDecoratorGraphQL,
  ContextWithGitMetadata,
} from '../../types';
import { git as gitConfig, secrets } from '../../config';
import { resolverCreatorsMap } from '../../graphql/resolverCreators';
import { resolvers } from '../../graphql/resolvers';

const { ErrorWithProps: CustomGraphQLError } = mercurius;

const gitOwnerSecret = secrets.gitOwner;

const gitAdapters = { [GitAdaptersEnum.GITHUB]: GitHubAdapter };

declare module 'fastify' {
  export interface FastifyInstance {
    cmsGraphql: CMSDecoratorGraphQL
  }
}

const graphqlGitPlugin: FastifyPluginCallback = async (
  instance,
  opts: FastifyPluginOptions,
  next,
) => {
  const { adapter, owner, repo, paths, isPrivate, defaultBranch } = gitConfig;
  const GitAdapter = gitAdapters[adapter];

  const gitAdapter = new GitAdapter({
    auth: { ownerSecret: gitOwnerSecret },
    repo: {
      name: repo,
      paths,
      owner,
      createAsPrivate: isPrivate,
    },
  });

  instance.log.info(`Preparing repository: ${owner}/${repo}`);

  await gitAdapter
    .initRepo()
    .then(() => {
      instance.log.info(`Repository ready: ${owner}/${repo}`);
    })
    .catch((error) => {
      instance.log.error(`Failed to initialize repository: ${owner}/${repo}`, error);

      throw error;
    });

  const gitApi = gitAdapter.createGitApi({ secret: gitOwnerSecret });

  let contentTypesList: ContentType[];
  let contentTypesMap: ContentTypesMap;

  async function updateContentTypesMetadata(): Promise<void> {
    instance.log.info('Fecthing ContentTypes...');

    contentTypesList = await gitApi.contentType.getAll({}) as ContentType[];

    contentTypesMap = mapContentTypes(contentTypesList);

    instance.log.info('ContentTypes updated...');
  }

  function getContentTypeMetadata() {
    return {
      contentTypesList: contentTypesList as ContentType[],
      contentTypesMap: contentTypesMap as ContentTypesMap,
    };
  }

  await updateContentTypesMetadata();

  async function createCmsSchema() {
    instance.log.info('Generating GraphQL schema...');
    const { contentTypesList: ctList } = getContentTypeMetadata();

    const schema = createSchema({
      contentTypesList: ctList,
      resolvers,
      resolverCreatorsMap,
      // eslint-disable-next-line no-use-before-define
      schemaUpdater: updateSchema,
    });

    instance.log.info('Schema generated successfully!');

    return schema;
  }

  async function updateSchema() {
    await updateContentTypesMetadata();
    const updatedSchema = await createCmsSchema();

    instance.log.info('Updating schema...');

    await instance.graphql.replaceSchema(updatedSchema);

    instance.log.info('Schema updated!');
  }

  const buildContext = async (
    req: FastifyRequest,
    reply: FastifyReply,
  ): Promise<ContextWithGitMetadata> => {
    // if (req.isAnonymousUser) return {};
    console.log('Building context...'); // TODO: REMOVE
    console.log('🚀 buildContext ~ using -> process.env.GIT_OWNER_SECRET', process.env.GIT_OWNER_SECRET);

    const {
      contentTypesMap: typesMap,
      contentTypesList: types,
    } = getContentTypeMetadata();

    return {
      CustomGraphQLError,
      git: {
        api: gitAdapter.createGitApi({
          // secret: request.accessToken
          secret: process.env.GIT_OWNER_SECRET as string, // TODO: REMOVE
        }),
        owner,
        repo,
        branch: defaultBranch,
        paths,
      },
      cms: {
        contentTypesList: types,
        contentTypesMap: typesMap,
      },
    };
  };

  await instance.decorate('cmsGraphql', {
    buildContext,
    createCmsSchema,
    getOAuthLoginUrl: GitAdapter.getLoginUrl,
    getOAuthAccessToken: GitAdapter.getAccessToken,
  } as CMSDecoratorGraphQL);

  next(); // end of plugin
};

export default fastifyPlugin(graphqlGitPlugin, {
  name: 'cms-graphql-git',
  fastify: '4.x',
});
