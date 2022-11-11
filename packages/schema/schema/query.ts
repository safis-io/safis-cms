import { GraphQLObjectType } from 'graphql';

import type { ResolverCreatorsMap, ResolversMap } from './index';
import type { ContentType, ContentTypesMap } from '../types';
import type { GraphQLTypeGettersMap } from './graphqlTypes';
import { createContentQueryMap } from './content/query';
import { createContentTypeQueryMap } from './contentType/query';

export type ContentTypeMetadata = {
  contentTypesList: ContentType[]
  contentTypesMap: ContentTypesMap
}

const createQuery = (
  contentTypesList: ContentType[],
  graphqlTypes: GraphQLTypeGettersMap,
  resolvers: ResolversMap<any>,
  resolverCreatorsMap: ResolverCreatorsMap,
): GraphQLObjectType => new GraphQLObjectType({
  name: 'Query',
  fields: () => {
    const genericContentQueries = createContentQueryMap(
      contentTypesList,
      graphqlTypes,
      resolverCreatorsMap,
    );
    const graphqlContentType = graphqlTypes.ContentType() as GraphQLObjectType;
    const contentTypeQueryMap = createContentTypeQueryMap(graphqlContentType, resolvers);

    return {
      ...contentTypeQueryMap,
      ...genericContentQueries,
    };
  },
});
export { createQuery };
