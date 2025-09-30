// client/src/pages/EditRecipeModal.jsx
import React, { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
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
      ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients.join('\n') : recipe.ingredients || '',
      instructions: Array.isArray(recipe.instructions) ? recipe.instructions.join('\n') : recipe.instructions || '',
      recipeType: recipe.recipeType || '',
      imageName: recipe.imageName || 'image1',
    });
  }, [recipe]);

  const [updateRecipe, { loading }] = useMutation(UPDATE_RECIPE, {
    onCompleted: (res) => {
      onSaved?.(res.updateRecipe);
      onClose();
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
      // Convert multi-line text back into arrays if your schema expects arrays
      ingredients: form.ingredients.split('\n').map(s => s.trim()).filter(Boolean),
      instructions: form.instructions.split('\n').map(s => s.trim()).filter(Boolean),
      recipeType: form.recipeType,
      imageName: form.imageName,
    };
    updateRecipe({ variables: { recipeId: recipe._id, input } });
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
            <span className="db mb1">Ingredients (one per line)</span>
            <textarea name="ingredients" value={form.ingredients} onChange={handleChange} rows={5} />
          </label>

          <label className="db mb2">
            <span className="db mb1">Instructions (one step per line)</span>
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
