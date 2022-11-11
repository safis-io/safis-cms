import { GraphQLFieldConfigMap, GraphQLList, GraphQLNonNull, GraphQLObjectType } from 'graphql';

import { getGraphqlTypeName } from '../../../helpers/graphql';
import type { ContentType } from '../../../types';
import type { ContentCollectionResolver, ResolverCreatorFn } from '../../index';
import { GraphQLTypeGettersMap } from '../../graphqlTypes';

const createContentCollectionResolveFn = (
  contentType: ContentType,
  resolverCreatorFn: ResolverCreatorFn<ContentCollectionResolver>,
): ContentCollectionResolver => async (...args) => {
  const resolveFn = resolverCreatorFn(contentType);

  return (await resolveFn(...args)) || [];
};

const createContentCollectionQueryMap = (
  contentTypesList: ContentType[],
  graphqlTypes: GraphQLTypeGettersMap,
  resolverCreatorFn: ResolverCreatorFn<ContentCollectionResolver>,
): GraphQLFieldConfigMap<any, any> => contentTypesList
  .reduce((contentCollectionQueries, contentType) => {
    const graphqlTypeName = getGraphqlTypeName(contentType.id);
    const graphqlType = graphqlTypes[graphqlTypeName]() as GraphQLObjectType;
    const contentColectionResolver = createContentCollectionResolveFn(
      contentType,
      resolverCreatorFn,
    );

    return {
      ...contentCollectionQueries,
      [`${contentType.id}Collection`]: {
        type: new GraphQLNonNull( // [GraphqlUserDefinedType!]!
          new GraphQLList(
            new GraphQLNonNull(graphqlType),
          ),
        ),
        resolve: contentColectionResolver,
      },
    };
  }, {});

export { createContentCollectionQueryMap };
