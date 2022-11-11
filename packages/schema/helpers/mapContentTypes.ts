import type { ContentType, ContentTypesMap } from '../types';

const mapContentTypes = (
  contentTypesList: ContentType[],
): ContentTypesMap => contentTypesList
  .reduce((ctMap, contentType) => ({
    ...ctMap,
    [contentType.id]: contentType,
  }), {});

export { mapContentTypes };
