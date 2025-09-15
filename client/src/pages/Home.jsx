// client/src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RecipeDetails from './RecipeDetails';
import { useQuery, useMutation } from '@apollo/client';
import { ADD_INTERESTED_USER, VOTE_ON_RECIPE } from '../utils/mutations'; // <-- NEW
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
  const [voteOnRecipe] = useMutation(VOTE_ON_RECIPE);

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

  // vote handler
  const handleVote = async (e, recipe, value) => {
    e.stopPropagation();
    // Toggle off if clicking the same value again
    const prev = recipe.myVote ?? 0;
    const next = prev === value ? 0 : value;

    const deltaUp = (prev === 1 ? -1 : 0) + (next === 1 ? 1 : 0);
    const deltaDown = (prev === -1 ? -1 : 0) + (next === -1 ? 1 : 0);

    const optimistic = {
      __typename: 'Recipe',
      _id: recipe._id,
      myVote: next,
      votes: {
        __typename: 'RecipeVotes',
        up: (recipe.votes?.up ?? 0) + deltaUp,
        down: (recipe.votes?.down ?? 0) + deltaDown,
        score: (recipe.votes?.score ?? 0) + deltaUp - deltaDown,
      },
    };

    try {
      await voteOnRecipe({
        variables: { recipeId: recipe._id, value: next },
        optimisticResponse: { voteOnRecipe: optimistic },
        update: (cache, { data: resp }) => {
          const updatedRecipe = resp?.voteOnRecipe;
          if (!updatedRecipe) return;
          const existing = cache.readQuery({ query: GET_ALL_RECIPES });
          if (!existing?.getAllRecipes) return;
          cache.writeQuery({
            query: GET_ALL_RECIPES,
            data: {
              getAllRecipes: existing.getAllRecipes.map(r =>
                r._id === recipe._id ? { ...r, ...updatedRecipe } : r
              ),
            },
          });
        },
      });
    } catch (err) {
      console.error('Error voting on recipe:', err.message);
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

  // NEW: small vote UI
  const renderVotes = (recipe) => (
    <div className="vote-controls" onClick={(e) => e.stopPropagation()}>
      <button
        className={`btn btn-icon ${recipe.myVote === 1 ? 'active' : ''}`}
        aria-label="Thumbs up"
        title="Thumbs up"
        onClick={(e) => handleVote(e, recipe, 1)}
      >
        👍
      </button>
      <span className="vote-score" aria-live="polite">
        {recipe.votes?.score ?? 0}
      </span>
      <button
        className={`btn btn-icon ${recipe.myVote === -1 ? 'active' : ''}`}
        aria-label="Thumbs down"
        title="Thumbs down"
        onClick={(e) => handleVote(e, recipe, -1)}
      >
        👎
      </button>
    </div>
  );

  return (
  <div className="home-wrap">
    <header className="home-hero">
      <h1>Welcome to Recipe Share!</h1>
      <p>
        Discover crowd-favorite recipes from the community. Click <em>More details</em> to preview any dish.
      </p>
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

          {/* Row 1: action buttons */}
          <div className="card-actions">
            <div className="btn-group">
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
          </div>

          {votes (right-aligned)}
          <div className="card-votes">
            {renderVotes(recipe)}
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