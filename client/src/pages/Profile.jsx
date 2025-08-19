import React, {useState, useEffect} from 'react';
import { useQuery } from '@apollo/client';
import { GET_USER_CREATED, GET_USER_INTERESTED, GET_USER_DONATED } from '../utils/queries';
import jwt_decode from 'jwt-decode';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import AuthService from '../utils/auth';
import './Profile.css';
import image1 from '../projImages/image1.jpg';
import image2 from '../projImages/image2.jpg';
import image3 from '../projImages/image3.svg';
import image4 from '../projImages/image4.png';
import image5 from '../projImages/image5.jpg';
import image6 from '../projImages/image6.jpg';

const Profile = () => {

  const getImageSource = (imageName) => {
      const imageMap = {
        'image1': image1,
        'image2': image2,
        'image3': image3,
        'image4': image4,
        'image5': image5,
        'image6': image6,
      };
      return imageMap[imageName] || imageMap['default.png']; // Fallback to a default image if not found
    };

    const userId = AuthService.loggedIn() ? AuthService.getProfile().data._id : null;

    const [username, setUsername] = useState('');
    const [createdRecipes, setCreatedRecipes] = useState([]);
    const [interestedRecipes, setInterestedRecipes] = useState([]);
    
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
        const { getCreatedRecipes } = data1;
        const { getInterestedIn } = data2;

        setCreatedRecipes(getCreatedRecipes);
        setInterestedRecipes(getInterestedIn);
      }
    }, [data1, data2]);

    const loading = loadingCreated || loadingInterested;

    if (loading) {
      return <p>Loading...</p>
    }

    return (
      <div className="pa4">
        <header>
          <p><h3>These are the recipes you have created, or are interested in:</h3></p>
        </header>

      {/* Recipes Created */}
      <section>
        <h2>Recipes Created</h2>
        <line />
        <div className="recipe-cards">
          {createdRecipes.map((recipe, index) => (
            <div key={index} className="project-card shadow-5">
              <img src={getImageSource(recipe.imageName)} alt={getImageSource(recipe.imageName)} className='shadow-5' />
              <h3>{recipe.title}</h3>
              <p>{recipe.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Recipes Interested In */}
      <section>
        <h2>Recipes Interested In</h2>
        <div className="recipe-cards"></div>
        {interestedRecipes.map((recipe, index) => {
          <div key={index} className="project-card shadow-5">
              <img src={getImageSource(recipe.imageName)} alt={getImageSource(recipe.imageName)} className='shadow-5' />
              <h3>{recipe.title}</h3>
              <p>{recipe.description}</p>
            </div>
        })}
      </section>

      </div>
    );   
};

export default Profile;