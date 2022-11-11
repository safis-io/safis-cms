import { GraphQLFieldConfigMap } from 'graphql';

import { ContentFieldTypeMap, ResolverCreatorsMap } from '../..';
import { ContentType } from '../../../types';
import { GraphQLTypeGettersMap } from '../../graphqlTypes';
import { createAddContentMutationsMap } from './add';
import { createDeleteContentMutationsMap } from './delete';
import { createUpdateContentMutationsMap } from './update';

type CreateContentMutationsMapArgs = {
  contentTypesList: ContentType[],
  graphqlTypes: GraphQLTypeGettersMap,
  contentFieldTypeMap: ContentFieldTypeMap,
  resolverCreatorsMap: ResolverCreatorsMap,
}
const createContentMutationsMap = ({
  contentTypesList,
  graphqlTypes,
  contentFieldTypeMap,
  resolverCreatorsMap,
}: CreateContentMutationsMapArgs): GraphQLFieldConfigMap<any, any> => {
  const { addContent, updateContent, deleteContent } = resolverCreatorsMap;
  const addContentMutationsMap = createAddContentMutationsMap({
    contentTypesList,
    graphqlTypes,
    contentFieldTypeMap,
    resolverCreatorFn: addContent,
  });
  const updateContentMutationsMap = createUpdateContentMutationsMap({
    contentTypesList,
    graphqlTypes,
    contentFieldTypeMap,
    resolverCreatorFn: updateContent,
  });
  const deleteContentMutationsMap = createDeleteContentMutationsMap({
    contentTypesList,
    resolverCreatorFn: deleteContent,
  });

  return {
    ...addContentMutationsMap,
    ...updateContentMutationsMap,
    ...deleteContentMutationsMap,
  };
};

export { createContentMutationsMap };
