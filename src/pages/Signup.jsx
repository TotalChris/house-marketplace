import React, {useState} from 'react';
import {Link, useNavigate} from "react-router-dom";
import {ReactComponent as ArrowRightIcon} from '../assets/svg/keyboardArrowRightIcon.svg'
import visibilityIcon from '../assets/svg/visibilityIcon.svg'
import {getAuth, createUserWithEmailAndPassword, updateProfile} from 'firebase/auth';
import {setDoc, doc, serverTimestamp} from 'firebase/firestore'
import {db} from '../firebase.config'
import {toast} from "react-toastify";


const Signup = () => {

    const [showPass, setShowPass] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    })
    const {name, email, password} = formData;

    const navigate = useNavigate();

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.id]: e.target.value,
        }))
    }

    const onSubmit = async (e) => {
        e.preventDefault();

        try {
            const auth = getAuth();
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            await updateProfile(auth.currentUser, {
                displayName: name,
            })

            const formDataClone = {...formData};
            delete formDataClone.password
            formDataClone.timestamp = serverTimestamp();
            await setDoc(doc(db, 'users', user.uid), formDataClone);

            toast.success("Welcome, " + user.displayName + "!")
            navigate('/');
        } catch (e) {
            toast.error('An error occurred.')
        }
    }

    return (
        <>
            <div className="pageContainer">
                <header>
                    <p className="pageHeader">Hello!</p>
                </header>

                <main>
                    <form onSubmit={onSubmit}>
                        <input type="text" id="name" className="nameInput" placeholder="Name" value={name} onChange={onChange}/>
                        <input type="email" id="email" className="emailInput" placeholder="Email" value={email} onChange={onChange}/>
                        <div className="passwordInputDiv">
                            <input type={showPass ? 'text' : 'password'} id="password" className="passwordInput" placeholder="Password" value={password} onChange={onChange}/>
                            <img src={visibilityIcon} alt="show password" className="showPassword" onClick={() => setShowPass((prevState) => !prevState)}/>
                        </div>

                        <div className="signUpBar">
                            <p className="signUpText">
                                Sign Up
                            </p>
                            <button className='signUpButton'>
                                <ArrowRightIcon fill='#ffffff' width="34px" height="34px"></ArrowRightIcon>
                            </button>
                        </div>
                    </form>

                    {/*Google OAuth*/}

                    <Link to='/sign-in' className='registerLink'>Sign In Instead</Link>
                </main>
            </div>
        </>
    );
};

export default Signup;