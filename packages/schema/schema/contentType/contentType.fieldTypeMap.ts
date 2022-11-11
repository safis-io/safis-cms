import type { GraphQLInterfaceType } from 'graphql';
import {
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLID,
} from 'graphql';
import { ContentTypeFieldTypeEnum } from '../../types';
import { ContentFieldTypeMap } from '../index';

const createContentFieldTypeMap = (
  contentInterface: GraphQLInterfaceType,
): ContentFieldTypeMap => ({
  [ContentTypeFieldTypeEnum.Ref]: {
    type: contentInterface,
    description: 'Reference to other content types.',
  }, // GraphQLObject({ refId: string, value: ContentEnum })
  [ContentTypeFieldTypeEnum.String]: { type: GraphQLString },
  // Int: GraphQLInt,
  [ContentTypeFieldTypeEnum.Number]: { type: GraphQLInt },
  // Float: GraphQLFloat,
  [ContentTypeFieldTypeEnum.Boolean]: { type: GraphQLBoolean },
  [ContentTypeFieldTypeEnum.ID]: { type: GraphQLID },
});

export { createContentFieldTypeMap };
