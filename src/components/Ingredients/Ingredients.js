import React, { useCallback, useReducer, useEffect, useMemo } from 'react';
import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';
import Search from './Search';
import useHTTP from '../../hooks/useHttp';

const ingredientsReducer = (currentValue, action) => {
  switch (action.type) {
    case 'SET':
      return action.ingredients;
    case 'DELETE':
      return currentValue.filter(
        (filteredData) => filteredData.id !== action.id,
      );
    case 'ADD':
      return [...currentValue, action.ingredient];
    default:
      throw new Error('Should not het there!');
  }
};

function Ingredients() {
  const [userIngredients, dispatch] = useReducer(ingredientsReducer, []);
  const { isLoading, data, error, sendRequest, reqExtra, identifier, clear } =
    useHTTP();

  useEffect(() => {
    if (!isLoading && !error && identifier === 'REMOVE') {
      dispatch({ type: 'DELETE', id: reqExtra });
    } else if (!isLoading && !error && identifier === 'ADD') {
      dispatch({
        type: 'ADD',
        ingredient: { id: data.name, ...reqExtra },
      });
    }
  }, [data, reqExtra, isLoading, error, identifier]);

  const searchHandler = useCallback((filteredIngredients) => {
    dispatch({ type: 'SET', ingredients: filteredIngredients });
  }, []);

  const inputDatasHandler = useCallback(
    (datas) => {
      console.log(datas);
      sendRequest(
        'https://react-http-dc30f-default-rtdb.europe-west1.firebasedatabase.app/ingredients.json',
        'POST',
        datas,
        datas,
        'ADD',
      );
    },
    [sendRequest],
  );
  // dispatchHttpState({ type: 'SEND' });
  // axios
  //   .post(
  //     'https://react-http-dc30f-default-rtdb.europe-west1.firebasedatabase.app/ingredients.json',
  //     JSON.stringify(datas),
  //     { headers: { 'Content-Type': 'application/json' } },
  //   )
  //   .then(successfulResponse, unSuccesfullResponse);
  // function successfulResponse(response) {
  //   dispatchHttpState({ type: 'RESPONSE' });
  //   dispatch({
  //     type: 'ADD',
  //     ingredient: { ...datas, id: response.data.name },
  //   });
  // }
  // function unSuccesfullResponse(error) {
  //   dispatchHttpState({ type: 'ERROR', errorMessage: error.message });
  //   console.log(error.message);
  // }

  const removeHandler = useCallback(
    (id) => {
      sendRequest(
        `https://react-http-dc30f-default-rtdb.europe-west1.firebasedatabase.app/ingredients/${id}.json/`,
        'DELETE',
        null,
        id,
        'REMOVE',
      );
    },
    [sendRequest],
  );

  //   dispatchHttpState({ type: 'SEND' });
  //   axios
  //     .delete(
  //       `https://react-http-dc30f-default-rtdb.europe-west1.firebasedatabase.app/ingredients/${id}.json/`,
  //     )
  //     .then(successfulResponse, unSuccesfullResponse);

  //   function successfulResponse(response) {
  //     dispatchHttpState({ type: 'RESPONSE' });
  //     console.log(response);
  //   }
  //   function unSuccesfullResponse(error) {
  //     dispatchHttpState({ type: 'ERROR', errorMessage: error.message });
  //     console.log(error.message);
  //   }

  const ingredientList = useMemo(() => {
    return (
      <IngredientList
        ingredients={userIngredients}
        onRemoveItem={removeHandler}
      />
    );
  }, [userIngredients, removeHandler]);

  return (
    <div className='App'>
      {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}

      <IngredientForm onInputDatas={inputDatasHandler} loading={isLoading} />

      <section>
        <Search onFilteredData={searchHandler} />
        {ingredientList}
      </section>
    </div>
  );
}

export default Ingredients;
