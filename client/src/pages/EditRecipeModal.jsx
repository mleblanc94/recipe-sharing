// client/src/pages/EditRecipeModal.jsx
import React, { useState, useEffect } from 'react';
import { useMutation, gql } from '@apollo/client';
import { UPDATE_RECIPE } from '../utils/mutations';

const EditRecipeModal = ({ recipe, onClose, onSaved }) => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    ingredients: '',
    instructions: '',
    recipeType: recipe?.recipeType || '',
    imageName: recipe?.imageName || 'image1',
  });

  useEffect(() => {
    if (!recipe) return;
    setForm({
      title: recipe.title || '',
      description: recipe.description || '',
      ingredients: recipe.ingredients || '',
      instructions: recipe.instructions || '',
      recipeType: recipe.recipeType || '',
      imageName: recipe.imageName || 'image1',
    });
  }, [recipe]);

  const [updateRecipe, { loading }] = useMutation(UPDATE_RECIPE, {
    // Write the returned fields into the Recipe entity in cache
    update(cache, { data: { updateRecipe: updated } }) {
      cache.writeFragment({
        id: cache.identify({ __typename: 'Recipe', _id: updated._id }),
        fragment: gql`
          fragment UpdatedRecipeFields on Recipe {
            title
            description
            ingredients
            instructions
            recipeType
            imageName
          }
        `,
        data: updated,
      });
    },
    onCompleted: ({ updateRecipe: updated }) => {
      // Let parent update its local state (createdRecipes list) immediately
      onSaved?.(updated);
      onClose?.();
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const input = {
      title: form.title.trim(),
      description: form.description.trim(),
      ingredients: form.ingredients,   // keep as single string
      instructions: form.instructions, // keep as single string
      recipeType: form.recipeType,
      imageName: form.imageName,
    };

    updateRecipe({
      variables: { recipeId: recipe._id, input },
      // Instant UI: assume success and write the new fields right away
      optimisticResponse: {
        updateRecipe: {
          __typename: 'Recipe',
          _id: recipe._id,
          title: input.title || recipe.title,
          description: input.description || recipe.description,
          ingredients: input.ingredients ?? recipe.ingredients,
          instructions: input.instructions ?? recipe.instructions,
          recipeType: input.recipeType ?? recipe.recipeType,
          imageName: input.imageName ?? recipe.imageName,
          // include fields that other components might read (safe to keep existing ones)
          myVote: recipe.myVote ?? 0,
          votes: recipe.votes ?? { __typename: 'RecipeVotes', up: 0, down: 0, score: 0 },
          creator: recipe.creator,        // preserve relations
          interestedIn: recipe.interestedIn,
          createdAt: recipe.createdAt,
        },
      },
    });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <header className="modal-header">
          <h3>Edit Recipe</h3>
          <button className="icon-btn" onClick={onClose} aria-label="Close">✕</button>
        </header>

        <form onSubmit={handleSubmit} className="modal-body">
          <label className="db mb2">
            <span className="db mb1">Title</span>
            <input name="title" value={form.title} onChange={handleChange} required />
          </label>

          <label className="db mb2">
            <span className="db mb1">Description</span>
            <textarea name="description" value={form.description} onChange={handleChange} rows={3} />
          </label>

          <label className="db mb2">
            <span className="db mb1">Ingredients (text)</span>
            <textarea name="ingredients" value={form.ingredients} onChange={handleChange} rows={5} />
          </label>

          <label className="db mb2">
            <span className="db mb1">Instructions (text)</span>
            <textarea name="instructions" value={form.instructions} onChange={handleChange} rows={6} />
          </label>

          <div className="flex gap1">
            <button type="submit" className="btn primary" disabled={loading}>
              {loading ? 'Saving…' : 'Save Changes'}
            </button>
            <button type="button" className="btn" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditRecipeModal;
