// client/src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RecipeDetails from './RecipeDetails';
import { useQuery, useMutation } from '@apollo/client';
import { ADD_INTERESTED_USER } from '../utils/mutations';
import { GET_ALL_RECIPES, GET_USER_INTERESTED } from '../utils/queries';
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
    return imageMap[imageName] || imageMap.image1;
  };

  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const profile = AuthService.loggedIn() ? AuthService.getProfile() : null;
  const userId = profile?.data?._id;
  const isLoggedIn = !!userId;

  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) navigate('/signin', { replace: true });
  }, [isLoggedIn, navigate]);

  const { loading, error, data } = useQuery(GET_ALL_RECIPES, { skip: !isLoggedIn });
  const [addInterestedIn] = useMutation(ADD_INTERESTED_USER);

  if (!isLoggedIn) return null;
  if (loading) return <p>Loading page...</p>;
  if (error) {
    console.error(error);
    return <p>Failed to load recipes.</p>;
  }

  const recipes = data?.getAllRecipes || [];

  const openRecipeDetails = (recipe) => setSelectedRecipe(recipe);

  const addInterested = async (e, recipeId) => {
    e.stopPropagation();
    try {
      await addInterestedIn({
        variables: { recipeId, userId },
        refetchQueries: [{ query: GET_USER_INTERESTED, variables: { userId } }],
        awaitRefetchQueries: true,
      });
    } catch (err) {
      console.error('Error adding user to interested in:', err.message);
    }
  };

  const renderInterested = (recipe) => {
    const already = (recipe.interestedIn || []).some((u) => u._id === userId);
    return already ? (
      <span className="badge">Interested ✓</span>
    ) : (
      <button className="btn" onClick={(e) => addInterested(e, recipe._id)}>
        Interested
      </button>
    );
  };

  return (
    <div className="home-wrap">
      <header className="home-hero">
        <h1>Welcome to Recipe Share!</h1>
        <p>Discover crowd-favorite recipes from the community. Click <em>More details</em> to preview any dish.</p>
      </header>

      <h2 className="section-title">Recipes</h2>

      <div className="card-grid">
        {recipes.map((recipe) => (
          <article
            key={recipe._id}
            className="card"
            onClick={() => openRecipeDetails(recipe)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && openRecipeDetails(recipe)}
          >
            <figure className="card-media">
              <img
                src={getImageSource(recipe.imageName)}
                alt={recipe.title}
                className="card-img"
                onClick={(e) => e.stopPropagation()}
              />
            </figure>

            <div className="card-body">
              <h3 className="card-title">{recipe.title}</h3>
              <p className="card-text">{recipe.description}</p>
            </div>

            <div className="card-actions">
              <button
                className="btn btn-outline"
                onClick={(e) => {
                  e.stopPropagation();
                  openRecipeDetails(recipe);
                }}
              >
                More details
              </button>
              {renderInterested(recipe)}
            </div>
          </article>
        ))}
      </div>

      {selectedRecipe && (
        <RecipeDetails
          recipe={selectedRecipe}
          addToFavorites={() => {}}
          closeModal={() => setSelectedRecipe(null)}
        />
      )}
    </div>
  );
};

export default Home;
