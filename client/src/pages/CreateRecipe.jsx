import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { useQuery } from '@apollo/client';
import { CREATE_RECIPE } from '../utils/mutations';
import { GET_ALL_RECIPE_TYPES } from '../utils/queries';
import AuthService from '../utils/auth';
import image1 from '../projectImages/image1.jpg';
import image2 from '../projectImages/image2.jpg';
import image3 from '../projectImages/image3.jpg';
import image4 from '../projectImages/image4.jpg';
import image5 from '../projectImages/image5.jpg';
import image6 from '../projectImages/image6.jpeg';
import image7 from '../projectImages/image7.jpg';

const CreateRecipe = () => {
  const [recipeData, setRecipeData] = useState({
    title: '',
    description: '',
    creator: '',
    recipeType: '',
    imageName: 'default.png',
  });

  const { loadingPT, errorPT, data } = useQuery(GET_ALL_RECIPE_TYPES);
  if (loadingPT) return <p>Loading...</p>;
  if (errorPT) return <p>Error: {errorPT.message}</p>
  console.log(data);

  const recipeTypes = data ? data.getAllRecipeTypes : [];

  const [createRecipe, { loading, error }] = useMutation(CREATE_RECIPE);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setRecipeData({ ...recipeData, [name]: value });
  };
  const handleImageChange = (imageName) => {
    setRecipeData({ ...recipeData, imageName });
  };
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const { data } = await createRecipe({
        variables: {
          input: {
            ...recipeData,
            creator: AuthService.getProfile().data._id,
          },
        },
      });

       // Show a success message
      console.log('Recipe created:', data.createRecipe);

      // Grab the token
      const userToken = AuthService.loggedIn() ? AuthService.getToken() : null;

      // Push the user to the profile page to show them it appears there
      window.location.assign('/profile');
    } catch (error) {
      // Show error
      console.error('Error creating project:', error.message);
    }
  }

  const images = [
    { name: 'image1', src: image1 },
    { name: 'image2', src: image2 },
    { name: 'image3', src: image3 },
    { name: 'image4', src: image4 },
    { name: 'image5', src: image5 },
    { name: 'image6', src: image6 },
    { name: 'image7', src: image7 },
  ];

  return (
    <div className="pa4" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <article className="br2 ba dark-gray b--black-10 mv4 shadow-5">
        <main className="pa4 black-80">
          <form className="measure" onSubmit={handleSubmit}>
            <fieldset id="createRecipe" className="ba b--transparent ph0 mh0">
              <legend className="f4 fw6 ph0 mh0">Create a Recipe</legend>
              <div className="mv3">
                <label className="db fw6 1h-copy f6">Select a Picture:</label>
                <div className="flex flex-wrap">
                  {images.map((img) => (
                    <div 
                    key={img.name}
                    className={`pa2 ba ${recipeData.imageName === img.name ? 'b--blue' : 'b--transparent'}`}
                    onClick={() => handleImageChange(img.name)}
                    style={{ cursor: 'pointer' }}
                    >
                      <img src={img.src} alt={img.src} style={{ maxWidth: '100px', maxHeight: '100px' }} />
                    </div>
                  ))}
                </div>
              </div>
                  <div className="mv3">
                    <label className="db fw6 1h-copy f6" htmlFor="title">
                      Title:
                    </label>
                    <input 
                    type="text"
                    className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                    id="title"
                    name="title"
                    onChange={handleInputChange} required
                    />
                  </div>
                  <div className="mv3">
                    <label className="db fw6 1h-copy f6" htmlFor="description">
                      Description:
                    </label>
                    <textarea 
                    className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                    id="description"
                    name="description"
                    rows="6"
                    onChange={handleInputChange} required
                    ></textarea>
                  </div>
                  <div className="mv3">
                    <label className="db fw6 1h-copy f6" htmlFor="recipeType">
                      Recipe Type:
                    </label>
                    <select
                    className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                    id="recipeType"
                    name="recipeType"
                    onChange={handleInputChange} required
                    >
                      <option value="">Select a Recipe Type</option>

                      {recipeTypes.map((recipeType) => (
                        <option key={recipeType._id} value={recipeType._id}>
                          {recipeType.name}
                        </option>
                      ))}
                      </select>
                  </div>
                  <div className="tc">
                <input
                  className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
                  type="submit"
                  value="Submit"
                />
              </div>
            </fieldset>
            {error && <p>Error: {error.message}</p>}
          </form>
        </main>
      </article>
    </div>
  );
};

export default CreateRecipe;
