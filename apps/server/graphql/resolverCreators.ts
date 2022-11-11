import type { ResolverCreatorsMap } from '@safis/cms-schema';

import { contentQueryResolverCreatorsMap } from './content/query';
import { contentMutationResolverCreatorsMap } from './content/mutations';
import { createRefResolver } from './content/ref.resolver';

const resolverCreatorsMap: ResolverCreatorsMap = {
  ...contentQueryResolverCreatorsMap,
  ...contentMutationResolverCreatorsMap,

  ref: createRefResolver,
};

export { resolverCreatorsMap };
