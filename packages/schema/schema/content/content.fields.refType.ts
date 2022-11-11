import {
  GraphQLType,
  GraphQLUnionType,
  GraphQLObjectType,
  ThunkReadonlyArray,
} from 'graphql';
import { getGraphqlTypeName, resolveContentOrRefType } from '../../helpers/graphql';
import { GraphQLTypeGettersMap } from '../graphqlTypes';

const createRefUnionType = ({
  contentTypeId,
  fieldId,
  graphQLTypeGettersMap,
  refTypes,
}: {
  contentTypeId: string
  fieldId: string
  graphQLTypeGettersMap: GraphQLTypeGettersMap
  refTypes: string[]
}): GraphQLUnionType => {
  const types: ThunkReadonlyArray<GraphQLObjectType<any, any>> = refTypes
    .map((graphqlType) => graphQLTypeGettersMap[graphqlType]() as GraphQLObjectType);

  return new GraphQLUnionType({
    name: `${getGraphqlTypeName(contentTypeId)}${getGraphqlTypeName(fieldId)}Items`,
    types,
    resolveType: resolveContentOrRefType,
  });
};

const getRefType = ({
  contentTypeId,
  fieldId,
  graphQLTypeGettersMap,
  refTypes = [],
}: {
  contentTypeId: string
  fieldId: string
  graphQLTypeGettersMap: GraphQLTypeGettersMap
  refTypes?: string[] | undefined
}): GraphQLType => {
  if (!refTypes.length) return graphQLTypeGettersMap.ContentInterface();

  if (refTypes.length === 1) return graphQLTypeGettersMap[refTypes[0]]();

  return createRefUnionType({
    contentTypeId,
    fieldId,
    graphQLTypeGettersMap,
    refTypes,
  });
};

export { getRefType };
