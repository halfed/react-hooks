import React, { useState, useEffect, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';

import Search from './Search';

function Ingredients() {
  const [userIngredients, setUserIngredients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  //TAKING THIS OUT DUE TO REDUNDANT CALL, WE ARE CALLING INGREDIENTS
  //IN SEARCH.JS
  /*useEffect(() => {
    fetch('https://react-hooks-update-9eb04.firebaseio.com/ingredients.json')
      .then(response => response.json())
      .then(responseData => {
        const loadedIngredients = [];
        for (const key in responseData) {
          loadedIngredients.push({
            id: key,
            title: responseData[key].title,
            amount: responseData[key].amount
          });
        }
        setUserIngredients(loadedIngredients);
      });
  }, []);*/

  useEffect(() => {
    console.log('RENDERING: INGREDIENTS', userIngredients);
  }, [userIngredients]); 

  const filteredIngredientsHandler = useCallback(filteredIngredients => {
    setUserIngredients(filteredIngredients);
  }, [])

  const addIngredientHandler = ingredient => {
    setIsLoading(true);
    fetch('https://react-hooks-update-9eb04.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: { 'Content-type': 'application/json' }
    }).then(response => {
      setIsLoading(false);
      return response.json();
    }).then(responseData => {
      setUserIngredients(prevIngredients => [
        ...prevIngredients,
        { id: responseData.name, ...ingredient }
      ]);
    });
  };

  const removeIngredientHandler = ingredientId => {
    setIsLoading(true);
    fetch(`https://react-hooks-update-9eb04.firebaseio.com/ingredients/${ingredientId}.jon`, {
      method: 'DELETE'
    }).then(response => {
      setIsLoading(false);
      setUserIngredients(prevIngredients =>
        prevIngredients.filter(ingredient => ingredient.id !== ingredientId)
      );
    }).catch(error => {
      setError("Something Went Wrong!");
    });
    
  }
  
  const clearError = () => {
    setError(null);
    setIsLoading(false);
  }

  return (
    <div className="App">
      {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}
      <IngredientForm onAddIngredient={addIngredientHandler} loading={isLoading} />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        {/* Need to add list here! */}
        <IngredientList ingredients={userIngredients} onRemoveItem={removeIngredientHandler}/>
      </section>
    </div>
  );
}

export default Ingredients;
