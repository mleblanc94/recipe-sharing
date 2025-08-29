import React, { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { CREATE_RECIPE } from '../utils/mutations';
import { GET_ALL_RECIPE_TYPES } from '../utils/queries';
import AuthService from '../utils/auth';

import 'tachyons';
import './Home.css'; // keep using your shared styles

// Images
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

const CreateRecipe = () => {
  const [recipeData, setRecipeData] = useState({
    title: '',
    description: '',
    ingredients: '',
    instructions: '',
    creator: '',
    recipeType: '',
    imageName: 'image1', // default to something visible
  });

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
    try {
      const creator = AuthService.getProfile().data._id;
      const { data } = await createRecipe({
        variables: { input: { ...recipeData, creator } },
      });

      // Success -> go show it on profile
      console.log('Recipe created:', data.createRecipe);
      window.location.assign('/profile');
    } catch (err) {
      console.error('Error creating recipe:', err.message);
    }
  };

  if (loadingPT) return <p className="tc">Loading...</p>;
  if (errorPT) return <p className="tc">Error: {errorPT.message}</p>;

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
              placeholder="- 2 cups flour
- 1 tsp salt
- 3 eggs"
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
              rows={6}
              placeholder="1) Mix dry ingredients...
2) Add eggs and knead...
3) Cook and serve."
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Recipe type */}
          <div className="field">
            <label htmlFor="recipeType" className="field-label">Recipe Type</label>
            <select
              id="recipeType"
              name="recipeType"
              className="input"
              onChange={handleInputChange}
              required
              defaultValue=""
            >
              <option value="" disabled>
                Select a Recipe Type
              </option>
              {recipeTypes.map((rt) => (
                <option key={rt._id} value={rt._id}>
                  {rt.name}
                </option>
              ))}
            </select>
          </div>

          {/* Actions */}
          <div className="form-actions">
            <button type="submit" className="btn" disabled={loading}>
              {loading ? 'Submitting…' : 'Submit'}
            </button>
            {error && <span className="error-text">Error: {error.message}</span>}
          </div>
        </form>
      </article>
    </div>
  );
};

export default CreateRecipe;
