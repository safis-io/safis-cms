import {
  GraphQLString,
  GraphQLNonNull,
  GraphQLBoolean,
  GraphQLFieldConfig,
} from 'graphql';

import type { CMSGraphQLFieldResolver } from '../../../types';

const createMutationDeleteContentType = (
  resolveFn: CMSGraphQLFieldResolver<any, any>,
): GraphQLFieldConfig<any, any> => ({
  type: new GraphQLNonNull(GraphQLBoolean),
  args: { id: { type: new GraphQLNonNull(GraphQLString) } },
  resolve: resolveFn,
});

export { createMutationDeleteContentType };
