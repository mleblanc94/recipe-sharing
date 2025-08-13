const { gql } = require('apollo-server-express');

const typeDefs = gql`

    type RecipeType {
    _id: ID!
    name: String!
    description: String
    }

    input RecipeInput {
    title: String!
    description: String!
    creator: String!
    recipeType: String!
    imageName: String
    }

    type Creator {
    _id: ID!
    }

    type Recipe {
    _id: ID!
    title: String!
    description: String!
    creator: Creator
    interestedIn: [User]
    recipeType: String!
    createdAt: String
    imageName: String
    }

    type User {
    _id: ID!
    username: String!
    email: String!
    password: String!
    }

    type UserInput {
    username: String!
    email: String!
    password: String!
    }

    type Auth {
    token: ID!
    user: User
    }

    type Query {
        getAllProjects: [Project]
        getInterestedIn(interestedIn: ID!): [Project]
        getCreatedProjects(creator: ID!): [Project]
        getNotCreatedProjects(creator: ID!): [Project]
        getAllProjectTypes: [ProjectType]
    }

    type Mutation {
    createRecipe(input: RecipeInput!): Recipe
    createUser(username: String!, email: String!, password: String!): Auth
    addToInterestedIn(projectId: ID!, userId: ID!): Project
    login(email: String!, password: String!): Auth
    }
`;

module.exports = typeDefs;