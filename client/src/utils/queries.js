import { gql } from '@apollo/client';

export const GET_ALL_RECIPES = gql`
    query getAllRecipes {
        getAllRecipes {
          _id
          title
          description
          projectType
          imageName
          thumbs
        }
    }
`