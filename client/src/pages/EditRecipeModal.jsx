// client/src/pages/EditRecipeModal.jsx
import React, { useState, useEffect } from 'react';
import { useMutation, gql } from '@apollo/client';
import { UPDATE_RECIPE } from '../utils/mutations';

// import your preview images (same ones you use elsewhere)
import image1 from '../projectImages/image1.jpg';
import image2 from '../projectImages/image2.jpg';
import image3 from '../projectImages/image3.jpg';
import image4 from '../projectImages/image4.jpg';
import image5 from '../projectImages/image5.jpg';
import image6 from '../projectImages/image6.jpeg';
import image7 from '../projectImages/image7.jpg';

const getImageSource = (imageName) => {
  const map = { image1, image2, image3, image4, image5, image6, image7 };
  return map[imageName] || map.image1;
};

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
      ingredients: form.ingredients,
      instructions: form.instructions,
      recipeType: form.recipeType,
      imageName: form.imageName,
    };

    updateRecipe({
      variables: { recipeId: recipe._id, input },
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
          myVote: recipe.myVote ?? 0,
          votes: recipe.votes ?? { __typename: 'RecipeVotes', up: 0, down: 0, score: 0 },
          creator: recipe.creator,
          interestedIn: recipe.interestedIn,
          createdAt: recipe.createdAt,
        },
      },
    });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <section className="modal-panel edit-modal" onClick={(e) => e.stopPropagation()}>
        <header className="modal-header edit-header">
          <h2>Edit Recipe</h2>
          <button className="close" onClick={onClose} aria-label="Close">×</button>
        </header>

        <div className="modal-content edit-grid">
          {/* Left: live preview */}
          <figure className="edit-media">
            <img
              src={getImageSource(form.imageName)}
              alt={form.title || 'Recipe image'}
            />
            <figcaption className="edit-media-cap">Live preview</figcaption>
          </figure>

          {/* Right: form */}
          <form onSubmit={handleSubmit} className="edit-form">
            <div className="field">
              <label className="field-label">Title</label>
              <input className="input" name="title" value={form.title} onChange={handleChange} required />
            </div>

            <div className="field">
              <label className="field-label">Description</label>
              <textarea className="textarea" name="description" value={form.description} onChange={handleChange} rows={3} />
            </div>

            <div className="field">
              <label className="field-label">Ingredients (text)</label>
              <textarea className="textarea" name="ingredients" value={form.ingredients} onChange={handleChange} rows={5} />
              <small className="hint">Tip: keep one item per line if you plan to split later.</small>
            </div>

            <div className="field">
              <label className="field-label">Instructions (text)</label>
              <textarea className="textarea" name="instructions" value={form.instructions} onChange={handleChange} rows={6} />
            </div>

            {/* Actions */}
            <div className="edit-actions">
              <button type="submit" className="btn" disabled={loading}>
                {loading ? 'Saving…' : 'Save Changes'}
              </button>
              <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default EditRecipeModal;