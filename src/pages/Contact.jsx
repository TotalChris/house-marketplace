import React from 'react';
import {useState, useEffect} from "react";
import {useParams, useSearchParams} from "react-router-dom";
import {doc, getDoc} from "firebase/firestore";
import {db} from "../firebase.config";
import {toast} from 'react-toastify'

const Contact = () => {

    const params = useParams();

    const [message, setMessage] = useState('');
    const [seller, setSeller] = useState(null);
    const [searchParams] = useSearchParams();

    useEffect(() => {
         const getSeller = async () => {
             const docRef = doc(db, 'users', params.sellerId);
             const docSnap = await getDoc(docRef);
             if(docSnap.exists()){
                 setSeller(docSnap.data());
             } else {
                 toast.error('Could not retrieve seller info. User may have deactivated their account.')
             }
         }

         getSeller();
    }, [params.sellerId])

    const onchange = (e) => {
        setMessage(e.target.value);
    }

    return (
        <div className='pageContainer'>
            <header>
                <p className='pageHeader'>Contact Seller</p>
            </header>
            {seller !== null && (
                <main>
                    <div className="contactLandlord">
                        <p className="landlordName">Contact {seller?.name}</p>

                    </div>
                    <form className="messageForm">
                        <div className="messageDiv">
                            <label htmlFor="message" className="messageLabel"></label>
                            <textarea name="message" id="message" className="textarea" value={message} onChange={onchange}></textarea>
                        </div>
                        <a href={`mailto:${seller.email}?Subject=${searchParams.get('listingName')}&body=${message}`}>
                            <button className="primaryButton" type='button'>Send Message</button>
                        </a>
                    </form>
                </main>
            )}

        </div>
    );
};

export default Contact;