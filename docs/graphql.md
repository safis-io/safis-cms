# GraphQL API
Safis CMS includes a GraphQL API that will help you read, manage and deliver your content through a flexible schema that will be dynamically updated based on the existing content types.

## Authorization
**First of all**, the `access_token` needs to be sent through the ***Authorization*** header in order for a query or mutation to be authorized and correctly excecuted. Otherwise, an error will be returned.

The `access_token` value can be found after you log in with your *[GitHub OAuth App](https://docs.github.com/en/developers/apps/creating-an-oauth-app)* (using the path set in the `OAUTH_LOGIN_URL` env variable) and authorize it. Once you authorized your App, you can find `access_token` value in your browser's cookies:

![image](https://user-images.githubusercontent.com/11320233/120562684-1cda3180-c3c4-11eb-9358-96e1a98a1738.png)


## Playground
The GraphQL Playground is enabled by default and it can be accessed through the `/playground` path. 

![image](https://user-images.githubusercontent.com/11320233/120563332-8b6bbf00-c3c5-11eb-8174-13391aceb8c7.png)


## Default Schema

This is the initial schema that will be available after the CMS was started for the first time:

```graphql
# indicates what kind of value a filed will take
enum ContentTypeFieldTypeEnum {
  String
  Number
  Boolean
  Reference # links to other content types that implement the ContentType type (coming soon)
}

# used to add a new field for a content type
input ContentTypeFieldInput {
  id: ID!
  name: String!
  description: String
  type: ContentTypeFieldTypeEnum!
}

# used to add a new content type
input ContentTypeInput {
  id: ID
  name: String!
  description: String
  fields: [ContentTypeFieldInput!]
}

# used to update an existing content type
input ContentTypeUpdateInput {
  id: ID!
  name: String
  description: String
  fields: [ContentTypeFieldInput!]
}

# represents a field that belongs to a content type
type ContentTypeField {
  id: ID!
  name: String!
  description: String
  type: ContentTypeFieldTypeEnum!
}

# represents a content type, content types will implement this
type ContentType {
  id: ID!
  name: String!
  description: String
  fields: [ContentTypeField!]!
}

type Query {
  contentType(id: ID!): ContentType # given an id, returns a content type 
  contentTypes: [ContentType] # return all content types available 
}

type Mutation {
  addContentType(input: ContentTypeInput!): ContentType # adds a new content type
  updateContentType(input: ContentTypeUpdateInput!): ContentType # updates an existing content type
  deleteContentType(id: ID!): Boolean! # deletes an existing content type
}
```

## Content Types

A user can add new content types based on the structure described when using the **addContetType** mutation, these content types are considered ***dynamic*** since they will be automatically added to the schema after they were successfully created.

## Managing Content Types

Let's create a new `User` content type that will represent users for our awesome application, update it and see how these changes affect the schema.

### Adding our new `User` content type

```graphql
mutation addUserContentType {
  addContentType(input: {
    id: "user",
    name: "User",
    description: "This represents a user for my awesome app",
    fields: [{
      	id: "userId",
      	name: "Id",
      	description: "This is the user unique id",
      	type: String, #expects a value of type "ContentTypeFieldTypeEnum"
      	# isUnique: true | false # coming sooon...
      	# isRequired: true | false # coming sooon...
    	}, {
      	id: "name",
      	name: "Name",
      	# please notice that the "description" fields is optional
      	type: String,
    	}, {
      	id: "age",
      	name: "Age",
      	type: Number,
    	},
    ]
  }) {
    id
    name
    description
    fields {
      id
      name
      description
      type
    }
    __typename
  }
}
```

*Response*
```json
{
  "data": {
    "addContentType": {
      "id": "user",
      "name": "User",
      "description": "This represents a user for my awesome app",
      "fields": [
        {
          "id": "userId",
          "name": "Id",
          "description": "This is the user unique id",
          "type": "String"
        },
        {
          "id": "name",
          "name": "Name",
          "description": null,
          "type": "String"
        },
        {
          "id": "age",
          "name": "Age",
          "description": null,
          "type": "Number"
        }
      ],
      "__typename": "ContentType"
    }
  }
}
```

After we add, update or delete a content type, the schema should reflect the latest changes. The schema updates will include a new ***type*** (implementing the `Content` type) that will describe our `User` content type, ***input types*** for adding and updating `User`s.

Additionally, the schema will expose two ***queries***, one for getting all `User` content entries and another for getting a `User` content entry matching a given *id*; as well as 3 new ***mutations*** for adding, updating and deleting `User`s.

```graphql
# types
type User implements Content {
  id: ID
  userId: String
  name: String
  age: Float
  __sys: Sys
}

input UserInput {
  userId: String
  name: String
  age: Float
}

input UserUpdateInput {
  id: ID!
  userId: String
  name: String
  age: Float
}

# queries
user(id: ID!): User
users: [User]

# mutations
addUser(input: UserInput!): User
updateUser(input: UserUpdateInput!): User
deleteUser(id: ID!): Boolean
```

### Querying all content types
Now that we added the `User` content type, let's run the **contentTypes** query and get some results back;

```graphql
query getAllContentTypes {
  contentTypes {
    id
    name
    description
    fields {
      id
      name
      type
    }
  }
}
```
*Response*
```json
{
  "data": {
    "contentTypes": [
      {
        "id": "user",
        "name": "User",
        "description": "This represents a user for my awesome app",
        "fields": [
          {
            "id": "userId",
            "name": "Id",
            "type": "String"
          },
          {
            "id": "name",
            "name": "Name",
            "type": "String"
          },
          {
            "id": "age",
            "name": "Age",
            "type": "Number"
          }
        ]
      }
    ]
  }
}
```

### Querying for a specific content type
It is also possible to query for a specific content type using its `id`: 

```graphql
query getUserContentTypeInfo {
  contentType(id: "user") {
    id
    name
    description
    fields {
      id
      name
      type
    }
  }
}
```

*Response*

```json
{
  "data": {
    "contentType": {
      "id": "user",
      "name": "User",
      "description": "This represents a user for my awesome app",
      "fields": [
        {
          "id": "userId",
          "name": "Id",
          "type": "String"
        },
        {
          "id": "name",
          "name": "Name",
          "type": "String"
        },
        {
          "id": "age",
          "name": "Age",
          "type": "Number"
        }
      ]
    }
  }
}
```


### Updating our `User` content type
When a content type struture needs to be changed, we can use the **updateContentType** to update ony what is needed. The fields that can be updated are `name`, `description` and `fields` (field definitions).

```graphql
# updating only the description

mutation updateUserContentTypeDescription {
  updateContentType(input: {
    id: "user",
    description: "This an updated description for the User content type"
  }) {
    id
    name
    description
    __typename
    fields {
      id
      name
      description
      type
      __typename
    }
  }
}
```

*Response*

```json
{
  "data": {
    "updateContentType": {
      "id": "user",
      "name": "User",
      "description": "This an updated description for the User content type",
      "__typename": "ContentType",
      "fields": [
        {
          "id": "userId",
          "name": "Id",
          "description": "This is the user unique id",
          "type": "String",
          "__typename": "ContentTypeField"
        },
        {
          "id": "name",
          "name": "Name",
          "description": null,
          "type": "String",
          "__typename": "ContentTypeField"
        },
        {
          "id": "age",
          "name": "Age",
          "description": null,
          "type": "Number",
          "__typename": "ContentTypeField"
        }
      ]
    }
  }
}
```

Please consider that if you need to add, updated or delete a field definition, you still need to include all the fields that will be added, updated; or exclude the field to be removed from the fields definition array.

*Adding a new field*
```graphql
mutation addNewFieldToUserContentType {
  updateContentType(input: {
    id: "user",
    fields: [{
      	id: "userId",
      	name: "Id",
      	description: "This is the user unique id",
      	type: String,
    	}, {
      	id: "name",
      	name: "Name"
      	type: String,
    	}, {
      	id: "age",
      	name: "Age",
      	type: Number,
    	}, {
      	id: "isActive",
      	name: "Is user active?",
      	type: Boolean,
    	}
    ]
  }) {
    id
    name
    description
    __typename
    fields {
      id
      name
      description
      type
      __typename
    }
  }
}
```

*Response*
```json
{
  "data": {
    "updateContentType": {
      "id": "user",
      "name": "User",
      "description": "This an updated description for the User content type",
      "__typename": "ContentType",
      "fields": [
        {
          "id": "userId",
          "name": "Id",
          "description": "This is the user unique id",
          "type": "String",
          "__typename": "ContentTypeField"
        },
        {
          "id": "name",
          "name": "Name",
          "description": null,
          "type": "String",
          "__typename": "ContentTypeField"
        },
        {
          "id": "age",
          "name": "Age",
          "description": null,
          "type": "Number",
          "__typename": "ContentTypeField"
        },
        {
          "id": "isActive",
          "name": "Is user active?",
          "description": null,
          "type": "Boolean",
          "__typename": "ContentTypeField"
        }
      ]
    }
  }
}
```
> Please notice that schema updates the **ContentType** type, and input types and  after a structural change is made

```graphql
type User implements Content {
  id: ID
  userId: String
  name: String
  age: Float
  isActive: Boolean # new field
  __sys: Sys
}

input UserInput {
  userId: String
  name: String
  age: Float
  isActive: Boolean # new field
}

input UserUpdateInput {
  id: ID!
  userId: String
  name: String
  age: Float
  isActive: Boolean # new field
}
```

*Updating an existing field*

```graphql

mutation updateFieldOnUserContentType {
  updateContentType(input: {
    id: "user",
    fields: [{
      	id: "userId",
      	name: "Id",
      	description: "This is the user unique id",
      	type: String,
    	}, {
      	id: "name",
      	name: "Name"
      	type: String,
    	}, {
      	id: "age",
      	name: "Age",
      	type: Number,
    	}, {
      	id: "isActive",
      	name: "Acive", # name changed
      	type: Boolean,
    	}
    ]
  }) {
    id
    name
		description
    __typename
    fields {
      id
      name
      description
      type
      __typename
    }
  }
}
```

*Response*

```json
{
  "data": {
    "updateContentType": {
      "id": "user",
      "name": "User",
      "description": "This an updated description for the User content type",
      "__typename": "ContentType",
      "fields": [
        {
          "id": "userId",
          "name": "Id",
          "description": "This is the user unique id",
          "type": "String",
          "__typename": "ContentTypeField"
        },
        {
          "id": "name",
          "name": "Name",
          "description": null,
          "type": "String",
          "__typename": "ContentTypeField"
        },
        {
          "id": "age",
          "name": "Age",
          "description": null,
          "type": "Number",
          "__typename": "ContentTypeField"
        },
        {
          "id": "isActive",
          "name": "Acive",
          "description": null,
          "type": "Boolean",
          "__typename": "ContentTypeField"
        }
      ]
    }
  }
}
```
*Deleting an existing field*

```graphql

mutation deleteFieldOnUserContentType {
  updateContentType(input: {
    id: "user",
    fields: [{
      	id: "userId",
      	name: "Id",
      	description: "This is the user unique id",
      	type: String,
    	}, {
      	id: "name",
      	name: "Name"
      	type: String,
    	}, {
      	id: "age",
      	name: "Age",
      	type: Number,
    	}
      # isActive field was removed
    ]
  }) {
    id
    name
		description
    __typename
    fields {
      id
      name
      description
      type
      __typename
    }
  }
}
```

*Response*

```json
{
  "data": {
    "updateContentType": {
      "id": "user",
      "name": "User",
      "description": "This an updated description for the User content type",
      "__typename": "ContentType",
      "fields": [
        {
          "id": "userId",
          "name": "Id",
          "description": "This is the user unique id",
          "type": "String",
          "__typename": "ContentTypeField"
        },
        {
          "id": "name",
          "name": "Name",
          "description": null,
          "type": "String",
          "__typename": "ContentTypeField"
        },
        {
          "id": "age",
          "name": "Age",
          "description": null,
          "type": "Number",
          "__typename": "ContentTypeField"
        }
      ]
    }
  }
}
```

### Deleting a content type
Let's assume we have a `Test` content type, whose id is `test`. We can delete this content type by using the **deleteContentType** mutation.

```graphql
mutation deleteTestContentType {
  deleteContentType(id: "test")
}
```

*Response*

```json
{
  "data": {
    "deleteContentType": true
  }
}
```

> Note: the schema will update after deleting the Test content type.



### Linking content types
*Coming soon...*
<br/>
<br/>

## Managing Content entries
Content entries can be managed by using the **queries** and **mutations**, with their **types** and **input types**, after one or more content types were defined.

*Please consider the updates made to the schema after we added the `User` content type*
```graphql
# types
type User implements Content {
  id: ID
  userId: String
  name: String
  age: Float
  __sys: Sys
}

input UserInput {
  userId: String
  name: String
  age: Float
}

input UserUpdateInput {
  id: ID!
  userId: String
  name: String
  age: Float
}

# queries
user(id: ID!): User
users: [User]

# mutations
addUser(input: UserInput!): User
updateUser(input: UserUpdateInput!): User
deleteUser(id: ID!): Boolean
```

### Adding content entries
The CMS will create a new mutation automatically to add users after the creation of the new content type with the form ***add{`CONTENT_TYPE`}***. For example, `addUser` for adding `User`s.

Additionally, an ***input {`CONTENT_TYPE`}Input*** type (e.g. `input` `UserInput`) will be gnerated to validate the form and the required fields of the `User` to be added.

*Example*
```graphql
mutation addNewUser {
  addUser(input: {
    name: "Isaac",
    age: 21,
    userId: "customId123"
  }) {
    id # System generated id
    userId
    name
    age
    sys {
      id
      name
      description
      __typename
    }
    __typename
  }
}
```

*Response*
```json
{
  "data": {
    "addUser": {
      "id": "cc482b53-e05a-472c-8a9c-08faf70badd6",
      "userId": "customId123",
      "name": "Isaac",
      "age": 21,
      "sys": {
        "id": "User",
        "name": "User",
        "description": "This an updated description for the User content type",
        "__typename": "Sys"
      },
      "__typename": "User"
    }
  }
}
```


### Updating a content entry
Similarly to the `addNewUser` mutation and the `input` `UserInput` type, we will have an `updateUser` mutation and an `input` `UserUpdateInput` type to define the payload of the user to be updated.

*Example*

```graphql
mutation updateUser {
  updateUser(input: {
    id: "cc482b53-e05a-472c-8a9c-08faf70badd6", # System generated id
    name: "Isaac Newton",
  }) {
    id
    userId
    name
    age
    sys {
      id
      name
      description
      __typename
    }
    __typename
  }
}
```

*Response*

```json
{
  "data": {
    "updateUser": {
      "id": "cc482b53-e05a-472c-8a9c-08faf70badd6",
      "userId": "customId123",
      "name": "Isaac Newton",
      "age": 21,
      "sys": {
        "id": "User",
        "name": "User",
        "description": "This an updated description for the User content type",
        "__typename": "Sys"
      },
      "__typename": "User"
    }
  }
}
```

### Quering content entries
You can also query for a specific content entry using the ****`CONTENT_TYPE`**** query (e.g. `user`) and passing the entry `id`.

*Example*

```graphql
query getOneContentEntry {
  user(id: "cc482b53-e05a-472c-8a9c-08faf70badd6") {
     id
    userId
    name
    age
    sys {
      id
      name
      description
      __typename
    }
    __typename
  }
}
```

*Response*

```json
{
  "data": {
    "user": {
      "id": "cc482b53-e05a-472c-8a9c-08faf70badd6",
      "userId": "customId123",
      "name": "Isaac Newton",
      "age": 21,
      "sys": {
        "id": "User",
        "name": "User",
        "description": "This an updated description for the User content type",
        "__typename": "Sys"
      },
      "__typename": "User"
    }
  }
}
```

If you need to get all of the content entries for a given content type you can use the *****`CONTENT_TYPE`s***** query. For example, `users`.

*Example*

```graphql
query getAllContentEntries {
  users {
     id
    userId
    name
    age
    sys {
      id
      name
      description
      __typename
    }
    __typename
  }
}
```

*Response*

```json
{
  "data": {
    "users": [
      {
        "id": "cc482b53-e05a-472c-8a9c-08faf70badd6",
        "userId": "customId123",
        "name": "Isaac Newton",
        "age": 21,
        "sys": {
          "id": "User",
          "name": "User",
          "description": "This an updated description for the User content type",
          "__typename": "Sys"
        },
        "__typename": "User"
      },
      {
        "id": "faf34685-f7ba-408e-a3e4-05f0f484bc39",
        "userId": "abc123",
        "name": "Celia Cruz",
        "age": 8,
        "sys": {
          "id": "User",
          "name": "User",
          "description": "Azúcar!",
          "__typename": "Sys"
        },
        "__typename": "User"
      }
    ]
  }
}
```

### Deleting a content entry
Deleting a content entry is also possible with the ***delete{`CONTENT_TYPE`}*** mutation (e.g. `deleteUser`) and the entry `id`.

*Example*

```graphql
mutation deleteContentEntry {
  deleteUser(id: "cc482b53-e05a-472c-8a9c-08faf70badd6")
}
```

*Response*

```json
{
  "data": {
    "deleteUser": true
  }
}
```

## Extending the Schema
Ability to extend the GraphQL schema (Coming soon...)