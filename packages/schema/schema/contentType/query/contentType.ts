import type { GraphQLFieldConfig, GraphQLObjectType } from 'graphql';
import {
  GraphQLString,
  GraphQLNonNull,
} from 'graphql';
import type { CMSGraphQLFieldResolver } from '../../../types';

const createQueryContentType = (
  contentType: GraphQLObjectType,
  resolveFn: CMSGraphQLFieldResolver<any, any>,
): GraphQLFieldConfig<any, any> => ({
  type: contentType,
  args: { id: { type: new GraphQLNonNull(GraphQLString) } },
  resolve: resolveFn,
});

export { createQueryContentType };
