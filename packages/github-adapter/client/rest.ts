import { Octokit } from '@octokit/core';

import { DEFAULT_REPO_DESCRIPTION } from '../constants';
import {
  RestClientInterface,
  AuthenticatedUser,
  Blob,
  Commit,
  CreateBlobArgs,
  CreateCommitArgs,
  CreateRefArgs,
  CreateRepoArgs,
  CreateTreeArgs,
  CreateTreeResponse,
  CreateUpdateRefResponse,
  GetOAuthAccessTokenArgs,
  GetOAuthLoginUrlArgs,
  GitHubRepository,
  GitHubRestClient,
  UpdateRefArgs,
} from '../types';

class RestClient implements RestClientInterface {
  protected client: GitHubRestClient

  constructor(client: GitHubRestClient) {
    this.client = client;
  }

  static getOAuthAccessToken = (args: GetOAuthAccessTokenArgs): Promise<string> => {
    const { clientId, clientSecret, query } = args;
    const { code } = query || {};

    return new Octokit().request(
      'POST https://github.com/login/oauth/access_token',
      {
        client_id: clientId,
        client_secret: clientSecret,
        code,
      },
    )
      .then(({ data }) => {
        const { access_token: accessToken } = data || {};

        return accessToken;
      });
  }

  static getOAuthLoginUrl = ({ clientId, scope }: GetOAuthLoginUrlArgs): string => {
    const scopeParamString = scope && scope.length ? `&scope=${scope.join(',')}` : '';

    return `https://github.com/login/oauth/authorize?client_id=${clientId}${scopeParamString}`;
  }

  createBlob = async ({ owner, repo, content }: CreateBlobArgs) : Promise<Blob> => {
    const { data: blob }: { data: Blob } = await this.client('POST /repos/{owner}/{repo}/git/blobs', {
      owner,
      repo,
      content,
    });

    return blob;
  }

  createCommit = async (args: CreateCommitArgs): Promise<Commit> => {
    const {
      owner,
      repo,
      message,
      tree,
      parents,
    } = args;

    const { data: commit } = await this.client(`POST /repos/${owner}/${repo}/git/commits`, {
      owner,
      repo,
      message,
      tree,
      parents,
    });

    return commit;
  }

  createRef = async (args: CreateRefArgs): Promise<CreateUpdateRefResponse> => {
    const {
      owner,
      repo,
      ref,
      sha,
    } = args;

    const { data: newRef }: { data: CreateUpdateRefResponse } = await this.client(`POST /repos/${owner}/${repo}/git/refs`, {
      owner,
      repo,
      ref,
      sha,
    });

    return newRef;
  }

  createRepository = async (args: CreateRepoArgs): Promise<GitHubRepository> => {
    const {
      name,
      description = DEFAULT_REPO_DESCRIPTION, // generic description
      isPrivate = false,
    } = args;
    const { data }: { data: GitHubRepository } = await this.client('POST /user/repos', {
      name,
      auto_init: true,
      description,
      private: isPrivate,
    });

    return data;
  }

  createTree = async (args: CreateTreeArgs): Promise<CreateTreeResponse> => {
    const {
      owner,
      repo,
      treeItems,
      baseTree,
    } = args;

    const { data: newTree }: { data: CreateTreeResponse } = await this.client(`POST /repos/${owner}/${repo}/git/trees`, {
      owner,
      repo,
      base_tree: baseTree,
      tree: treeItems,
    });

    return newTree;
  }

  getAuthenticatedUser = async (): Promise<AuthenticatedUser> => {
    const { data: userInfo, headers } = await this.client('/user');

    const { 'x-oauth-scopes': scope } = headers || {};
    const { login: username, avatar_url: avatarUrl, email } = userInfo;

    const user = {
      username,
      avatarUrl,
      email,
      scope,
    };

    return user;
  }

  updateRef = async (args: UpdateRefArgs): Promise<CreateUpdateRefResponse> => {
    const {
      owner,
      repo,
      ref,
      sha,
      force = false,
    } = args;
    const { data: newRef } = await this.client(`PATCH /repos/${owner}/${repo}/git/refs/${ref}`, {
      owner,
      repo,
      ref,
      sha,
      force,
    });

    return newRef;
  }
}

export { RestClient };
