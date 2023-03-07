import React from 'react';
import {useLocation, useNavigate} from "react-router-dom";
import {getAuth, signInWithPopup, GoogleAuthProvider} from "firebase/auth";
import {doc, setDoc, getDoc, serverTimestamp} from "firebase/firestore";
import {db} from '../firebase.config'
import {toast} from "react-toastify";
import googleIcon from '../assets/svg/googleIcon.svg'
import appleIcon from '../assets/svg/appleIcon.svg'

const OAuth = () => {

    const navigate = useNavigate();
    const location = useLocation();


    const onGoogleClick = async () => {
        try {
            const auth = getAuth();
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            const docRef = doc(db, 'users', user.uid);
            const docSnapshot = await getDoc(docRef);
            let newUser = false;

            if(!docSnapshot.exists()){
                newUser = true;
                await setDoc(doc(db, 'users', user.uid), {
                    name: user.displayName,
                    email: user.email,
                    timestamp: serverTimestamp(),
                });
            }
            toast.success("Welcome" + (newUser ? '' : ' back') + ", " + user.displayName + "!")
            navigate('/');
        } catch (e) {
            toast.error('There was an error authenticating your Google Account.')
        }
    }

    return (
     <div className="socialLogin">
         <button className="socialIconDiv googleOAuth" onClick={onGoogleClick}>
             <img src={googleIcon} alt="google" className='socialIconImg'/>
             <p className='socialIconText googleOAuth'>Sign {location.pathname === '/sign-up' ? 'up' : 'in'} with Google</p>
         </button>
         <button className="socialIconDiv appleOAuth" onClick={() => {}}>
             <img src={appleIcon} alt="apple" className='socialIconImg'/>
             <p className='socialIconText appleOAuth'>Sign {location.pathname === '/sign-up' ? 'up' : 'in'} with Apple</p>
         </button>
     </div>

 );
};

export default OAuth;