import camelCase from 'lodash.camelcase';

import { CMSResolver, ContextWithGitMetadata } from '../../types';

type GenericContentTypeInput = {
  data: {
    id: string
    [key: string]: any
  }
}

const addContentType: CMSResolver<ContextWithGitMetadata> = (
  _,
  { data }: GenericContentTypeInput,
  context,
) => {
  const { branch } = context.git;
  const id = camelCase(data.id || data.name);

  return context.git.api.contentType.create({
    id,
    branch,
    content: { ...data, id },
  });
};

const deleteContentType: CMSResolver<ContextWithGitMetadata> = (
  _,
  { id }: { id: string },
  context,
) => {
  const { branch } = context.git;

  return context.git.api.contentType.delete(({ branch, id }));
};

const updateContentType: CMSResolver<ContextWithGitMetadata> = (
  _,
  { data }: GenericContentTypeInput,
  context,
) => {
  const { branch } = context.git;

  return context.git.api.contentType.update({
    id: data.id,
    branch,
    content: data,
  });
};

const mutation = {
  addContentType,
  deleteContentType,
  updateContentType,
};

export { mutation };
