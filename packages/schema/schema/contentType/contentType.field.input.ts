import {
  GraphQLEnumType,
  GraphQLInputObjectType,
  GraphQLInputFieldConfigMap,
} from 'graphql';

import { GetGraphQLTypeGettersMapFn } from '../graphqlTypes';
import { createFieldsConfigMap } from './contentType.field.fieldsConfigMap';

const createContentTypeFieldInput = (
  getGraphQLTypeGettersMap: GetGraphQLTypeGettersMapFn,
): GraphQLInputObjectType => new GraphQLInputObjectType({
  name: 'ContentTypeFieldInput',
  fields: () => {
    const contentEnum = getGraphQLTypeGettersMap().ContentEnum() as GraphQLEnumType;
    const fieldTypeEnum = getGraphQLTypeGettersMap().ContentFieldTypeEnum() as GraphQLEnumType;

    return createFieldsConfigMap(contentEnum, fieldTypeEnum) as GraphQLInputFieldConfigMap;
  },
});

export { createContentTypeFieldInput };
