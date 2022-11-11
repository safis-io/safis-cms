import {
  GraphQLFieldConfigMap,
  GraphQLID,
  GraphQLInputFieldConfig,
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLScalarType,
} from 'graphql';

import { ObjMap } from 'graphql/jsutils/ObjMap';
import { getGraphqlTypeName } from '../../../helpers/graphql';
import { ContentType, ContentTypeFieldTypeEnum } from '../../../types';
import type { ContentFieldTypeMap, ContentResolver, ResolverCreatorFn } from '../../index';
import { GraphQLTypeGettersMap } from '../../graphqlTypes';

const getInputTypeName = (contentTypeId: string): string => `Update${getGraphqlTypeName(contentTypeId)}Input`;

const createUpdateContentInput = (
  contentType: ContentType,
  contentFieldTypeMap: ContentFieldTypeMap,
) => {
  const inputFieldConfigMap = contentType.fields
    .filter(({ type }) => type !== ContentTypeFieldTypeEnum.Ref) // TODO: enable Ref types
    .reduce((inputsMap, field) => {
      const graphqlFieldTypeConfig = contentFieldTypeMap[field.type];
      const fieldTypeAsRequired = field.isRequired
        ? new GraphQLNonNull(graphqlFieldTypeConfig.type)
        : graphqlFieldTypeConfig.type;

      const fieldInputConfig: GraphQLInputFieldConfig = {
        type: fieldTypeAsRequired as GraphQLScalarType,
        description: field.description,
      };

      return { ...inputsMap, [field.id]: fieldInputConfig };
    }, {} as ObjMap<GraphQLInputFieldConfig>);

  return new GraphQLInputObjectType({
    name: getInputTypeName(contentType.id),
    fields: inputFieldConfigMap,
  });
};

type CreateUpdateContentMutationsMapArgs = {
  contentTypesList: ContentType[],
  graphqlTypes: GraphQLTypeGettersMap,
  contentFieldTypeMap: ContentFieldTypeMap,
  resolverCreatorFn: ResolverCreatorFn<ContentResolver>,
}

const createUpdateContentMutationsMap = ({
  contentTypesList,
  graphqlTypes,
  contentFieldTypeMap,
  resolverCreatorFn,
}: CreateUpdateContentMutationsMapArgs): GraphQLFieldConfigMap<any, any> => contentTypesList
  .reduce((contentQueries, contentType) => {
    const graphqlTypeName = getGraphqlTypeName(contentType.id);
    const graphqlType = graphqlTypes[graphqlTypeName]() as GraphQLObjectType;
    const updateContentInput = createUpdateContentInput(contentType, contentFieldTypeMap);
    const updateContentResolver = resolverCreatorFn(contentType);
    const args = {
      id: {
        type: new GraphQLNonNull(GraphQLID),
        description: 'System ID (`Content.sys.id`)',
      },
      data: {
        type: new GraphQLNonNull(updateContentInput),
        description: 'Content fields to update.',
      },
    };

    return {
      ...contentQueries,
      [`update${graphqlTypeName}`]: {
        type: graphqlType,
        args,
        resolve: updateContentResolver,
      },
    };
  }, {});

export { createUpdateContentMutationsMap };
