/* eslint-disable camelcase */

// Git

export enum GitItemType {
  BLOB = 'blob',
  TREE = 'tree',
  COMMIT = 'commit',
}

export enum GitFileMode {
  BLOB = '100644',
  TREE = '040000',
  COMMIT = '160000',
}

export type Blob = {
  url?: string,
  sha: string | null,
}

export type Tree = {
  mode: GitFileMode,
  type: GitItemType,
  path: string,
  sha: string,
}

// GitHub

export type GitHubRepoOwner = {
  login: string,
  avatar_url: string,
  url: string,
  organizations_url: string,
  repos_url: string,
  type: string,
  site_admin: boolean
}

export type GitHubRepoPermissions = {
  admin: boolean,
  push: boolean,
  pull: boolean,
}

export type GitHubRepository = {
  name: string,
  full_name: string,
  owner: GitHubRepoOwner,
  private: boolean,
  html_url: string,
  description: string,
  blobs_url: string,
  branches_url: string,
  collaborators_url: string,
  contributors_url: string,
  default_branch: string,
  archived: boolean,
  disabled: boolean,
  visibility: string,
  permissions: GitHubRepoPermissions,
}

// AdapterRestClient arguments

export type CreateBlobArgs = {
  owner: string,
  repo: string,
  content: string,
}

export type CreateCommitArgs = {
  owner: string,
  repo: string,
  message: string,
  tree: string,
  parents: string[],
}

export type CreateTreeArgs = {
  owner: string,
  repo: string,
  treeItems: Tree[],
  baseTree: string,
}

export type CreateRefArgs = {
  owner: string,
  repo: string,
  ref: string,
  sha: string,
}

export type CreateRepoArgs = {
  name: string,
  description?: string,
  isPrivate: boolean,
}

export type GetOAuthAccessTokenArgs = {
  clientId: string,
  clientSecret: string,
  query: { code: string },
}
export type GetOAuthLoginUrlArgs = {
  clientId: string,
  scope: string[],
}

export type UpdateRefArgs = CreateRefArgs & {
  force?: boolean,
}

// AdapterRestClient response types

export type CommitAuthor = {
  date: string,
  name: string,
  email: string,
}

export type CommitTreeInfo = {
  sha: string,
  url: string,
}

export type PartentCommitInfo = {
  sha: string,
  url: string,
}

export type Commit = {
  sha: string,
  author: CommitAuthor,
  committer: CommitAuthor,
  message: string,
  tree: CommitTreeInfo,
  parents: PartentCommitInfo[],
}

export type CreateRefObjectResponse = {
  type: string,
  sha: string,
  url: string,
}

export type CreateUpdateRefResponse = {
  ref: string,
  url: string,
  object: CreateRefObjectResponse,
}

export type CreateTreeResponse = {
  sha: string,
  url: string,
  tree: Tree[],
  truncated: boolean,
}

// createFileApi helper arguments

export type CreateSingleTreeItemArgs = {
  path: string,
  blob: Blob
}

export type AuthenticatedUser = {
  username: string,
  avatarUrl: string,
  email: string,
  scope: string,
}

// Clients

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export type GitHubRestClient = any

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export type GitHubGraphQLClient = any

// GraphQL Client

export type GetBaseCommitInfoArgs = {
  branch: string,
  owner: string,
  repo: string,
}

export type GetRepositoryArgs = {
  name: string,
  owner: string,
}

export type GraphQLGetFileContentArgs = {
  branch: string,
  owner: string,
  path: string,
  repo: string,
}

export type GraphQLGetFilteredFilesContentArgs = {
  branch: string;
  owner: string;
  files: { path: string, fieldName: string }[];
  repo: string;
}

export type GraphQLGetFolderContentArgs = GraphQLGetFileContentArgs

export type GraphQLGetBaseCommitInfoResponse = {
  repository: {
    ref: {
      target: {
          commitSha: string
          tree: {
            sha: string
          }
        }
      }
  }
}

export type GraphQLGetRepositoryResponse = {
  repository: {
    name: string
    description: string
    defaultBranchRef: {
      name: string
    }
    isPrivate: boolean
    owner: {
      login: string
    }
  }
}

export type GraphQLGetFileContentResponse = {
  repository: {
    ref: {
      target: {
        file: {
          object: {
            __typename: string
            id: string
            text: string
            isTruncated: boolean
          }
        }
      }
    }
  }
}
export type GraphQLGeFilteredtFilesContentResponse = {
  repository: {
    ref: {
      target: {
        [fileFieldName: string]: {
          object: {
            __typename: string
            id: string
            text: string
            isTruncated: boolean
          }
        }
      }
    }
  }
}

export type GraphQLFileEntry = {
  object: {
    __typename: string
    isTruncated: boolean
    text: string
  }
}

export type GraphQLGetFolderContentResponse = {
  repository: {
    ref: {
      target: {
        files: {
          __typename: string
          object: {
            __typename: string
            entries: GraphQLFileEntry[]
          }
        }
      }
    }
  }
}

export type GitHubGraphQLError = {
  type: string,
  message: string,
  locations: any[],
  path: [string]
}

export enum GraphQLClientErrorsEnum {
  NOT_FOUND = 'NOT_FOUND'
}

export interface GraphQLClientInterface {
  getBaseCommitInfo(args: GetBaseCommitInfoArgs): Promise<GraphQLGetBaseCommitInfoResponse>
  getFileContent(args: GraphQLGetFileContentArgs): Promise<GraphQLGetFileContentResponse>
  getFilteredFilesContent(
    args: GraphQLGetFilteredFilesContentArgs,
  ): Promise<GraphQLGeFilteredtFilesContentResponse>
  getFolderContent(args: GraphQLGetFolderContentArgs): Promise<GraphQLGetFolderContentResponse>
  getRepository(args: GetRepositoryArgs): Promise<GraphQLGetRepositoryResponse>
}

// Rest Client

export interface RestClientInterface {
  // content
  createBlob: (args: CreateBlobArgs) => Promise<Blob>,
  createTree: (args: CreateTreeArgs) => Promise<CreateTreeResponse>,
  createCommit: (args: CreateCommitArgs) => Promise<Commit>,

  // repo
  createRepository: (args: CreateRepoArgs) => Promise<GitHubRepository>,

  // refs
  createRef: (args: CreateRefArgs) => Promise<CreateUpdateRefResponse>,
  updateRef: (args: UpdateRefArgs) => Promise<CreateUpdateRefResponse>,

  // user
  getAuthenticatedUser: () => Promise<AuthenticatedUser>,
}

export type UnifiedClients = {
  rest: RestClientInterface,
  graphql: GraphQLClientInterface,
}

// File Api Args

export type InputFile = {
  path: string,
  content: string,
}

export type CreateBlobInfoArgs = {
  files: InputFile | InputFile[],
  isList: boolean,
}

export type CreateFileContentArgs = {
  branch?: string,
  files: InputFile | InputFile[],
  commitMessage: string,
}

export type DeleteFileContentArgs = {
  branch?: string,
  path: string,
  commitMessage: string,
}

export type GetFileContentArgs = {
  branch?: string,
  path: string,
}

export type GetFilteredFilesContentArgs = {
  branch?: string,
  files: { path: string, id: string }[],
}

export type GetFolderContentArgs = GetFileContentArgs

export type GetContentArgs = {
  id: string
  subFolder?: string
  branch?: string
}

export type GetAllContentArgs = {
  subFolder?: string
  branch?: string
}

export type GetManyContentArgs = {
  branch?: string,
  files: { type: string, id: string }[],
}

// File Api responses

export type BlobInfo = {
  path: string,
  blob: Blob,
}

export type ContentInfo = {
  path: string,
  sha: string,
}

export type GraphQLContentEntry = {
  object: {
    __typename: string,
    isTruncated: boolean,
    text: string,
  }
}

// File Api main interface

export interface FileApiInterface {
  createSingleTreeItem: (args: CreateSingleTreeItemArgs) => Tree,
  createTreeItems: (
    blobInfo: CreateSingleTreeItemArgs[] | CreateSingleTreeItemArgs,
    isList: boolean,
  ) => Tree[],
  createBlobInfo: (args: CreateBlobInfoArgs) => Promise<BlobInfo | BlobInfo[]>,
  createFileContent: (args: CreateFileContentArgs) => Promise<ContentInfo | ContentInfo[]>,
  deleteFileContent (args: DeleteFileContentArgs): Promise<boolean>,
  getFileContent: (args: GetFileContentArgs) => Promise<string>,
  getFilteredFilesContent: (args: GetFilteredFilesContentArgs) => Promise<(string | null)[]>,
  getFolderContent: (args: GetFolderContentArgs) => Promise<string[]>,
}

export enum FileContentTypesEnum {
  CONTENT = 'Content',
  CONTENT_TYPE = 'ContentType',
}

// Content Api

export interface GenericContent {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  [key: string]: any
}

// Content Api args
export type CreateContentArgs = {
  id: string
  branch?: string
  subFolder?: string
  commitMessage?: string
  content: GenericContent
}

export type DeleteContentArgs = {
  id: string
  branch?: string
  subFolder?: string
  commitMessage?: string
}

export type UpdateContentArgs = {
  id: string
  branch?: string
  subFolder?: string
  content: GenericContent,
  commitMessage?: string
}

// Content Api main interface

export interface ContentApiInterface {
  create(args: CreateContentArgs): Promise<GenericContent>
  delete(args: DeleteContentArgs): Promise<boolean>
  get(args: GetContentArgs): Promise<GenericContent | null>
  getMany(args: GetManyContentArgs): Promise<(GenericContent | null)[]>
  getAll(args: GetAllContentArgs): Promise<GenericContent[]>
  update(args: UpdateContentArgs): Promise<GenericContent>
}

// Repository Api

export enum InitRepoResponse {
  CREATED = 'CREATED',
  FOUND = 'FOUND', // repo was found
}

export type GetRepoInfoResponse = {
  owner: string
  name: string
  description: string
  defaultBranch: string
  isPrivate: boolean
}

// Repository Api args

export type InitRepoArgs = {
  description?: string,
  isPrivate?: boolean,
}

// Repository Api main interface

export interface RespositoryApiInterface {
  init: (args: InitRepoArgs) => Promise<InitRepoResponse>,
  getInfo: () => Promise<GetRepoInfoResponse>,
}

// User Api main interface

export interface UserApiInterface {
  getAuthenticated(): Promise<AuthenticatedUser>
}

// GitAdapterApi

export interface GitAdapterApi {
  content: ContentApiInterface,
  contentType: ContentApiInterface,
  repository: RespositoryApiInterface,
  user: UserApiInterface,
}

// GitHubAdapter

export type AuthInfo = {
  ownerSecret: string
}

export enum RepoPathsEnum {
  ROOT = 'root',
  CONTENT = 'content',
  CONTENT_TYPE = 'contentType',
}

export type RepoPaths = {
  [RepoPathsEnum.ROOT]: string | undefined
  [RepoPathsEnum.CONTENT]: string
  [RepoPathsEnum.CONTENT_TYPE]: string
}

export type RepoConfig = {
  name: string
  owner: string
  paths: RepoPaths
  createAsPrivate?: boolean
}

export type RepoInfo = Omit<RepoConfig, 'createAsPrivate'> & {
  defaultBranch: string
}

export type InitialConfigs = {
  repo: RepoConfig
  auth: AuthInfo
}

export type CreateGitApiArgs = {
  secret: string
}
