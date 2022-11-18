# Safis CMS


[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)  [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/safistech/safis-cms/blob/master/LICENSE)

### A headless, git-based and GraphQL native CMS.

Safis CMS connects to a Git repository and manages its content using GraphQL and a user friendly UI (coming soon...).

## Features

### [Content Modeling](/docs/content-modeling.md)
Create custom content types for your application by defining their structure and adding validations for each individual field.

- #### [Content types](/docs/content-modeling.md#content-types)

- #### [Content entries](/docs/content-modeling.md#content-entries)

- #### [File structure](/docs/content-modeling.md#file-structure)

### [Authentication](/docs/authentication.md)
Safis CMS uses GitHub OAuth Apps as default authenticatication and authorization method to use your repositories and manage your content.

### [GraphQL API](/docs/graphql.md)
Safis CMS includes a GraphQL API that will help you read, manage and deliver your content through a flexible schema that will be dynamically updated based on the existing content types.

### User friendly UI (coming soon...)
A web application designed for both content and development teams.

### Database free
All of your content will be saved directly into your destination git repository.

## Getting Started

### Requirements
In order for you to use Safis CMS packages you will need to meet the following requirements:

1. A GitHub **[personal access token](https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token)** that has the `repo` scope selected.

2. A GitHub **[OAuth App](https://docs.github.com/en/developers/apps/creating-an-oauth-app)** so you can provide its `Client ID` and `Client secret` in order to authenticate to GitHub and perform git operations on your behalf.

> To see the full list of requirements please visit our [requirements](/CONTRIBUTING.md#requirements) section.

### Configuration
We will use environment variables in this example to configure our `safis-cms-server`.

> Please see our [configuration](/CONTRIBUTING.md#configuration) section to know more about how to configure you local environment.

### Installation
```sh
$ npm install safis-cms-server@beta
```

> For this example, we will also be using the [`dotenv`](https://github.com/motdotla/dotenv) npm package.

### Usage
Create and start a server using the `safis-cms-server` npm package:

```js
require('dotenv').config()

const { createServer } = require('safis-cms-server')

/* ES6
import { createServer } from 'safis-cms-server'
import dotenv from 'dotenv'

dotenv.config()
*/

const PORT = process.env.PORT || 3000

const enablePlayground = process.env.ENABLE_GRAPHQL_PLAYGROUND === undefined
  || process.env.ENABLE_GRAPHQL_PLAYGROUND === 'true'

const configs = {
  cookieSecret: process.env.COOKIE_SECRET,
  git: {
    ownerSecret: process.env.GIT_OWNER_SECRET,
    owner: process.env.GIT_OWNER,
    repo: process.env.GIT_REPO,

    visibility: process.env.GIT_REPO_VISIBILITY,
    defaultBranch: process.env.GIT_DEFAULT_BRANCH,
    paths: {
      root: process.env.GIT_ROOT_FOLDER,
      contentTypes: process.env.GIT_CONTENT_TYPES_FOLDER,
      content: process.env.GIT_CONTENT_FOLDER,
    },
  },
  logger: true,
  oatuhCallback: process.env.OAUTH_CALLBACK_URL,
  oauthClientId: process.env.GIT_OAUTH_CLIENT_ID,
  oauthClientSecret: process.env.GIT_OAUTH_CLIENT_SECRET,
  oauthScope: process.env.GIT_OAUTH_SCOPE?.split(','),
  oauthLogin: process.env.OAUTH_LOGIN_URL,
  enablePlayground,
}

const server = createServer(configs) // creates a Fastify server

server.listen(PORT, (err) => {
  if (err) {
    server.log.error(`Failed to start Server: ${JSON.stringify(err)}`)
    process.exit(1)
  }

  server.log.info(`Server running on port ${PORT}`)
})
```

You can additionally add a client to your server so you can manage your content through a more user friendly interface. ***Coming soon...***

## How is the repo structured?
This repository is a [monorepo](https://trunkbaseddevelopment.com/monorepos/) managed using [Lerna](https://github.com/lerna/lerna). This means there are [multiple packages](https://github.com/safis-io/safis-cms/tree/main/packages) managed in this codebase, even though we publish them to NPM as separate packages.

## Contributing
New contributors are always welcome! Check out our [Contributing Guide](/CONTRIBUTING.md) to get involved.

<!-- ## Change Log
This project adheres to Semantic Versioning. Every release is documented on the Github Releases page. -->

## License
Safis CMS is released under the [MIT License](https://github.com/safis-io/safis-cms/blob/main/LICENSE).