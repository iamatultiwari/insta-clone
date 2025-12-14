import React, { createContext, useState } from 'react'

export const LoginContext = createContext(null);

export default function LoginState({children}) {
    
    const [userLogin, setUserLogin] = useState(false);
    const [modalOpen, setModalOpen] = useState(false)
    const [loggedUser, setLoggedUser] = useState(JSON.parse(localStorage.getItem("user")))

  return (
    <LoginContext.Provider value={{userLogin, setUserLogin, modalOpen, setModalOpen, loggedUser, setLoggedUser}}>
        {children}
    </LoginContext.Provider>
  )
}
