import {
  GraphQLNonNull,
  GraphQLInterfaceType,
  GraphQLObjectType,
} from 'graphql';

import { CONTENT_INTERFACE_TYPE_NAME } from '../../constants/content';
import { resolveContentOrRefType } from '../../helpers/graphql';
import { GetGraphQLTypeGettersMapFn } from '../graphqlTypes';

const createContentInterface = (
  getGrpahqlTypes: GetGraphQLTypeGettersMapFn,
): GraphQLInterfaceType => new GraphQLInterfaceType({
  name: CONTENT_INTERFACE_TYPE_NAME,
  fields: () => {
    const ContentSys = getGrpahqlTypes().ContentSys() as GraphQLObjectType;

    return { sys: { type: new GraphQLNonNull(ContentSys) } };
  },
  resolveType: resolveContentOrRefType,
});

export { createContentInterface };
