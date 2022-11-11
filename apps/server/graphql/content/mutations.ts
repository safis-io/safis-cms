import { Content, ResolverCreatorFn } from '@safis/cms-schema';
import { CMSResolver, ContextWithGitMetadata } from '../../types';

const createAddContentMutation: ResolverCreatorFn<CMSResolver<
  ContextWithGitMetadata,
  Promise<Content>>
> = (contentType) => async (
  _,
  args: { data: Content },
  { git },
) => {
  const { data: content } = args;

  return git.api.content.create({
    id: content.sys.id,
    content,
    branch: git.branch,
    subFolder: contentType.id,
  }) as Promise<Content>;
};

const createUpdateContentMutation: ResolverCreatorFn<CMSResolver<
  ContextWithGitMetadata,
  Promise<Content>>
> = (contentType) => async (
  _,
  args: { id: string, data: Content },
  { git },
) => {
  const { id, data: content } = args;

  return git.api.content.update({
    id,
    content,
    branch: git.branch,
    subFolder: contentType.id,
  }) as Promise<Content>;
};

const createDeleteContentMutation: ResolverCreatorFn<CMSResolver<
  ContextWithGitMetadata,
  Promise<boolean>>
> = (contentType) => async (
  _,
  args: { id: string },
  { git },
) => git.api.content.delete({
  id: args.id,
  branch: git.branch,
  subFolder: contentType.id,
});

const contentMutationResolverCreatorsMap = {
  addContent: createAddContentMutation,
  updateContent: createUpdateContentMutation,
  deleteContent: createDeleteContentMutation,
};

export { contentMutationResolverCreatorsMap };
