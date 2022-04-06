import { gql } from "apollo-server-express";
import { GraphQLUpload } from 'graphql-upload';

export default gql `
    scalar Upload
    extend type Query {
        info: String!
    }
    # Multiple uploads are supported. See graphql-upload docs for details.
    extend type Mutation {
        imageUploader(file: Upload!): File! @isAuth
    }
    
    type File {
        filename: String!
        mimetype: String!
        encoding: String!
    }
`