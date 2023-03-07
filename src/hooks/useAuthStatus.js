import {useEffect, useState} from "react";
import {getAuth, onAuthStateChanged} from "firebase/auth";

export const useAuthStatus = () => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [checkingStatus, setCheckingStatus] = useState(true);

    useEffect(() => {
        console.log('creating auth object...')
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            console.log('checking auth status...')
            if(user){
                console.log('logged in')
                setLoggedIn(true);
            } else {
                console.log('not logged in')
                setLoggedIn(false);
            }
            console.log('done checking')
            setCheckingStatus(false);
        })
    }, []);

    return {loggedIn, checkingStatus}
}