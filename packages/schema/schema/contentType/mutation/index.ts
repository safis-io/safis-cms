import { GraphQLFieldConfigMap } from 'graphql';

import { ResolversMap } from '../..';
import { GraphQLTypeGettersMap } from '../../graphqlTypes';
import { createMutationAddContentType } from './add';
import { createMutationDeleteContentType } from './delete';
import { createMutationUpdateContentType } from './update';

const createContentTypeMutationsMap = (
  graphqlTypes: GraphQLTypeGettersMap,
  resolvers: ResolversMap<any>,
): GraphQLFieldConfigMap<any, any> => {
  const { addContentType, deleteContentType, updateContentType } = resolvers;

  return {
    addContentType: createMutationAddContentType(
      graphqlTypes,
      addContentType,
    ),
    deleteContentType: createMutationDeleteContentType(
      deleteContentType,
    ),
    updateContentType: createMutationUpdateContentType(
      graphqlTypes,
      updateContentType,
    ),
  };
};

export { createContentTypeMutationsMap };
