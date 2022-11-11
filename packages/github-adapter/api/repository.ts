import get from 'lodash.get';

import { FileApi } from './file';
import { DEFAULT_REPO_DESCRIPTION } from '../constants';
import {
  InitRepoArgs,
  InitRepoResponse,
  FileApiInterface,
  RespositoryApiInterface,
  UnifiedClients,
  RepoInfo,
  GraphQLGetRepositoryResponse,
  GetRepoInfoResponse,
} from '../types';

class RepositoryApi implements RespositoryApiInterface {
  protected clients: UnifiedClients

  protected fileApi: FileApiInterface

  private _repoInfo: RepoInfo

  constructor(unifiedClients: UnifiedClients, repoInfo: RepoInfo) {
    this._repoInfo = repoInfo;
    this.clients = unifiedClients;
    this.fileApi = new FileApi(this.clients, this._repoInfo);
  }

  init = async (args: InitRepoArgs): Promise<InitRepoResponse> => {
    const { name } = this._repoInfo;
    const {
      isPrivate = false,
      description,
    } = args;
    const existingRepoInfo = await this.getInfo()
      .catch((error: { type: string }[]) => {
        if (get(error, 'errors[0].type') === 'NOT_FOUND') return {};

        throw error;
      });

    if (get(existingRepoInfo, 'name')) {
      this._repoInfo.defaultBranch = this._repoInfo.defaultBranch
        || get(existingRepoInfo, 'defaultBranch');

      return InitRepoResponse.FOUND;
    }

    const { default_branch: defaultBranch } = await this.clients.rest.createRepository({
      name,
      description,
      isPrivate,
    });

    this._repoInfo.defaultBranch = this._repoInfo.defaultBranch || defaultBranch;

    await this.fileApi.createFileContent({
      branch: defaultBranch,
      files: {
        path: 'README.md',
        content: DEFAULT_REPO_DESCRIPTION,
      },
      commitMessage: 'Safis CMS initial commit',
    });

    return InitRepoResponse.CREATED;
  }

  getInfo = async (): Promise<GetRepoInfoResponse> => {
    const { owner, name } = this._repoInfo;
    const { repository }: GraphQLGetRepositoryResponse = await this.clients
      .graphql
      .getRepository({ owner, name });

    const {
      name: ghName,
      description: ghDescription,
      defaultBranchRef: { name: ghBranchName },
      isPrivate: ghIsPrivate,
    } = repository;

    return {
      owner,
      name: ghName,
      description: ghDescription,
      defaultBranch: ghBranchName,
      isPrivate: ghIsPrivate,
    };
  }
}

export { RepositoryApi };
