import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLInterfaceType,
} from 'graphql';

import type { ContentType } from '../../types';
import { getGraphqlTypeName } from '../../helpers/graphql';
import { createContentFieldsMap } from './content.fields.map';
import { GetGraphQLTypeGettersMapFn } from '../graphqlTypes';
import { ContentFieldTypeMap, ResolverCreatorsMap } from '../index';

const createUserDefinedContentType = ({
  contentType,
  graphqlContentFieldTypesMap,
  getGraphqlTypeGetters,
  resolverCreators,
}: {
  contentType: ContentType,
  graphqlContentFieldTypesMap: ContentFieldTypeMap,
  getGraphqlTypeGetters: GetGraphQLTypeGettersMapFn,
  resolverCreators: ResolverCreatorsMap,
}): GraphQLObjectType => {
  const graphqlTypeName = getGraphqlTypeName(contentType.id);

  return new GraphQLObjectType({
    name: graphqlTypeName,
    interfaces: () => [getGraphqlTypeGetters().ContentInterface() as GraphQLInterfaceType],
    fields: () => ({
      ...createContentFieldsMap({
        contentType,
        graphqlContentFieldTypesMap,
        graphQLTypeGettersMap: getGraphqlTypeGetters(),
        resolverCreators,
      }),

      // CMS fields
      sys: { type: new GraphQLNonNull(getGraphqlTypeGetters().ContentSys() as GraphQLObjectType) },
    }),
  });
};

export type GraphQLUserDefinedContentTypesMap = {
  [key: string]: GraphQLObjectType
}
const createUserDefinedContentTypesMap = ({
  contentTypesList,
  graphqlContentFieldTypesMap,
  getGraphqlTypeGetters,
  resolverCreators,
}: {
  contentTypesList: ContentType[],
  graphqlContentFieldTypesMap: ContentFieldTypeMap,
  getGraphqlTypeGetters: GetGraphQLTypeGettersMapFn,
  resolverCreators: ResolverCreatorsMap
}): GraphQLUserDefinedContentTypesMap => contentTypesList
  .reduce((userDefinedContentType, contentType) => ({
    ...userDefinedContentType,
    [getGraphqlTypeName(contentType.id)]: createUserDefinedContentType({
      contentType,
      graphqlContentFieldTypesMap,
      getGraphqlTypeGetters,
      resolverCreators,
    }),
  }), {});

export { createUserDefinedContentTypesMap };
