import { CMSResolver, ContextWithGitMetadata } from '../../types';

const contentType: CMSResolver<ContextWithGitMetadata> = (
  _,
  { id: contentTypeId },
  { cms },
) => {
  const { contentTypesMap } = cms;

  return contentTypesMap[contentTypeId];
};

const contentTypeCollection: CMSResolver<ContextWithGitMetadata> = (
  _,
  args,
  { cms },
) => {
  const { contentTypesList } = cms;

  return contentTypesList;
};

const query = {
  contentType,
  contentTypeCollection,
};

export { query };
