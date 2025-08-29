import React, { useEffect, useMemo } from 'react';
import './Home.css';

import image1 from '../projectImages/image1.jpg';
import image2 from '../projectImages/image2.jpg';
import image3 from '../projectImages/image3.jpg';
import image4 from '../projectImages/image4.jpg';
import image5 from '../projectImages/image5.jpg';
import image6 from '../projectImages/image6.jpeg';
import image7 from '../projectImages/image7.jpg';

const imgMap = { image1, image2, image3, image4, image5, image6, image7 };

function parseToList(str = '') {
  // Accept either newline-separated or "- " bullet lines
  return str
    .split('\n')
    .map(s => s.trim().replace(/^-\s*/, ''))
    .filter(Boolean);
}

const RecipeDetails = ({ recipe, closeModal }) => {
  const src = imgMap[recipe?.imageName] || imgMap.image1;

  const ingredients = useMemo(() => parseToList(recipe?.ingredients), [recipe]);
  const instructions = useMemo(() => parseToList(recipe?.instructions), [recipe]);

  // Close on ESC and lock page scroll while open
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && closeModal();
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [closeModal]);

  return (
    <div className="modal-backdrop" onClick={closeModal} role="dialog" aria-modal="true">
      <div
        className="modal-panel"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="modal-header">
          <h3 className="modal-title">{recipe?.title}</h3>
          <button
            aria-label="Close"
            className="modal-close"
            onClick={closeModal}
          >
            ×
          </button>
        </header>

        <div className="modal-content">
          <figure className="modal-media">
            <img src={src} alt={recipe?.title} />
          </figure>

          <section className="modal-body">
            {recipe?.description && (
              <p className="modal-description">{recipe.description}</p>
            )}

            {!!ingredients.length && (
              <>
                <h4 className="modal-subtitle">Ingredients</h4>
                <ul className="bullet-list">
                  {ingredients.map((line, i) => (
                    <li key={i}>{line}</li>
                  ))}
                </ul>
              </>
            )}

            {!!instructions.length && (
              <>
                <h4 className="modal-subtitle">Instructions</h4>
                <ol className="number-list">
                  {instructions.map((line, i) => (
                    <li key={i}>{line}</li>
                  ))}
                </ol>
              </>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetails;