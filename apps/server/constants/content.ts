import { FILE_EXTENSION } from './shared';

export const REGEX_PATH_CONTENT_TYPE_ID = new RegExp(`(?:.*\\/)?(.*)\\/(?:.*)\\.${FILE_EXTENSION}$`);
