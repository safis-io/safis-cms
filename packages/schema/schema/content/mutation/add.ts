import {
  GraphQLFieldConfigMap,
  GraphQLInputFieldConfig,
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLResolveInfo,
  GraphQLScalarType,
} from 'graphql';
import { v4 as uuidv4 } from 'uuid';

import { ObjMap } from 'graphql/jsutils/ObjMap';
import { createGraphqlFieldType, getGraphqlTypeName } from '../../../helpers/graphql';
import { Content, ContentType, ContentTypeFieldTypeEnum, GenericContent } from '../../../types';
import type { ContentFieldTypeMap, ContentResolver, ResolverCreatorFn } from '../../index';
import { GraphQLTypeGettersMap } from '../../graphqlTypes';

const getInputTypeName = (contentTypeId: string): string => `Add${getGraphqlTypeName(contentTypeId)}Input`;

const createAddContentInput = (
  contentType: ContentType,
  contentFieldTypeMap: ContentFieldTypeMap,
  graphqlRefInputType: GraphQLInputObjectType,
) => {
  const inputFieldConfigMap = contentType.fields
    .reduce((inputsMap, field) => {
      const graphqlFieldTypeConfig = contentFieldTypeMap[field.type];
      const graphqlRefType = contentFieldTypeMap[ContentTypeFieldTypeEnum.Ref].type;
      const graphqlType = graphqlFieldTypeConfig.type === graphqlRefType
        ? graphqlRefInputType
        : graphqlFieldTypeConfig.type;

      const fieldInputConfig: GraphQLInputFieldConfig = {
        type: createGraphqlFieldType({
          graphqlType,
          isList: field.isList,
          isRequired: field.isRequired,
        }) as GraphQLScalarType | GraphQLInputObjectType,
        description: field.description,
      };

      return { ...inputsMap, [field.id]: fieldInputConfig };
    }, {} as ObjMap<GraphQLInputFieldConfig>);

  return new GraphQLInputObjectType({
    name: getInputTypeName(contentType.id),
    fields: inputFieldConfigMap,
  });
};

const addContentSysMetadata = (
  contentType: ContentType,
  content: GenericContent,
): Content => ({
  ...content,
  sys: {
    id: uuidv4(),
    __contentTypeId: contentType.id,
  },
});

const createAddContentResolveFn = (
  contentType: ContentType,
  resolverCreatorFn: ResolverCreatorFn<ContentResolver>,
): ContentResolver => async (
  source: any,
  args: any,
  context: any,
  info: GraphQLResolveInfo,
) => {
  const { data: inputContentData } = args;

  const resolveFn = resolverCreatorFn(contentType);

  const updatedDataInput = addContentSysMetadata(contentType, inputContentData);

  const updatedArgs = {
    ...args,
    data: updatedDataInput,
  };

  return resolveFn(source, updatedArgs, context, info);
};

type CreateAddContentMutationsMapArgs = {
  contentTypesList: ContentType[],
  graphqlTypes: GraphQLTypeGettersMap,
  contentFieldTypeMap: ContentFieldTypeMap,
  resolverCreatorFn: ResolverCreatorFn<ContentResolver>,
}

const createAddContentMutationsMap = ({
  contentTypesList,
  graphqlTypes,
  contentFieldTypeMap,
  resolverCreatorFn,
}: CreateAddContentMutationsMapArgs): GraphQLFieldConfigMap<any, any> => contentTypesList
  .reduce((contentQueries, contentType) => {
    const graphqlTypeName = getGraphqlTypeName(contentType.id);
    const graphqlType = graphqlTypes[graphqlTypeName]() as GraphQLObjectType;
    const addContentInput = createAddContentInput(
      contentType,
      contentFieldTypeMap,
      graphqlTypes.RefInput() as GraphQLInputObjectType,
    );
    const args = { data: { type: new GraphQLNonNull(addContentInput) } };
    const addContentResolver = createAddContentResolveFn(contentType, resolverCreatorFn);

    return {
      ...contentQueries,
      [`add${graphqlTypeName}`]: {
        type: graphqlType,
        args,
        resolve: addContentResolver,
      },
    };
  }, {});

export { createAddContentMutationsMap };
