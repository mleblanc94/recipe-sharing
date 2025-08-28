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

export const UPDATE_THUMBS = gql`
mutation updateThumbs($recipeId: ID!, $thumb: Int!, $userId: ID!) {
updateThumbs(recipeId: $recipeId, thumb: $thumb, userId: $userId) {
_id
thumb
usersVoted {
    _id
}
}
}
`;