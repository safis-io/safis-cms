import type { GraphQLEnumType, GraphQLInputObjectType, GraphQLInterfaceType, GraphQLType } from 'graphql';
import { GraphQLObjectType } from 'graphql';

import type { ContentType, ContentTypesMap } from '../types';
import { createContentFieldTypeMap } from './contentType/contentType.fieldTypeMap';
import { createContentFieldTypeEnum } from './contentType/contentType.fieldTypeEnum';
import { createContentTypeField } from './contentType/contentType.field';
import { createContentTypeFieldInput } from './contentType/contentType.field.input';
import { createContentType } from './contentType/contentType';
import { createContentInterface } from './content/content.interface';
import { createContentSys } from './content/content.sys';
import { createContentEnum } from './content/content.enum';
import { createRefInput } from './content/content.ref.input';
import type { ContentFieldTypeMap, ResolverCreatorsMap } from './index';
import { createUserDefinedContentTypesMap } from './content/content';

export type GraphQLTypeGetter<
  GraphQLReturnType =
    GraphQLObjectType
    | GraphQLEnumType
    | GraphQLInputObjectType
    | GraphQLInterfaceType
> = () =>
GraphQLReturnType;
export type GraphQLTypeGettersMap = { [typeName: string]: GraphQLTypeGetter }

export type GetGraphQLTypeGettersMapFn = () => GraphQLTypeGettersMap

export type SchemaGraphQLTypesMap = {
  ContentEnum: GraphQLEnumType
  ContentFieldTypeEnum: GraphQLEnumType
  ContentType: GraphQLObjectType
  ContentTypeFieldInput: GraphQLInputObjectType
  ContentSys: GraphQLObjectType
  ContentInterface: GraphQLInterfaceType

  // getContent: GraphQLTypeGetterFuntion
}

const createGraphqlTypes = (
  contentTypesList: ContentType[],
  contentTypesMap: ContentTypesMap,
  resolverCreators: ResolverCreatorsMap,
): {
  contentFieldTypeMap: ContentFieldTypeMap
  types: GraphQLTypeGettersMap
  getTypeGetterMap: GetGraphQLTypeGettersMapFn
} => {
  const RefInput = createRefInput();
  const ContentEnum = createContentEnum(contentTypesList);
  const ContentInterface = createContentInterface(
    getTypeGetterMap, // eslint-disable-line no-use-before-define
  );

  const contentFieldTypeMap = createContentFieldTypeMap(ContentInterface);

  const ContentFieldTypeEnum = createContentFieldTypeEnum(contentFieldTypeMap);
  const ContentTypeField = createContentTypeField(
    getTypeGetterMap, // eslint-disable-line no-use-before-define
  );
  const ContentType = createContentType(ContentTypeField);
  const ContentTypeFieldInput = createContentTypeFieldInput(
    getTypeGetterMap, // eslint-disable-line no-use-before-define
  );
  const ContentSys = createContentSys(contentTypesMap, ContentType);

  const userDefinedContentTypesMap = createUserDefinedContentTypesMap({
    contentTypesList,
    graphqlContentFieldTypesMap: contentFieldTypeMap,
    // eslint-disable-next-line no-use-before-define
    getGraphqlTypeGetters: getTypeGetterMap,
    resolverCreators,
  });

  function getTypeGetterMap() {
    const graphqlTypes: { [type: string]: GraphQLType } = {
      // Content
      ContentEnum,
      ContentSys,
      ContentInterface,
      Content: ContentInterface,
      RefInput,

      // ContentType
      ContentFieldTypeEnum,
      ContentType,
      ContentTypeFieldInput,

      // User defined content types
      ...userDefinedContentTypesMap,
    };
    return Object
      .keys(graphqlTypes)
      .reduce((gettersMap, typeName) => {
        const graphqlType = graphqlTypes[typeName];
        const getterFn: GraphQLTypeGetter<typeof graphqlType> = () => graphqlType;

        return {
          ...gettersMap,
          [typeName]: getterFn,
        };
      }, {});
  }

  return {
    contentFieldTypeMap,
    types: getTypeGetterMap(),
    getTypeGetterMap,
  };
};

export { createGraphqlTypes };
