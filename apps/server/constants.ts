import { GitAdaptersEnum } from './types';

// git
export const GITHUB_ADAPTER = GitAdaptersEnum.GITHUB;
export const DEFAULT_GIT_ADAPTER = GITHUB_ADAPTER;
export const VISIBILITY_PRIVATE = 'private';
export const VISIBILITY_PUBLIC = 'public';
export const defaultBranches = Object.freeze({ [GITHUB_ADAPTER]: 'main' });

// paths
export const ROOT_FOLDER = '';
export const CONTENT_TYPES_FOLDER = 'contentTypes';
export const CONTENT_FOLDER = 'content';

// cookies
export const DEFAULT_DOMAIN = 'localhost'; // TODO: remove?

// oauth
export const DEFAULT_OAUTH_LOGIN_URL = '/oauth/login';
export const DEFAULT_OAUTH_CALLBACK_URL = '/oauth/callback';
export const DEFAULT_OAUTH_SCOPE = ['repo'];

// graphql
export const DEFAULT_GRAPHQL_ENDPOINT_URL = '/graphql';
