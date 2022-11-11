import {
  GraphQLFieldConfig,
  GraphQLString,
  GraphQLNonNull,
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLObjectType,
} from 'graphql';

import { GraphQLTypeGettersMap } from '../../graphqlTypes';
import { CMSGraphQLFieldResolver } from '../../../types';

const createAddContentTypeInput = (
  contentTypeFieldInput: GraphQLInputObjectType,
) => new GraphQLInputObjectType({
  name: 'AddContentTypeInput',
  fields: {
    id: { type: GraphQLString },
    name: { type: new GraphQLNonNull(GraphQLString) },
    description: { type: GraphQLString },
    fields: {
      type: new GraphQLNonNull(
        new GraphQLList(
          new GraphQLNonNull(contentTypeFieldInput),
        ),
      ),
    },
  },
});

const createMutationAddContentType = (
  graphqlTypes: GraphQLTypeGettersMap,
  resolveFn: CMSGraphQLFieldResolver<any, any>,
): GraphQLFieldConfig<any, any> => {
  const addContentTypeInput = createAddContentTypeInput(
    graphqlTypes.ContentTypeFieldInput() as GraphQLInputObjectType,
  );

  return {
    type: new GraphQLNonNull(
      graphqlTypes.ContentType() as GraphQLObjectType,
    ),
    args: { data: { type: addContentTypeInput } },
    resolve: resolveFn,
  };
};

export { createMutationAddContentType };
