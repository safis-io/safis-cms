import type { RootResolversMap } from '@safis/cms-schema';
import { query as contentTypeQueries } from './contentType/query';
import { mutation as contentTypeMutations } from './contentType/mutation';
import { ContextWithGitMetadata } from '../types';

const resolvers: RootResolversMap<ContextWithGitMetadata> = {
  query: { ...contentTypeQueries },
  mutation: { ...contentTypeMutations },
};

export { resolvers };
