import {
  GraphQLBoolean,
  GraphQLFieldConfigMap,
  GraphQLID,
  GraphQLNonNull,
} from 'graphql';

import { getGraphqlTypeName } from '../../../helpers/graphql';
import { CMSGraphQLFieldResolver, ContentType } from '../../../types';
import type { ResolverCreatorFn } from '../../index';

type CreateDeleteContentMutationsMapArgs = {
  contentTypesList: ContentType[],
  resolverCreatorFn: ResolverCreatorFn<CMSGraphQLFieldResolver<any, any, any, Promise<boolean>>>,
}

const createDeleteContentMutationsMap = ({
  contentTypesList,
  resolverCreatorFn,
}: CreateDeleteContentMutationsMapArgs): GraphQLFieldConfigMap<any, any> => contentTypesList
  .reduce((contentQueries, contentType) => {
    const graphqlTypeName = getGraphqlTypeName(contentType.id);
    const deleteContentResolver = resolverCreatorFn(contentType);
    const args = {
      id: {
        type: new GraphQLNonNull(GraphQLID),
        description: 'System ID (`Content.sys.id`)',
      },
    };

    return {
      ...contentQueries,
      [`delete${graphqlTypeName}`]: {
        type: new GraphQLNonNull(GraphQLBoolean),
        args,
        resolve: deleteContentResolver,
      },
    };
  }, {});

export { createDeleteContentMutationsMap };
