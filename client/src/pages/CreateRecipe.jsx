import React, { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { CREATE_RECIPE } from '../utils/mutations';
import { GET_ALL_RECIPE_TYPES } from '../utils/queries';
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

const images = [
  { name: 'image1', src: image1, alt: 'Recipe image 1' },
  { name: 'image2', src: image2, alt: 'Recipe image 2' },
  { name: 'image3', src: image3, alt: 'Recipe image 3' },
  { name: 'image4', src: image4, alt: 'Recipe image 4' },
  { name: 'image5', src: image5, alt: 'Recipe image 5' },
  { name: 'image6', src: image6, alt: 'Recipe image 6' },
  { name: 'image7', src: image7, alt: 'Recipe image 7' },
];

// turn a textarea into an array of lines (strip leading "- " and blanks)
const toLines = (s) =>
  String(s || '')
    .split(/\r?\n/)
    .map(t => t.replace(/^\s*-\s*/, '').trim())
    .filter(Boolean);

const CreateRecipe = () => {
  const [recipeData, setRecipeData] = useState({
    title: '',
    description: '',
    ingredients: '',     // textareas as strings in state
    instructions: '',
    recipeType: '',      // select value (ObjectId or enum string)
    imageName: 'image1',
  });
  const [formError, setFormError] = useState('');

  const { loading: loadingPT, error: errorPT, data } = useQuery(GET_ALL_RECIPE_TYPES);
  const recipeTypes = data?.getAllRecipeTypes ?? [];

  const [createRecipe, { loading, error }] = useMutation(CREATE_RECIPE);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRecipeData((s) => ({ ...s, [name]: value }));
  };

  const handleImageChange = (imageName) => {
    setRecipeData((s) => ({ ...s, imageName }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    // basic client-side validation
    if (!recipeData.title.trim()) return setFormError('Title is required.');
    if (!recipeData.recipeType)   return setFormError('Please select a recipe type.');
    if (!recipeData.ingredients.trim())  return setFormError('Add at least one ingredient.');
    if (!recipeData.instructions.trim()) return setFormError('Add at least one instruction.');

    // shape the payload to match the schema
    const variables = {
      input: {
        title: recipeData.title.trim(),
        description: recipeData.description.trim(),
        ingredients: toLines(recipeData.ingredients),     // <-- arrays now
        instructions: toLines(recipeData.instructions),   // <-- arrays now
        recipeType: recipeData.recipeType,                // value from select
        imageName: recipeData.imageName,
        // creator: AuthService.getProfile().data._id,    // usually NOT needed; server should set from JWT
      },
    };

    try {
      // make sure the auth header is present (login first)
      const isLoggedIn = AuthService.loggedIn?.() || !!localStorage.getItem('id_token');
      if (!isLoggedIn) return setFormError('Please log in before creating a recipe.');

      const res = await createRecipe({ variables });
      console.log('Recipe created:', res.data.createRecipe);
      window.location.assign('/profile');
    } catch (err) {
      console.error('Error creating recipe:', err?.graphQLErrors?.[0]?.message || err.message);
      setFormError('Unable to create recipe');
    }
  };

  if (loadingPT) return <p className="tc">Loading...</p>;
  if (errorPT)   return <p className="tc">Error: {errorPT.message}</p>;

  return (
    <div className="form-wrap">
      <article className="form-card shadow-5">
        <header className="form-header">
          <h2>Create a Recipe</h2>
          <p className="form-sub">Pick a cover image, then describe your dish.</p>
        </header>

        <form onSubmit={handleSubmit} noValidate>
          {/* Image chooser */}
          <div className="field">
            <label className="field-label">Select an image</label>
            <div className="image-grid">
              {images.map((img) => {
                const selected = recipeData.imageName === img.name;
                return (
                  <button
                    key={img.name}
                    type="button"
                    aria-pressed={selected}
                    className={`image-option ${selected ? 'selected' : ''}`}
                    onClick={() => handleImageChange(img.name)}
                    title={img.alt}
                  >
                    <img src={img.src} alt={img.alt} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Title */}
          <div className="field">
            <label htmlFor="title" className="field-label">Title</label>
            <input
              id="title"
              name="title"
              type="text"
              className="input"
              placeholder="e.g., Creamy Pesto Pasta"
              value={recipeData.title}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Description */}
          <div className="field">
            <label htmlFor="description" className="field-label">Description</label>
            <textarea
              id="description"
              name="description"
              className="textarea"
              rows={4}
              placeholder="Short description of your recipe"
              value={recipeData.description}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Ingredients */}
          <div className="field">
            <label htmlFor="ingredients" className="field-label">Ingredients</label>
            <textarea
              id="ingredients"
              name="ingredients"
              className="textarea"
              rows={6}
              placeholder={`- 2 cups flour
- 1 tsp salt
- 3 eggs`}
              value={recipeData.ingredients}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Instructions */}
          <div className="field">
            <label htmlFor="instructions" className="field-label">Instructions</label>
            <textarea
              id="instructions"
              name="instructions"
              className="textarea"
              rows={8}
              placeholder={`1) Mix dry ingredients...
2) Add eggs and knead...
3) Cook and serve.`}
              value={recipeData.instructions}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Recipe type (CONTROLLED) */}
          <div className="field">
            <label htmlFor="recipeType" className="field-label">Recipe Type</label>
            <select
              id="recipeType"
              name="recipeType"
              className="input"
              value={recipeData.recipeType}
              onChange={handleInputChange}
              required
            >
              <option value="" disabled>Select a Recipe Type</option>
              {recipeTypes.map((rt) => (
                <option key={rt._id} value={rt._id /* or rt.name if schema expects enum */}>
                  {rt.name}
                </option>
              ))}
            </select>
          </div>

          {/* Actions */}
          <div className="form-actions">
            <button
              type="submit"
              className="btn"
              disabled={
                loading ||
                !recipeData.title.trim() ||
                !recipeData.recipeType ||
                !recipeData.ingredients.trim() ||
                !recipeData.instructions.trim()
              }
            >
              {loading ? 'Submitting…' : 'Submit'}
            </button>
            {(formError || error) && (
              <span className="error-text">
                {formError || `Error: ${error.message}`}
              </span>
            )}
          </div>
        </form>
      </article>
    </div>
  );
};

export default CreateRecipe;