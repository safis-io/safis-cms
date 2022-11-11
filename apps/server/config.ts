import dotenv from 'dotenv';

import {
  defaultBranches,
  DEFAULT_GIT_ADAPTER,
  DEFAULT_OAUTH_CALLBACK_URL,
  DEFAULT_OAUTH_LOGIN_URL,
  DEFAULT_OAUTH_SCOPE,
  VISIBILITY_PRIVATE,
  DEFAULT_GRAPHQL_ENDPOINT_URL,
  CONTENT_TYPES_FOLDER,
  CONTENT_FOLDER,
} from './constants';
import { checkConfig } from './helpers';
import { GitConfig, GraphqlConfig, OAuthConfig, SecretsConfig, ServerConfig } from './types';

const gitAdapter = DEFAULT_GIT_ADAPTER;

dotenv.config({ path: `${process.env.DOTENV_PATH || '.'}/.env` });

// Server
const serverConfig: ServerConfig = {
  PORT: process.env.PORT || 3000,
  enableLogger: process.env.LOGGER === 'true',
  cookieDomain: process.env.COOKIE_DOMAIN,
  isProduction: process.env.NODE_ENV === 'production',
};

checkConfig('server', serverConfig, ['cookieDomain']);

// GraphQL
const graphqlConfig: GraphqlConfig = {
  graphiql: process.env.GRAPHIQL === 'true',
  path: process.env.GRAPHQL_PATH || DEFAULT_GRAPHQL_ENDPOINT_URL,
};

checkConfig('server', serverConfig, ['cookieDomain']);

const secrets: SecretsConfig = {
  gitOwner: process.env.GIT_OWNER_SECRET as string,
  cookie: process.env.COOKIE_SECRET as string,
  oauthClient: process.env.GIT_OAUTH_CLIENT_SECRET as string,
};

checkConfig('secrets', secrets);

// Git
const envGitPaths = {
  root: process.env.GIT_ROOT_FOLDER,
  contentType: process.env.GIT_CONTENT_TYPES_FOLDER = CONTENT_TYPES_FOLDER,
  content: process.env.GIT_CONTENT_FOLDER = CONTENT_FOLDER,
};

const gitConfig: GitConfig = {
  adapter: gitAdapter,
  defaultBranch: process.env.GIT_DEFAULT_BRANCH || defaultBranches[gitAdapter],
  isPrivate: process.env.GIT_REPO_VISIBILITY === VISIBILITY_PRIVATE,
  owner: process.env.GIT_OWNER as string,
  paths: envGitPaths,
  repo: process.env.GIT_REPO as string,
};

checkConfig('git', gitConfig);

const oauthConfig: OAuthConfig = {
  callback: process.env.OAUTH_CALLBACK_URL || DEFAULT_OAUTH_CALLBACK_URL,
  clientId: process.env.GIT_OAUTH_CLIENT_ID as string,
  scope: process.env.GIT_OAUTH_SCOPE?.split(',') || DEFAULT_OAUTH_SCOPE,
  login: process.env.OAUTH_LOGIN_URL || DEFAULT_OAUTH_LOGIN_URL,
};

checkConfig('oauth', oauthConfig);

export {
  serverConfig as server,
  gitConfig as git,
  graphqlConfig as graphql,
  oauthConfig as oauth,
  secrets,
};
