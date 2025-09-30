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
    ingredients: String
    instructions: String
    creator: String!
    recipeType: String!
    imageName: String
  }

  # NEW: for partial updates (no creator required)
  input RecipeUpdateInput {
    title: String
    description: String
    ingredients: String
    instructions: String
    recipeType: String
    imageName: String
  }

  type Creator {
    _id: ID!
  }

  type RecipeVotes {
    up: Int!
    down: Int!
    score: Int!
  }

  type Recipe {
    _id: ID!
    title: String!
    description: String!
    ingredients: String
    instructions: String
    creator: Creator
    interestedIn: [User]
    recipeType: String!
    createdAt: String
    imageName: String
    votes: RecipeVotes!
    myVote: Int!
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

  type DeleteResult {
    _id: ID!
    success: Boolean!
    message: String
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
    voteOnRecipe(recipeId: ID!, value: Int!): Recipe!
    updateRecipe(recipeId: ID!, input: RecipeUpdateInput!): Recipe
    deleteRecipe(recipeId: ID!): DeleteResult!
    removeFromInterestedIn(recipeId: ID!, userId: ID!): Recipe
  }
`;

module.exports = typeDefs;