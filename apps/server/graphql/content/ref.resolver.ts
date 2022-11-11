import { ContentRef, FieldDefinition, RefResult, ResolverCreatorFn } from '@safis/cms-schema';
import { CMSResolver, ContextWithGitMetadata } from '../../types';

type RefResolver = CMSResolver<
  ContextWithGitMetadata,
  Promise<RefResult | RefResult[]>
>

const createRefResolver: ResolverCreatorFn<RefResolver, FieldDefinition> = (field) => async (
  source: {[fieldName: string]: any},
  args,
  { git },
): Promise<RefResult | RefResult[]> => {
  const refs = source[field.id] as ContentRef | ContentRef[] | null;
  if (!refs) return null;

  const { isList } = field;
  const refsList = isList ? refs as ContentRef[] : [refs as ContentRef];

  const result = await git.api.content.getMany({
    files: refsList,
    branch: git.branch,
  });

  return isList ? result as RefResult[] : result[0] as RefResult;
};

export { createRefResolver };
