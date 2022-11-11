import {
  FastifyPluginCallback,
  FastifyPluginOptions,
} from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import mercurius from 'mercurius';
import graphqlGitPlugin from './graphql-git';
import { graphql as graphqlConfig } from '../../config';

const graphqlPlugin: FastifyPluginCallback = async (
  instance,
  opts: FastifyPluginOptions,
  next,
) => {
  await instance.register(graphqlGitPlugin);

  const { cmsGraphql } = instance;

  instance.register(mercurius, {
    context: cmsGraphql.buildContext,
    schema: await instance.cmsGraphql.createCmsSchema(),
    graphiql: graphqlConfig.graphiql,
    path: graphqlConfig.path,
  });

  next(); // end of plugin
};

export default fastifyPlugin(graphqlPlugin, {
  name: 'safis-cms-graphql',
  fastify: '4.x',
});
