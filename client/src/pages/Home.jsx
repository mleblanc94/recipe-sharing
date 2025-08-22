import React, { useState } from 'react';
import RecipeDetails from './RecipeDetails';
import { useQuery, useMutation } from '@apollo/client';
import { ADD_INTERESTED_USER } from '../utils/mutations';
import { GET_ALL_RECIPES } from '../utils/queries';
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
    const imageMap = { image1, image2, image3, image4, image5, image6, image7 };
    return imageMap[imageName] || imageMap['default.jpg'];
  };

  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [favorites, setFavorites] = useState([]);

  const profile = AuthService.loggedIn() ? AuthService.getProfile() : null;
  const userId = profile?.data?._id;
  const isLoggedIn = !!userId;

  // No variables here
  const { loading, error, data } = useQuery(GET_ALL_RECIPES);

  const [addInterestedIn] = useMutation(ADD_INTERESTED_USER);

  if (loading) return <p>Loading page...</p>;
  if (error) {
    console.error(error);
    return <p>Failed to load recipes.</p>;
  }

  const recipes = data?.getAllRecipes || [];

  const openRecipeDetails = (recipe) => setSelectedRecipe(recipe);
  const addToFavorites = (recipe) => setFavorites((prev) => [...prev, recipe]);

  const addInterested = async (e, recipeId) => {
    e.stopPropagation();
    try {
      const { data } = await addInterestedIn({
        variables: { recipeId, userId },   // ✅ call the mutation function
      });
      console.log('User added to InterestedIn', data.addToInterestedIn);
    } catch (err) {
      console.error('Error adding user to interested in:', err.message);
    }
  };

  const renderInterested = (recipe) => {
    if (!isLoggedIn) return null; // hide if not signed in
    const already = (recipe.interestedIn || []).some((u) => u._id === userId);
    return already ? (
      <label>Already chosen recipe previously</label>
    ) : (
      <button onClick={(e) => addInterested(e, recipe._id)}>Interested</button>
    );
  };

  return (
    <div className="pa4">
      <div>
        <h1>Welcome to Recipe Share!</h1>
        <p>Get ideas on the best community recipes around</p>
      </div>

      <h1 className="tc">Recipes</h1>
      <div className="flex justify-center">
        <div className="flex flex-wrap justify-between mw8">
          {recipes.map((recipe) => (
            <article
              key={recipe._id}  // ✅ stable key
              className="br2 ba dark-gray b--black-10 mv4 w-100 w-40-l shadow-5 ma2"
              onClick={() => openRecipeDetails(recipe)}
              style={{ cursor: 'pointer' }}
            >
              <main className="pa4 black-80">
                <h2 className="f4 fw6">{recipe.title}</h2>
                <img
                  src={getImageSource(recipe.imageName)}
                  style={{ maxWidth: '200px', maxHeight: '200px' }}
                  alt={recipe.title}
                  className="w-100 pointer"
                  onClick={(e) => e.stopPropagation()}
                />
                <p>{recipe.description}</p>
                {renderInterested(recipe)} {/* ✅ actually render it */}
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
  );
};

export default Home;