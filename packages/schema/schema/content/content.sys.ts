import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
} from 'graphql';

import type { ContentSysMetadata, ContentTypesMap } from '../../types';

const createContentSys = (
  contentTypesMap: ContentTypesMap,
  graphqlContentType: GraphQLObjectType,
): GraphQLObjectType => new GraphQLObjectType({
  name: 'ContentSys',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLString) },
    contentType: {
      type: new GraphQLNonNull(graphqlContentType),
      // eslint-disable-next-line no-underscore-dangle
      resolve: ({ __contentTypeId }: ContentSysMetadata) => contentTypesMap[__contentTypeId],
    },
  },
});

export { createContentSys };
