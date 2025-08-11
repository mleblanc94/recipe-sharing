import React, { useState } from 'react';
import RecipeDetails from './RecipeDetails';
import { useQuery } from '@apollo/client';
import { useMutation } from '@apollo/client';
import {ADD_INTERESTED_USER} from '../utils/mutations';
import { GET_USER_NOT_CREATED } from '../utils/queries';
import AuthService from '../utils/auth';
import 'tachyons';
import './Home.css';
import image1 from '../projectImages/image1.jpg';
import image2 from '../projectImages/image2.jpg';
import image3 from '../projectImages/image3.jpg';
import image4 from '../projectImages/image4.jpg';
import image5 from '../projectImages/image5.jpg';
import image6 from '../projectImages/image6.jpg';

const Home = () => {
  const getImageSource = (imageName) => {
    const imageMap = {
            'image1': image1,
            'image2': image2,
            'image3': image3,
            'image4': image4,
            'image5': image5,
            'image6': image6,
    };
    return imageMap[imageName] || imageMap['default.jpg'];
  };

  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [favorites, setFavorites] = useState([]);

  const profile = AuthService.loggedIn() ? AuthService.getProfile() : null;
  const userId = profile?.date?._id;

  if (!userId) {
    window.location.assign('/signin');
    return null;
  }

  const { loading, error, data } = useQuery(GET_USER_NOT_CREATED, {
    variables: { userId },
  });

  const [addInterestedIn] = useMutation(ADD_INTERESTED_USER);

  if (loading) return <p>Loading page...</p>;

  const projects = data?.getNotCreatedRecipes || [];

  const openRecipeDetails = (project) => {
    setSelectedRecipe(recipe);
  }

}