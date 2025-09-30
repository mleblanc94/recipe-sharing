import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
    mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
    token
    user {
    _id
    username
        }
    }
}
`;

export const CREATE_USER = gql`
    mutation createUser($username: String!, $email: String!, $password: String!) {
    createUser(username: $username, email: $email, password: $password) {
    token
    user {
    _id
    username
    email
        }
    }
}
`;

export const CREATE_RECIPE = gql`
mutation CreateRecipe($input: RecipeInput!) {
    createRecipe(input: $input) {
    _id
    title
    description
    ingredients
    instructions
    creator {
        _id
    }
    recipeType
    imageName
    }
}
`;

export const ADD_INTERESTED_USER = gql`
mutation addToInterestedIn($recipeId: ID!, $userId: ID!) {
addToInterestedIn(recipeId: $recipeId, userId: $userId) {
_id
interestedIn {
    _id
        }
    }
}
`;

export const VOTE_ON_RECIPE = gql`
mutation VoteOnRecipe($recipeId: ID!, $value: Int!) {
    voteOnRecipe(recipeId: $recipeId, value: $value) {
_id
myVote
votes { up down score }
}
}
`;

export const DELETE_RECIPE = gql`
  mutation DeleteRecipe($recipeId: ID!) {
    deleteRecipe(recipeId: $recipeId) {
      _id
      success
      message
    }
  }
`;

export const REMOVE_FROM_INTERESTED = gql`
  mutation RemoveFromInterestedIn($recipeId: ID!, $userId: ID!) {
    removeFromInterestedIn(recipeId: $recipeId, userId: $userId) {
      _id
      interestedIn { _id }
    }
  }
`;

export const UPDATE_RECIPE = gql`
  mutation UpdateRecipe($recipeId: ID!, $input: RecipeInput!) {
    updateRecipe(recipeId: $recipeId, input: $input) {
      _id
      title
      description
      ingredients
      instructions
      recipeType
      imageName
    }
  }
`;
