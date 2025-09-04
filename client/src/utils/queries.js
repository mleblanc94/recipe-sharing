import { gql } from '@apollo/client';

export const GET_ALL_RECIPES = gql`
    query getAllRecipes {
        getAllRecipes {
          _id
          title
          description
          ingredients
          instructions
          recipeType
          imageName
          interestedIn { _id }
          votes { up down score }
          myVote
        }
    }
`;

export const GET_ALL_RECIPE_TYPES = gql`
query getAllRecipeTypes {
  getAllRecipeTypes {
  _id
  name
  }
}
`;

export const GET_USER_CREATED = gql`
  query getUserCreated($userId: ID!) {
    getCreatedRecipes(creator: $userId) {
    _id
    title
    description
    ingredients
    instructions
    imageName
    recipeType
    interestedIn { _id }
    votes { up down score }
    myVote
    }
  }
`;

export const GET_USER_NOT_CREATED = gql`
query getUserNotCreated($userId: ID!) {
  getNotCreatedRecipes(creator: $userId) {
  _id
  title
  description
  ingredients
  instructions
  interestedIn {
    _id
  }
    imageName
    recipeType 
    interestedIn { _id }
    votes { up down score }
    myVote
  }
}
`;

export const GET_USER_INTERESTED = gql`
  query getUserInterested($userId: ID!) {
    getInterestedIn(interestedIn: $userId) {
    _id
    title
    description
    ingredients
    instructions
    imageName
    recipeType
    interestedIn {
    _id
    }
    }
  }
`;