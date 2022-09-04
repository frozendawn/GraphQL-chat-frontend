import React, { useState } from 'react';


const defaultCtx = {
  signedIn: false,
  signIn: () => {},
  signOut: () => {},
  user: {
    id: '',
    username: '',
    avatar: '',
  }
}
const UserContext = React.createContext(defaultCtx);

export const UserContextProvider = (props) => {
  const [signedIn, setSignedIn] = useState(false)
  const [user, setUser] = useState({})

  const signIn = (user) => {
    setUser({
      id: user.id,
      username: user.username,
      avatar: user.avatar
    })
    setSignedIn(true);
  }

  const signOut = () => {
    setSignedIn(false);
    setUser({});
  }

  const contextValues = {
    signedIn,
    signIn,
    signOut,
    user
  }
  return (
    <UserContext.Provider value={contextValues}>
      {props.children}
    </UserContext.Provider>
  )
}

export default UserContext;

