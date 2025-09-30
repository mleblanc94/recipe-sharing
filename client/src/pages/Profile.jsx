// client/src/pages/Profile.jsx
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_USER_CREATED, GET_USER_INTERESTED } from '../utils/queries';
import { DELETE_RECIPE, REMOVE_FROM_INTERESTED } from '../utils/mutations';
import { UPDATE_RECIPE } from '../utils/mutations'; // used indirectly by modal
import AuthService from '../utils/auth';
import RecipeDetails from './RecipeDetails';
import EditRecipeModal from './EditRecipeModal';
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
  const [editingRecipe, setEditingRecipe] = useState(null);

  const { loading: loadingCreated, data: data1, refetch: refetchCreated } = useQuery(GET_USER_CREATED, {
    variables: { userId },
    skip: !userId,
    fetchPolicy: 'cache-and-network',
  });

  const { loading: loadingInterested, data: data2, refetch: refetchInterested } = useQuery(GET_USER_INTERESTED, {
    variables: { userId },
    skip: !userId,
    fetchPolicy: 'cache-and-network',
  });

  const [deleteRecipe] = useMutation(DELETE_RECIPE, {
    onCompleted: () => refetchCreated(),
  });

  const [removeFromInterested] = useMutation(REMOVE_FROM_INTERESTED, {
    onCompleted: () => refetchInterested(),
  });

  useEffect(() => {
    if (data1) setCreatedRecipes(data1.getCreatedRecipes || []);
  }, [data1]);

  useEffect(() => {
    if (data2) setInterestedRecipes(data2.getInterestedIn || []);
  }, [data2]);

  const loading = loadingCreated || loadingInterested;
  if (loading) return <p>Loading...</p>;

  const confirm = (msg) => window.confirm(msg);

  const handleDeleteCreated = async (recipeId) => {
    if (!confirm('Delete this recipe for everyone? This cannot be undone.')) return;
    await deleteRecipe({ variables: { recipeId } });
  };

  const handleDeleteInterested = async (recipeId) => {
    if (!confirm('Remove this from your Interested list?')) return;
    await removeFromInterested({ variables: { recipeId, userId } });
  };

  const openEdit = (recipe) => setEditingRecipe(recipe);

  const onEditSaved = (updated) => {
    // Update UI without full refetch if you want snappier UX:
    setCreatedRecipes((list) => list.map(r => r._id === updated._id ? { ...r, ...updated } : r));
  };

  const Card = ({ recipe, mode }) => {
    // mode: 'created' or 'interested'
    return (
      <article
        key={recipe._id}
        className="recipe-card hover-overlay"
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

        {/* Hover actions */}
        <div className="card-actions" onClick={(e) => e.stopPropagation()}>
          {mode === 'created' && (
            <button
              className="action-btn"
              title="Edit recipe"
              onClick={() => openEdit(recipe)}
            >
              ✏️ Edit
            </button>
          )}
          <button
            className="action-btn danger"
            title={mode === 'created' ? 'Delete recipe for everyone' : 'Remove from Interested'}
            onClick={() =>
              mode === 'created'
                ? handleDeleteCreated(recipe._id)
                : handleDeleteInterested(recipe._id)
            }
          >
            🗑️ {mode === 'created' ? 'Delete' : 'Remove'}
          </button>
        </div>
      </article>
    );
  };

  const renderRecipeCards = (recipes, mode) => (
    <div className="profile-card-grid">
      {recipes.map((recipe) => (
        <Card key={recipe._id} recipe={recipe} mode={mode} />
      ))}
    </div>
  );

  return (
    <div className="pa4">
      <header className="mb4">
        <h2 className="fw7 f3">Your recipes & saves</h2>
        <p className="gray">Edit or remove items right from your profile.</p>
      </header>

      {/* Created */}
      <section className="mb5">
        <h3 className="fw6 f4 mb3">Recipes Created</h3>
        {createdRecipes.length > 0 ? (
          renderRecipeCards(createdRecipes, 'created')
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
          renderRecipeCards(interestedRecipes, 'interested')
        ) : (
          <p className="gray bg-light-gray pa3 br2">
            You haven’t marked any recipes as Interested yet.
          </p>
        )}
      </section>

      {/* Details modal */}
      {selectedRecipe && (
        <RecipeDetails
          recipe={selectedRecipe}
          closeModal={() => setSelectedRecipe(null)}
        />
      )}

      {/* Edit modal */}
      {editingRecipe && (
        <EditRecipeModal
          recipe={editingRecipe}
          onClose={() => setEditingRecipe(null)}
          onSaved={onEditSaved}
        />
      )}
    </div>
  );
};

export default Profile;