import { REGEX_PATH_CONTENT_TYPE_ID } from '../constants/content';
import { FILE_EXTENSION } from '../constants/shared';

// contentTypes

// TODO: REMOVE
export const getContentFileName = (id: string): string => `${id}.${FILE_EXTENSION}`;

// content
export const getContentTypeIdFromContentPath = (path = ''): string => (path.match(REGEX_PATH_CONTENT_TYPE_ID) || [])[1];

export const getContentPath = (sysId: string, id: string): string => `${sysId}/${getContentFileName(id)}`;
