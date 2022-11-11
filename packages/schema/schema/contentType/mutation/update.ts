import type { GraphQLFieldConfig, GraphQLObjectType } from 'graphql';

import {
  GraphQLString,
  GraphQLNonNull,
  GraphQLInputObjectType,
  GraphQLList,
} from 'graphql';

import type { CMSGraphQLFieldResolver } from '../../../types';
import { GraphQLTypeGettersMap } from '../../graphqlTypes';

const createUpdateContentTypeInput = (
  contentTypeFieldInput: GraphQLInputObjectType,
) => new GraphQLInputObjectType({
  name: 'UpdateContentTypeInput',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLString) },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    fields: { type: new GraphQLList(new GraphQLNonNull(contentTypeFieldInput)) },
  },
});

const createMutationUpdateContentType = (
  graphqlTypes: GraphQLTypeGettersMap,
  resolveFn: CMSGraphQLFieldResolver<any, any>,
): GraphQLFieldConfig<any, any> => {
  const updateContentTypeInput = createUpdateContentTypeInput(
    graphqlTypes.ContentTypeFieldInput() as GraphQLInputObjectType,
  );
  return {
    type: new GraphQLNonNull(
      graphqlTypes.ContentType() as GraphQLObjectType,
    ),
    args: { data: { type: updateContentTypeInput } },
    resolve: resolveFn,
  };
};

export { createMutationUpdateContentType };
