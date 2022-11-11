import {
  GraphQLNonNull,
  GraphQLInputObjectType,
  GraphQLID,
  GraphQLString,
} from 'graphql';

const createRefInput = (): GraphQLInputObjectType => new GraphQLInputObjectType({
  name: 'RefInput',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLID),
      description: '(`Content.sys.id`). System ID',
    },
    type: {
      type: new GraphQLNonNull(GraphQLString),
      description: '(`ContentType.id`). One of the types allowed in `field.refTypes` config.',
    },
  }),
});

export { createRefInput };
