import { gql } from 'apollo-server-express';

export default gql `
    extend type Query {
        getAllPosts: [Post!]! @isAuth
        getPostById(id: ID!): Post!
        getPostByLimitAndPage(page: Int, limit: Int): PostPaginator!
        getAuthenticatedUserPosts(page: Int, limit: Int): PostPaginator! @isAuth
    },
    extend type Mutation {
        createNewPost(newPost: PostInput!): Post! @isAuth
        editPostByID(updatedPost: PostInput, id: ID!):  Post! @isAuth
        deletePostByID(id: ID!): PostNotification! @isAuth
    },
    input PostInput {
        title: String!
        content: String!
        featuredImage: String
    }
    type Post implements Node {
        id: ID!
        title: String!
        content: String!
        featuredImage: String
        createdAt: String
        updatedAt: String
        author: User!
    }
    type PostNotification {
        id: ID!
        message: String!
        success: Boolean
    }
    type PostPaginator {
        posts: [Post!]!
        paginator: PostLabels
    }
    type PostLabels {
        postCount: Int!
        perPage: Int!
        pageCount: Int!
        currentPage: Int!
        slNo: Int!
        hasPrevPage: Boolean!
        hasNextPage: Boolean!
        prev: Int
        next: Int
    }
    interface Node {
        id: ID!
    }
 
`