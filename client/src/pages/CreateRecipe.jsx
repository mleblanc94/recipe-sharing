import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { useQuery } from '@apollo/client';
import { CREATE_RECIPE } from '../utils/mutations';
import { GET_ALL_RECIPE_TYPES } from '../utils/queries';
import AuthService from '../utils/auth';
import image1 from '../projImages/image1.jpg';
import image2 from '../projImages/image2.jpg';
import image3 from '../projImages/image3.svg';
import image4 from '../projImages/image4.png';
import image5 from '../projImages/image5.jpg';
import image6 from '../projImages/image6.jpg';

const CreateRecipe = () => {
  const [recipeData, setRecipeData] = useState({
    title: '',
    description: '',
    creator: '',
    recipeType: '',
    imageName: 'default.png',
  });

  const { loadingPT, errorPT, data } = useQuery(GET_ALL_RECIPE_TYPES);
  if (loadingPT) return <p>Loading...</p>;
  if (errorPT) return <p>Error: {errorPT.message}</p>

  const recipeTypes = data ? data.getAllProjectTypes : [];

  const [createRecipe, { loading, error }] = useMutation(CREATE_RECIPE);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setRecipeData({ ...recipeData, [name]: value });
  };
  const handleImageChange = (imageName) => {
    setRecipeData({ ...recipeData, imageName });
  };
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const { data } = await createRecipe({
        variables: {
          input: {
            ...recipeData,
            creator: AuthService.getProfile().data._id,
          },
        },
      });

       // Show a success message
      console.log('Recipe created:', data.createRecipe);

      // Grab the token
      const userToken = AuthService.loggedIn() ? AuthService.getToken() : null;

      // Push the user to the profile page to show them it appears there
      window.location.assign('/profile');
    }
  }

}
