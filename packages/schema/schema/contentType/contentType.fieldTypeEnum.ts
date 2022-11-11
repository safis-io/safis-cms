import { GraphQLEnumType } from 'graphql';

import type { ContentFieldTypeMap } from '../index';

const createContentFieldTypeEnum = (
  contentFieldTypesMap: ContentFieldTypeMap,
): GraphQLEnumType => new GraphQLEnumType({
  name: 'ContentFieldTypeEnum',
  values: Object
    .keys(contentFieldTypesMap)
    .reduce((valueMap, enumValue) => ({
      ...valueMap,
      [enumValue]: {
        name: enumValue,
        description: (contentFieldTypesMap as { [key: string]: any })[enumValue].description,
      },
    }), {}),
});

export { createContentFieldTypeEnum };
