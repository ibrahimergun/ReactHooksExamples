import axios from 'axios';
import { useReducer, useCallback } from 'react';

const httpReducer = (prevValue, action) => {
  switch (action.type) {
    case 'SEND':
      return {
        loading: true,
        error: null,
        data: null,
        extra: null,
        identifier: action.identifier,
      };
    case 'ERROR':
      return { ...prevValue, error: action.errorMessage };
    case 'CLEAR':
      return {
        loading: false,
        error: null,
        data: null,
        extra: null,
        identifier: null,
      };
    case 'RESPONSE':
      return {
        ...prevValue,
        loading: false,
        data: action.responseData,
        extra: action.extra,
      };
    default:
      throw new Error('Should not het there!');
  }
};

const useHTTP = () => {
  const [httpState, dispatchHttpState] = useReducer(httpReducer, {
    loading: false,
    error: null,
    data: null,
    extra: null,
    identifier: null,
  });

  const sendRequest = useCallback(
    (url, method, data, reqExtra, reqIdentifier) => {
      dispatchHttpState({ type: 'SEND', identifier: reqIdentifier });
      axios(url, {
        method: method,
        data: data,
        headers: { 'Content-Type': 'application/json' },
      }).then(successfulResponse, unSuccesfullResponse);

      function successfulResponse(response) {
        dispatchHttpState({
          type: 'RESPONSE',
          responseData: response.data,
          extra: reqExtra,
          identifier: reqIdentifier,
        });
        console.log(response.data);
      }
      function unSuccesfullResponse(error) {
        dispatchHttpState({ type: 'ERROR', errorMessage: error.message });
        console.log(error);
      }
    },
    [],
  );
  const clear = useCallback(() => {
    dispatchHttpState({ type: 'CLEAR' });
  }, []);

  return {
    isLoading: httpState.loading,
    data: httpState.data,
    error: httpState.error,
    sendRequest: sendRequest,
    reqExtra: httpState.extra,
    identifier: httpState.identifier,
    clear: clear,
  };
};

export default useHTTP;
