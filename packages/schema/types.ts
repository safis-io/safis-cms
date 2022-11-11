/* eslint-disable no-use-before-define  */

import type { GraphQLFieldResolver } from 'graphql';

// ContentType types definitions

export enum ContentTypeFieldTypeEnum {
  String = 'String',
  Number = 'Number',
  Boolean = 'Boolean',
  Ref = 'Ref',
  ID = 'ID',
}

// Content types definitions

export interface ContentTypesTypeTransformationMap {
  [key: string]: string
}

export type GetFieldTypeArgs = {
  fieldType: string
  isList?: boolean
  isInput?: boolean
  isRequired?: boolean
}

export type FieldDefinition = {
  id: string
  name: string
  description?: string
  type: ContentTypeFieldTypeEnum
  refTypes?: string[]
  isRequired?: boolean
  isList?: boolean
}

export type ContentType = {
  id: string
  name: string
  fields: FieldDefinition[]
}

export type ContentTypesMap = {
  [contentTypeId: string]: ContentType
}

export type GraphQLTypeName = string

export type CreateContentTypeDefsArgs = {
  fields: FieldDefinition[],
  graphqlType: GraphQLTypeName,
  contentGraphQLTypes: GraphQLTypeName[],
}

export type ContentTypeDefs = {
  content: string[]
  queries: string[]
  mutations: string[]
}

export type CreateTypeDefsArgs = {
  contentTypes: string[],
  contentGraphQLTypes: GraphQLTypeName[]
  queries: string[]
  mutations: string[]
}

export type GenericContent = {
  [key: string]: any
}

export type ContentSysMetadata = {
  id: string
  __contentTypeId: string
}

export type Content = GenericContent & {
  sys: ContentSysMetadata
}

export type ContentRef = {
  type: string
  id: string
}

export type RefResult = Content | null

export type CMSGraphQLFieldResolver<TContext=any, TSource=any, TArgs=any, TResult=any>
  = GraphQLFieldResolver<TSource, TContext, TArgs, TResult>

export type SchemaUpdaterFn = () => Promise<void>;
