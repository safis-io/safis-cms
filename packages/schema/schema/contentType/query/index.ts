import { GraphQLFieldConfig, GraphQLObjectType } from 'graphql';

import { ResolversMap } from '../..';
import { createQueryContentType } from './contentType';
import { createQueryContentTypeCollection } from './contentTypeCollection';

const createContentTypeQueryMap = (
  graphqlType: GraphQLObjectType,
  resolvers: ResolversMap<any>,
): { [queryName: string]: GraphQLFieldConfig<any, any, any> } => ({
  contentTypeCollection: createQueryContentTypeCollection(
    graphqlType,
    resolvers.contentTypeCollection,
  ),
  contentType: createQueryContentType(
    graphqlType,
    resolvers.contentType,
  ),
});

export { createContentTypeQueryMap };
