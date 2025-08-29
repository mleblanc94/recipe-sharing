import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_USER_CREATED, GET_USER_INTERESTED } from '../utils/queries';
import AuthService from '../utils/auth';
import RecipeDetails from './RecipeDetails'; // ✅ reuse the modal
import './Profile.css';

import image1 from '../projectImages/image1.jpg';
import image2 from '../projectImages/image2.jpg';
import image3 from '../projectImages/image3.jpg';
import image4 from '../projectImages/image4.jpg';
import image5 from '../projectImages/image5.jpg';
import image6 from '../projectImages/image6.jpeg';
import image7 from '../projectImages/image7.jpg';

const Profile = () => {
  const getImageSource = (imageName) => {
    const imageMap = { image1, image2, image3, image4, image5, image6, image7 };
    return imageMap[imageName] || imageMap.image1;
  };

  const userId = AuthService.loggedIn() ? AuthService.getProfile().data._id : null;

  const [createdRecipes, setCreatedRecipes] = useState([]);
  const [interestedRecipes, setInterestedRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const { loading: loadingCreated, data: data1 } = useQuery(GET_USER_CREATED, {
    variables: { userId },
    skip: !userId,
  });

  const { loading: loadingInterested, data: data2 } = useQuery(GET_USER_INTERESTED, {
    variables: { userId },
    skip: !userId,
  });

  useEffect(() => {
    if (data1 && data2) {
      setCreatedRecipes(data1.getCreatedRecipes || []);
      setInterestedRecipes(data2.getInterestedIn || []);
    }
  }, [data1, data2]);

  const loading = loadingCreated || loadingInterested;
  if (loading) return <p>Loading...</p>;

  const renderRecipeCards = (recipes) => (
    <div className="profile-card-grid">
      {recipes.map((recipe) => (
        <article
          key={recipe._id}
          className="recipe-card"
          onClick={() => setSelectedRecipe(recipe)}
        >
          <figure className="recipe-card-media">
            <img
              src={getImageSource(recipe.imageName)}
              alt={recipe.title}
              className="recipe-card-img"
            />
          </figure>
          <div className="recipe-card-body">
            <h3 className="recipe-card-title">{recipe.title}</h3>
            <p className="recipe-card-text">{recipe.description}</p>
          </div>
        </article>
      ))}
    </div>
  );

  return (
    <div className="pa4">
      <header className="mb4">
        <h2 className="fw7 f3">Your recipes & saves</h2>
        <p className="gray">These are the recipes you’ve created, and the ones you’re interested in.</p>
      </header>

      {/* Created */}
      <section className="mb5">
        <h3 className="fw6 f4 mb3">Recipes Created</h3>
        {createdRecipes.length > 0 ? (
          renderRecipeCards(createdRecipes)
        ) : (
          <p className="gray bg-light-gray pa3 br2">
            No created recipes yet. Try adding one from the Create page!
          </p>
        )}
      </section>

      {/* Interested */}
      <section>
        <h3 className="fw6 f4 mb3">Recipes Interested In</h3>
        {interestedRecipes.length > 0 ? (
          renderRecipeCards(interestedRecipes)
        ) : (
          <p className="gray bg-light-gray pa3 br2">
            You haven’t marked any recipes as Interested yet.
          </p>
        )}
      </section>

      {/* Modal */}
      {selectedRecipe && (
        <RecipeDetails
          recipe={selectedRecipe}
          closeModal={() => setSelectedRecipe(null)}
        />
      )}
    </div>
  );
};

export default Profile;
