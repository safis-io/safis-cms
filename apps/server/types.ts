import type {
  GitAdapterApi,
  RepoPaths,
} from '@safis/cms-github-adapter/types';
import type {
  CMSGraphQLFieldResolver,
  ContentType,
  ContentTypesMap,
} from '@safis/cms-schema';
import { createSchema } from '@safis/cms-schema';
import { GitHubAdapter } from '@safis/cms-github-adapter';
import mercurius from 'mercurius';
import { FastifyRequest, FastifyReply } from 'fastify';

// Configs

// only supports GitHub at this moment
export enum GitAdaptersEnum {
  GITHUB = 'github'
}

export type ServerConfig = {
  PORT: string | number;
  enableLogger: boolean;
  cookieDomain?: string;
  isProduction: boolean;
}

export type GraphqlConfig = {
  graphiql: boolean;
  path: string;
}

export type GitConfig = {
  adapter: GitAdaptersEnum;
  defaultBranch: string;
  isPrivate: boolean;
  owner: string;
  paths: RepoPaths;
  repo: string;
}

export type OAuthConfig = {
  callback: string;
  clientId: string;
  scope: string[];
  login: string;
}

export type SecretsConfig = {
  gitOwner: string;
  cookie: string;
  oauthClient: string;
}

// Plugins

// configPlugin
export type ConfigsDecorator = {
  cookieDomain?: string
  isProduction: boolean
  oauth: OAuthConfig
}

// graphqlPlugin

export type GitContext<GitApi = any> = {
  owner: string,
  repo: string,
  branch: string,
  paths: RepoPaths
  api: GitApi
}

export interface CMSContext {
  contentTypesList: ContentType[]
  contentTypesMap: ContentTypesMap
}

export interface Context {
  CustomGraphQLError: typeof mercurius.ErrorWithProps
  cms: CMSContext
}

export interface ContextWithGitMetadata extends Context {
  git: GitContext<GitAdapterApi>
}

export type CMSResolver<TContext = Context, TResult = any> =
  CMSGraphQLFieldResolver<TContext, any, any, TResult>;

export type CMSDecoratorGraphQL = {
  buildContext: (
    req: FastifyRequest,
    reply: FastifyReply,
  ) => Promise<Context | ContextWithGitMetadata>
  createCmsSchema: () => Promise<ReturnType<typeof createSchema>>
  getOAuthLoginUrl: typeof GitHubAdapter.getLoginUrl
  getOAuthAccessToken: typeof GitHubAdapter.getAccessToken
}
