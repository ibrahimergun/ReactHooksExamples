import React, { createContext, useState } from 'react';

 export const AuthContext = createContext({
  isAuth: false,
  login: () => {},
});

 const AuthContextProvider = (props) => {
  const [isAutenticated, setIsAutenticated] = useState(false);

  const loginHandler = () => {
    setIsAutenticated(true);
  };

  const contextValue = {
    isAuth: isAutenticated,
    login: loginHandler,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
  //
};

export default AuthContextProvider;
