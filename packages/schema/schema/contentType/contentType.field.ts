import { GraphQLObjectType, GraphQLEnumType } from 'graphql';

import type { GetGraphQLTypeGettersMapFn } from '../graphqlTypes';
import { createFieldsConfigMap } from './contentType.field.fieldsConfigMap';

const createContentTypeField = (
  getGraphQLTypeGettersMap: GetGraphQLTypeGettersMapFn,
): GraphQLObjectType => new GraphQLObjectType({
  name: 'ContentTypeField',
  fields: () => {
    const contentEnum = getGraphQLTypeGettersMap().ContentEnum() as GraphQLEnumType;
    const fieldTypeEnum = getGraphQLTypeGettersMap().ContentFieldTypeEnum() as GraphQLEnumType;

    return createFieldsConfigMap(contentEnum, fieldTypeEnum);
  },
});

export { createContentTypeField };
