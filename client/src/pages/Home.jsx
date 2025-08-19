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
import image6 from '../projectImages/image6.jpeg';
import image7 from '../projectImages/image7.jpg';

const Home = () => {
  const getImageSource = (imageName) => {
    const imageMap = {
            'image1': image1,
            'image2': image2,
            'image3': image3,
            'image4': image4,
            'image5': image5,
            'image6': image6,
            'image7': image7,

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

  const recipes = data?.getNotCreatedRecipes || [];

  const openRecipeDetails = (recipe) => {
    setSelectedRecipe(recipe);
  }

  const isRecipeInterestedIn = (recipeId, interestedInID) => {
    const userExists = interestedInID.some(user => user._id === userId);
    if (userExists) {
      return <label>Already chosen recipe previously</label>
    } else {
      return (
        <button onClick={(e) => addInterestedIn(recipeId, e)}>
          Interested
        </button>
      );
    }
  };

  const addToFavorites = (recipe) => {
    setFavorites([...favorites, recipe]);
  }

  const addInterested = async (recipeId, e) => {
    e.stopPropagation();
    try {
      const { data } = await addInterested({
        variables: {
          recipeId,
          userId,
        },
      });
      console.log('User added to InterestedIn', data.addToInterestedIn);
    } catch (error) {
      console.error('Error adding user to interested in:', error.message);
    }
  };

  return (
    <div className="pa4">
      <div>
        <h1>Welcome to Recipe Share!</h1>
        <p>Get ideas on the best community recipes around</p>
        {/* Keep your intro paragraphs here */}
      </div>
      <h1 className="tc">Recipes</h1>
      <div className="flex justify-center">
        <div className="flex flex-wrap justify-between mw8">
          {recipes.map((recipe, index) => (
            <article
              key={index}
              className="br2 ba dark-gray b--black-10 mv4 w-100 w-40-l shadow-5 ma2"
              onClick={() => openRecipeDetails(recipe)}
              style={{ cursor: 'pointer' }}
            >
              <main className="pa4 black-80">
                <h2 className="f4 fw6">{recipe.title}</h2>
                <img
                  src={getImageSource(recipe.imageName)}
                  style={{ maxWidth: '250px', maxHeight: '250px' }}
                  alt={recipe.title}
                  className="w-100 pointer"
                  onClick={(e) => e.stopPropagation()}
                />
                <p>{recipe.description}</p>
              </main>
            </article>
          ))}
        </div>
      </div>

      {selectedRecipe && (
          <RecipeDetails
            recipe={selectedRecipe}
            addToFavorites={addToFavorites}
            closeModal={() => setSelectedRecipe(null)}
          />
      )}
    </div>
  )
}

export default Home;