import { GraphQLFieldConfigMap, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';

import { getGraphqlTypeName } from '../../../helpers/graphql';
import type { ContentType } from '../../../types';
import type { ContentResolver, ResolverCreatorFn } from '../../index';
import { GraphQLTypeGettersMap } from '../../graphqlTypes';

const createContentQueryMap = (
  contentTypesList: ContentType[],
  graphqlTypes: GraphQLTypeGettersMap,
  resolverCreatorFn: ResolverCreatorFn<ContentResolver>,
): GraphQLFieldConfigMap<any, any> => contentTypesList
  .reduce((contentQueries, contentType) => {
    const graphqlTypeName = getGraphqlTypeName(contentType.id);
    const graphqlType = graphqlTypes[graphqlTypeName]() as GraphQLObjectType;
    const contentResolver = resolverCreatorFn(contentType);

    return {
      ...contentQueries,
      [contentType.id]: {
        type: graphqlType,
        args: { id: { type: new GraphQLNonNull(GraphQLString) } },
        resolve: contentResolver,
      },
    };
  }, {});

export { createContentQueryMap };
