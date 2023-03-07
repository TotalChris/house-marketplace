import React, {useState} from 'react';
import {Link, useNavigate} from "react-router-dom";
import {ReactComponent as ArrowRightIcon} from '../assets/svg/keyboardArrowRightIcon.svg'
import {getAuth, signInWithEmailAndPassword} from "firebase/auth";
import visibilityIcon from '../assets/svg/visibilityIcon.svg'
import {toast} from "react-toastify";
import OAuth from "../components/OAuth";

const Signin = () => {

    const [showPass, setShowPass] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    })
    const {email, password} = formData;

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
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            if (userCredential.user) {
                toast.success("Welcome back, " + userCredential.user.displayName + "!")
                navigate('/');
            }
        } catch (err) {
            toast.error('An error occurred.')
        }
    }

    return (
        <>
            <div className="pageContainer">
                <header>
                    <p className="pageHeader">Welcome Back!</p>
                </header>

                <main>
                    <form onSubmit={onSubmit}>
                        <input type="email" id="email" className="emailInput" placeholder="Email" value={email} onChange={onChange}/>
                        <div className="passwordInputDiv">
                            <input type={showPass ? 'text' : 'password'} id="password" className="passwordInput" placeholder="Password" value={password} onChange={onChange}/>
                            <img src={visibilityIcon} alt="show password" className="showPassword" onClick={() => setShowPass((prevState) => !prevState)}/>
                        </div>

                        <Link className="forgotPasswordLink" to='/forgot'>Forgot Password</Link>

                        <div className="signInBar">
                            <p className="signInText">
                                Sign In
                            </p>
                            <button className='signInButton'>
                                <ArrowRightIcon fill='#ffffff' width="34px" height="34px"></ArrowRightIcon>
                            </button>
                        </div>
                    </form>

                    <OAuth></OAuth>

                    <Link to='/sign-up' className='registerLink'>Sign Up Instead</Link>
                </main>
            </div>
        </>
    );
};

export default Signin;