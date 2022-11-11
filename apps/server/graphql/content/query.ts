import { Content, ResolverCreatorFn } from '@safis/cms-schema';
import { CMSResolver, ContextWithGitMetadata } from '../../types';

const createContentQuery: ResolverCreatorFn<CMSResolver<
  ContextWithGitMetadata,
  Promise<Content | null>>
> = (contentType) => async (
  _,
  { id }: { id: string },
  { git },
) => git.api.content.get({
  id,
  branch: git.branch,
  subFolder: contentType.id,
}) as Promise<Content | null>;

const createContentCollectionQuery: ResolverCreatorFn<CMSResolver<
  ContextWithGitMetadata,
  Promise<Content[]>>
> = (contentType) => (
  _,
  args,
  { git },
) => git.api.content.getAll({
  branch: git.branch,
  subFolder: contentType.id,
}) as Promise<Content[]>;

const contentQueryResolverCreatorsMap = {
  content: createContentQuery,
  contentCollection: createContentCollectionQuery,
};

export { contentQueryResolverCreatorsMap };
