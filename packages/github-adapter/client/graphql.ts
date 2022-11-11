import {
  GetBaseCommitInfoArgs,
  GetRepositoryArgs,
  GitHubGraphQLClient,
  GraphQLClientInterface,
  GraphQLGeFilteredtFilesContentResponse,
  GraphQLGetBaseCommitInfoResponse,
  GraphQLGetFileContentArgs,
  GraphQLGetFileContentResponse,
  GraphQLGetFilteredFilesContentArgs,
  GraphQLGetFolderContentArgs,
  GraphQLGetFolderContentResponse,
  GraphQLGetRepositoryResponse,
} from '../types';
import {
  createQueryGetFilteredFilesContent,
  QUERY_GET_BASE_COMMIT_INFO,
  QUERY_GET_FILE_CONTENT,
  QUERY_GET_FOLDER_CONTENT,
  QUERY_GET_REPOSITORY,
} from './graphql.queries';

class GraphQLClient implements GraphQLClientInterface {
  protected client: GitHubGraphQLClient

  constructor(client: GitHubGraphQLClient) {
    this.client = client;
  }

  getBaseCommitInfo = (args: GetBaseCommitInfoArgs): Promise<GraphQLGetBaseCommitInfoResponse> => {
    const { owner, repo, branch } = args;

    return this.client(
      QUERY_GET_BASE_COMMIT_INFO,
      { owner, repo, ref: `refs/heads/${branch}` },
    );
  }

  getFileContent = (args: GraphQLGetFileContentArgs): Promise<GraphQLGetFileContentResponse> => {
    const { owner, repo, branch, path } = args;

    return this.client(
      QUERY_GET_FILE_CONTENT,
      { owner, repo, ref: `refs/heads/${branch}`, path },
    );
  }

  getFilteredFilesContent = (
    args: GraphQLGetFilteredFilesContentArgs,
  ): Promise<GraphQLGeFilteredtFilesContentResponse> => {
    const { owner, repo, branch, files } = args;
    const query = createQueryGetFilteredFilesContent(files);

    return this.client(query, { owner, repo, ref: `refs/heads/${branch}` });
  }

  /* eslint-disable-next-line max-len */
  getFolderContent = (args: GraphQLGetFolderContentArgs): Promise<GraphQLGetFolderContentResponse> => {
    const {
      owner,
      repo,
      branch,
      path,
    } = args;

    return this.client(
      QUERY_GET_FOLDER_CONTENT,
      { owner, repo, ref: `refs/heads/${branch}`, path },
    );
  }

  getRepository = (args: GetRepositoryArgs): Promise<GraphQLGetRepositoryResponse> => {
    const { owner, name } = args;

    return this.client(QUERY_GET_REPOSITORY, { owner, name });
  }
}

export { GraphQLClient };
