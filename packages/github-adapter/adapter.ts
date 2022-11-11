import { Octokit } from '@octokit/core';

import {
  AuthInfo,
  CreateGitApiArgs,
  FileContentTypesEnum,
  GitAdapterApi,
  InitialConfigs,
  RepoConfig,
  RepoInfo,
  RepoPaths,
  RepoPathsEnum,
  UnifiedClients,
} from './types';
import { GraphQLClient } from './client/graphql';
import { RestClient } from './client/rest';
import { ContentApi } from './api/content';
import { OAuthApi } from './api/oauth';
import { RepositoryApi } from './api/repository';
import { UserApi } from './api/user';

class GitHubAdapter {
  private _authInfo: AuthInfo

  private _initialRepoInfo: RepoConfig

  private _repoInfo?: RepoInfo

  static AUTH_KEY_NAME = 'accessToken'

  static getAccessToken = OAuthApi.getAccessToken

  static getLoginUrl = OAuthApi.getLoginUrl

  constructor({ auth, repo }: InitialConfigs) {
    this._authInfo = auth;
    this._initialRepoInfo = {
      ...repo,
      paths: this._buildFullPaths(repo.paths),
    };
  }

  async initRepo(): Promise<void> {
    const { ownerSecret } = this._authInfo;
    const { owner, name, createAsPrivate, paths } = this._initialRepoInfo;
    const tempClients = this.getClients(ownerSecret);

    const repoApi = new RepositoryApi(tempClients, this._initialRepoInfo as RepoInfo);

    await repoApi.init({ isPrivate: Boolean(createAsPrivate) });

    const { defaultBranch } = await repoApi.getInfo();

    this._repoInfo = {
      defaultBranch,
      owner,
      name,
      paths,
    };
  }

  private getClients = (secret: string): UnifiedClients => {
    if (!secret) {
      throw new Error('Secret was not provided.');
    }

    const {
      graphql: graphqlClient,
      request: restClient,
    } = new Octokit({ auth: secret });

    return {
      rest: new RestClient(restClient),
      graphql: new GraphQLClient(graphqlClient),
    };
  }

  createGitApi = (args: CreateGitApiArgs): GitAdapterApi => {
    if (!args || !args.secret || !this._repoInfo) {
      throw new Error('Clients were not inialized correctly.');
    }

    const clients = this.getClients(args.secret);

    return {
      content: new ContentApi(clients, this._repoInfo, FileContentTypesEnum.CONTENT),
      contentType: new ContentApi(clients, this._repoInfo, FileContentTypesEnum.CONTENT_TYPE),
      repository: new RepositoryApi(clients, this._repoInfo),
      user: new UserApi(clients),
    };
  }

  private _buildFullPaths = (paths: RepoPaths): RepoPaths => {
    const {
      root: rootFolder,
      contentType: contentTypeFolder,
      content: contentFolder,
    } = paths || {};

    if (!contentTypeFolder) {
      throw new Error(`${RepoPathsEnum.CONTENT_TYPE} path is required.`);
    }

    if (!contentFolder) {
      throw new Error(`${RepoPathsEnum.CONTENT} path is required.`);
    }

    if (contentFolder === contentTypeFolder) {
      throw new Error(
        `${RepoPathsEnum.CONTENT_TYPE} and ${RepoPathsEnum.CONTENT} paths must be different.`,
      );
    }

    const rootPath = !rootFolder || rootFolder.endsWith('/')
      ? rootFolder
      : `${rootFolder}/`;

    const contentTypePath = contentTypeFolder.endsWith('/')
      ? contentTypeFolder
      : `${contentTypeFolder}/`;

    const contentPath = contentFolder.endsWith('/')
      ? contentFolder
      : `${contentFolder}/`;

    return {
      root: rootPath,
      contentType: rootFolder
        ? `${rootFolder}${contentTypePath}`
        : contentTypePath,
      content: rootFolder
        ? `${rootFolder}${contentPath}`
        : contentPath,
    };
  };

  static getAuthInfoFromRequest = (obj: { [key: string]: any }): CreateGitApiArgs => {
    if (typeof obj !== 'object' || obj[GitHubAdapter.AUTH_KEY_NAME]) {
      throw new Error('No secret was not found in request.');
    }

    return { secret: obj[GitHubAdapter.AUTH_KEY_NAME] };
  }
}

export { GitHubAdapter };
