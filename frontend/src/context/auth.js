import { useHistory } from "react-router-dom";

const { createContext, useState, useEffect } = require("react");

export const authContext = createContext();

const AuthProvider = ({ children }) => {

    const [token, setToken] = useState(localStorage.getItem('token'))
    const history = useHistory();

    useEffect(() => {
        if(!token){
            history.push("/")
        }

    }, [history, token]);

    return (
        <authContext.Provider value = {{token, setToken}}>
            {children}
        </authContext.Provider>
    )
}

export default AuthProvider;