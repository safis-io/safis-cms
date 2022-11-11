import { GraphQLFieldConfigMap } from 'graphql';

import { createContentCollectionQueryMap } from './contentCollection';
import { createContentQueryMap as createGenericContentQueryMap } from './content';

import { ContentType } from '../../../types';
import { ResolverCreatorsMap } from '../../index';
import { GraphQLTypeGettersMap } from '../../graphqlTypes';

const createContentQueryMap = (
  contentTypesList: ContentType[],
  graphqlTypes: GraphQLTypeGettersMap,
  resolverCreatorsMap: ResolverCreatorsMap,
): GraphQLFieldConfigMap<any, any> => {
  const contentCollectionQueries = createContentCollectionQueryMap(
    contentTypesList,
    graphqlTypes,
    resolverCreatorsMap.contentCollection,
  );
  const contentQueries = createGenericContentQueryMap(
    contentTypesList,
    graphqlTypes,
    resolverCreatorsMap.content,
  );

  return {
    ...contentQueries,
    ...contentCollectionQueries,
  };
};

export { createContentQueryMap };
