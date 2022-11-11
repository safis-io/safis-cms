import { GraphQLEnumType } from 'graphql';

import type { ContentType } from '../../types';
import { getGraphqlTypeName } from '../../helpers/graphql';

const createContentEnum = (
  contentTypesList: ContentType[],
): GraphQLEnumType => new GraphQLEnumType({
  name: 'ContentEnum',
  values: contentTypesList.reduce((valueMap, contentType) => {
    const graphqlTypeName = getGraphqlTypeName(contentType.id);
    return {
      ...valueMap,
      [graphqlTypeName]: { name: graphqlTypeName },
    };
  }, {}),
});

export { createContentEnum };
