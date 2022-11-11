import {
  GraphQLNonNull,
  GraphQLList,
  GraphQLType,
  GraphQLEnumType,
  GraphQLTypeResolver,
} from 'graphql';
import get from 'lodash.get';
import camelCase from 'lodash.camelcase';

import { ContentRef, ContentTypeFieldTypeEnum, FieldDefinition } from '../types';
import pascalCase from './pascalCase';
import { GraphQLTypeGettersMap } from '../schema/graphqlTypes';
import { RefResolver } from '../schema';

const getGraphqlTypeName = pascalCase;

const DEFAULT_REF_FIELD_DESC = `(\`ContentType.id\`). When \`type\` = \`${ContentTypeFieldTypeEnum.Ref}\`, it will create references based on selected types that are still avaible in schema.`;

export const getRefTypeDescription = (contentEnum: GraphQLEnumType): string => {
  const availableContentEnumValues = contentEnum.getValues().map(({ value }) => camelCase(value));

  if (!availableContentEnumValues.length) return `${DEFAULT_REF_FIELD_DESC}.\nNo types available yet.`;

  const availableTypesMessage = `Available types: \`${availableContentEnumValues.join('` | `')}\``;

  return `${DEFAULT_REF_FIELD_DESC}\n${availableTypesMessage}`;
};

const createGraphqlFieldType = ({
  graphqlType,
  isRequired,
  isList,
}: {
  graphqlType: GraphQLType,
  isRequired?: boolean,
  isList?: boolean
}): GraphQLType => {
  if (!isRequired && !isList) return graphqlType;

  const graphqlTypeAsRequired = isRequired
    ? new GraphQLNonNull(graphqlType) // graphqlType!
    : graphqlType;

  const graphqlTypeAsList = isList
    ? new GraphQLList(graphqlTypeAsRequired) // graphqlType[]
    : graphqlTypeAsRequired;

  return graphqlTypeAsList;
  // TODO: maybe do this
  // return isRequired
  //  ? new GraphQLNonNull(graphqlType) // graphqlType[]!
  //  : graphqlType
};

const resolveContentOrRefType: GraphQLTypeResolver<any, any> = (source) => {
  const typeId = get(source, 'sys.__contentTypeId') || get(source, 'type');

  if (!typeId) throw new Error('Unkown or missing content type id');

  return getGraphqlTypeName(typeId);
};

const filterRefTypes = (
  refTypes: string[] = [],
  graphQLTypeGettersMap: GraphQLTypeGettersMap,
): string[] => {
  const fileteredRefTypes = refTypes.filter((type) => graphQLTypeGettersMap[type]);
  const refTypesMap: { [key: string]: string } = fileteredRefTypes
    .reduce((typesMap, type) => ({
      ...typesMap,
      [type]: type,
    }), {});

  const nonDuplicateRefTypes = Object.values(refTypesMap);

  return nonDuplicateRefTypes;
};

// wraps refResolver in order to remove invalid refs added by the user
const removeInvalidRefsFromRefResolver = (
  field: FieldDefinition,
  refResolver: RefResolver,
): RefResolver => {
  if (!field.refTypes?.length) return refResolver;

  return (source, args, context, info) => {
    const { id: refFieldId, refTypes, isList } = field;
    const { [refFieldId]: refs } = source;

    if (
      !refs // required to validate individual refs
      || !refs.length
    ) {
      return refResolver(source, args, context, info);
    }

    const updatedSource = { ...source };

    if (isList) {
      updatedSource[refFieldId] = (refs as ContentRef[])?.filter(({ type }) => (
        refTypes?.includes(getGraphqlTypeName(type))
      ));
    } else {
      updatedSource[refFieldId] = refTypes?.includes(getGraphqlTypeName(refs?.type))
        ? refs
        : undefined;
    }

    return refResolver(updatedSource, args, context, info);
  };
};

export {
  createGraphqlFieldType,
  filterRefTypes,
  getGraphqlTypeName,
  resolveContentOrRefType,
  removeInvalidRefsFromRefResolver,
};
