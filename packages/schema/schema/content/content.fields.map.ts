import {
  GraphQLFieldConfigMap,
  GraphQLType,
  GraphQLFieldConfig,
  GraphQLFieldResolver,
} from 'graphql';

import type { ContentFieldTypeMap, ResolverCreatorsMap } from '../index';
import { ContentType, ContentTypeFieldTypeEnum, FieldDefinition } from '../../types';
import { GraphQLTypeGettersMap } from '../graphqlTypes';
import { getRefType } from './content.fields.refType';
import {
  createGraphqlFieldType,
  filterRefTypes,
  getGraphqlTypeName,
  removeInvalidRefsFromRefResolver,
} from '../../helpers/graphql';

const createFieldType = ({
  contentTypeId,
  field,
  graphqlContentFieldTypesMap,
  graphQLTypeGettersMap,
}: {
  contentTypeId: string
  field: FieldDefinition
  graphqlContentFieldTypesMap: ContentFieldTypeMap
  graphQLTypeGettersMap: GraphQLTypeGettersMap
}): GraphQLType => {
  const { type, refTypes, isRequired, isList, id: fieldId } = field;
  const { [type]: graphqlFieldTypeObj } = graphqlContentFieldTypesMap;
  const { type: graphqlFieldType } = graphqlFieldTypeObj || {};
  const graphqlRefType = graphqlContentFieldTypesMap[ContentTypeFieldTypeEnum.Ref].type;

  const isRefType = graphqlFieldType === graphqlRefType;
  const graphqlType = isRefType
    ? getRefType({
      contentTypeId,
      fieldId,
      graphQLTypeGettersMap,
      refTypes,
    })
    : graphqlFieldType;

  return createGraphqlFieldType({ graphqlType, isList, isRequired: !isRefType && isRequired });
};

const createContentFieldsMap = ({
  contentType,
  graphqlContentFieldTypesMap,
  graphQLTypeGettersMap,
  resolverCreators,
}: {
  contentType: ContentType,
  graphqlContentFieldTypesMap: ContentFieldTypeMap,
  graphQLTypeGettersMap: GraphQLTypeGettersMap,
  resolverCreators: ResolverCreatorsMap
}): GraphQLFieldConfigMap<any, any> => (
  contentType.fields.reduce((fieldsMap, field) => {
    const updatedField: FieldDefinition = { ...field };
    const isRefType = field.type === ContentTypeFieldTypeEnum.Ref;
    let fieldResolver: GraphQLFieldResolver<any, any> | undefined;

    if (isRefType) {
      const gqlRefTypes = updatedField.refTypes?.map(getGraphqlTypeName);
      const fileteredRefTypes = filterRefTypes(gqlRefTypes, graphQLTypeGettersMap);

      if (!fileteredRefTypes?.length) return fieldsMap;

      updatedField.refTypes = fileteredRefTypes;

      fieldResolver = removeInvalidRefsFromRefResolver(
        updatedField,
        resolverCreators.ref(updatedField),
      );
    }

    return {
      ...fieldsMap,
      [updatedField.id]: {
        type: createFieldType({
          contentTypeId: contentType.id,
          field: updatedField,
          graphqlContentFieldTypesMap,
          graphQLTypeGettersMap,
        }),
        description: updatedField.description,
        resolve: fieldResolver,
      } as GraphQLFieldConfig<any, any>,
    };
  }, {})
);

export { createContentFieldsMap };
