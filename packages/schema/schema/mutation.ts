import { GraphQLObjectType } from 'graphql';

import { ContentFieldTypeMap, ResolverCreatorsMap, ResolversMap } from './index';
import type { CMSGraphQLFieldResolver, ContentType, SchemaUpdaterFn } from '../types';
import type { GraphQLTypeGettersMap } from './graphqlTypes';
import { createContentTypeMutationsMap } from './contentType/mutation';
import { createContentMutationsMap } from './content/mutation';

export type ReflectStructuralChangeFn = (
  mutationResolver: CMSGraphQLFieldResolver,
) => CMSGraphQLFieldResolver

const createSchemaUpdaterHandler = (
  schemaUpdater: SchemaUpdaterFn,
): ReflectStructuralChangeFn => (
  mutationResolver: CMSGraphQLFieldResolver,
): CMSGraphQLFieldResolver => async (...args) => {
  const result = await mutationResolver(...args);

  schemaUpdater();

  return result;
};

type CreateMutationArgs = {
  contentTypesList: ContentType[],
  graphqlTypes: GraphQLTypeGettersMap,
  contentFieldTypeMap: ContentFieldTypeMap,
  resolvers: ResolversMap<any>,
  schemaUpdater: SchemaUpdaterFn,
  resolverCreatorsMap: ResolverCreatorsMap,
}

const createMutation = ({
  contentTypesList,
  graphqlTypes,
  contentFieldTypeMap,
  resolvers,
  schemaUpdater,
  resolverCreatorsMap,
}: CreateMutationArgs): GraphQLObjectType => {
  const reflectStructuralChange: ReflectStructuralChangeFn = createSchemaUpdaterHandler(
    schemaUpdater,
  );
  const { addContentType, deleteContentType, updateContentType } = resolvers;
  const contentTypeResolvers = {
    addContentType: reflectStructuralChange(addContentType),
    deleteContentType: reflectStructuralChange(deleteContentType),
    updateContentType: reflectStructuralChange(updateContentType),
  };

  return new GraphQLObjectType({
    name: 'Mutation',
    fields: () => {
      const contentTypeMutationsMap = createContentTypeMutationsMap(
        graphqlTypes,
        contentTypeResolvers,
      );
      const contentMutationsMap = createContentMutationsMap({
        contentTypesList,
        graphqlTypes,
        contentFieldTypeMap,
        resolverCreatorsMap,
      });

      return {
        ...contentTypeMutationsMap,
        ...contentMutationsMap,
      };
    },
  });
};

export { createMutation };
