import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import AuthService from '../utils/auth';
import { UPDATE_THUMBS } from '../utils/mutations'
import './Home.css';
import image1 from '../projectImages/image1.jpg';
import image2 from '../projectImages/image2.jpg';
import image3 from '../projectImages/image3.jpg';
import image4 from '../projectImages/image4.jpg';
import image5 from '../projectImages/image5.jpg';
import image6 from '../projectImages/image6.jpg';

const recipeDetails = ({ recipe, addToFavorites, closeModal }) => {
  const getImageSource = (imageName) => {
    const imageMap = {
      'image1': image1,
      'image2': image2,
      'image3': image3,
      'image4': image4,
      'image5': image5,
      'image6': image6,
    };
    return imageMap[imageName] || imageMap['default.png'];
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={closeModal}>&times;</span>
        <h2>{recipe.title}</h2>
        <img src={getImageSrc(recipe.imageName)} alt={recipe.title} className="w-50" />
        <p>{recipe.description}</p>
      </div>
    </div>
  )

}