import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLList,
} from 'graphql';

const createContentType = (
  contentTypeField: GraphQLObjectType,
): GraphQLObjectType => new GraphQLObjectType({
  name: 'ContentType',
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'Content type identifier.',
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'Display name.',
    },
    description: { type: GraphQLString },
    fields: {
      type: new GraphQLList(new GraphQLNonNull(contentTypeField)),
      description: 'List of fields that will describe the Content type.',
    },
  },
});

export { createContentType };
