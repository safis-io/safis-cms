import {
  GraphQLString,
  GraphQLEnumType,
  GraphQLNonNull,
  GraphQLList,
  GraphQLBoolean,
  GraphQLFieldConfigMap,
} from 'graphql';

import { getRefTypeDescription } from '../../helpers/graphql';
import { ContentTypeFieldTypeEnum } from '../../types';

const FIELD_IS_REQUIRED_DESCRIPTION = `Marks the field as required when \`true\`.\nThis option will be ignored if \`type = ${ContentTypeFieldTypeEnum.Ref}\`.`;
const FIELD_IS_LIST_DESCRIPTION = 'Indicates if the field will contain a single element or multiple ones.';
const FIELD_TYPE_DESCRIPTION = 'Type of data to be stored in this field. e.g.: `String`, `Boolean`, etc.';
const FIELD_NAME_DESCRIPTION = 'Display name.';

const createFieldsConfigMap = (
  gqlContentEnum: GraphQLEnumType,
  gqlFieldTypeEnum: GraphQLEnumType,
): GraphQLFieldConfigMap<any, any> => ({
  id: {
    type: new GraphQLNonNull(GraphQLString),
    description: FIELD_TYPE_DESCRIPTION,
  },
  name: {
    type: new GraphQLNonNull(GraphQLString),
    description: FIELD_NAME_DESCRIPTION,
  },
  description: { type: GraphQLString },
  type: {
    type: new GraphQLNonNull(gqlFieldTypeEnum),
    description: FIELD_TYPE_DESCRIPTION,
  },
  refTypes: {
    description: getRefTypeDescription(gqlContentEnum),
    type: new GraphQLList(
      new GraphQLNonNull(GraphQLString),
    ),
  },
  isList: {
    type: GraphQLBoolean,
    description: FIELD_IS_LIST_DESCRIPTION,
  },
  isRequired: {
    type: GraphQLBoolean,
    description: FIELD_IS_REQUIRED_DESCRIPTION,
  },
});

export { createFieldsConfigMap };
