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
        getAllRecipes: [Recipe]
        getInterestedIn(interestedIn: ID!): [Recipe]
        getCreatedRecipes(creator: ID!): [Recipe]
        getNotCreatedRecipes(creator: ID!): [Recipe]
        getAllRecipeTypes: [RecipeType]
    }

    type Mutation {
    createRecipe(input: RecipeInput!): Recipe
    createUser(username: String!, email: String!, password: String!): Auth
    addToInterestedIn(recipeId: ID!, userId: ID!): Recipe
    login(email: String!, password: String!): Auth
    }
`;

module.exports = typeDefs;