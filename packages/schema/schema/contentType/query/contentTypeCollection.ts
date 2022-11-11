import {
  GraphQLFieldConfig,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLList,
} from 'graphql';

import type { CMSGraphQLFieldResolver } from '../../../types';

const createQueryContentTypeCollection = (
  contetnType: GraphQLObjectType,
  resolveFn: CMSGraphQLFieldResolver<any, any>,
): GraphQLFieldConfig<any, any> => ({
  type: new GraphQLNonNull(
    new GraphQLList(
      new GraphQLNonNull(contetnType),
    ),
  ),
  resolve: resolveFn,
});

export { createQueryContentTypeCollection };
