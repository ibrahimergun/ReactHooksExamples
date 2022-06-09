import React, { useContext } from 'react';
import Auth from './components/Auth';
import { AuthContext } from './context/auth-context';
import Ingredients from './components/Ingredients/Ingredients';

const App = (props) => {
  const ctxContext = useContext(AuthContext);

  let content = <Auth />;

  if (ctxContext.isAuth) {
    content = <Ingredients />;
  }

  return content;
};

export default App;
