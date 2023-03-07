import React, {useEffect, useState} from 'react';
import {getAuth, updateProfile} from "firebase/auth";
import {Link, useNavigate} from "react-router-dom";
import {db} from '../firebase.config'
import {doc, updateDoc, collection, getDocs, query, orderBy, where, deleteDoc} from 'firebase/firestore';
import {toast} from "react-toastify";
import arrowRight from '../assets/svg/keyboardArrowRightIcon.svg';
import homeIcon from '../assets/svg/homeIcon.svg'
import ListingItem from "../components/ListingItem";
import Spinner from "../components/Spinner";

const Profile = () => {

    const [editingProfile, setEditingProfile] = useState(false);
    const [loading, setLoading] = useState(true);
    const [userListings, setUserListings] = useState([])
    const navigate = useNavigate();
    const auth = getAuth();
    const [formData, setFormData] = useState({
        name: auth.currentUser.displayName,
        email: auth.currentUser.email,
    })
    const { name, email } = formData;

    useEffect(() => {
        const fetchUserListings = async () => {
            const listingsRef = collection(db, 'listings');
            const listingsQuery = query(listingsRef, where('userRef', '==', auth.currentUser.uid), orderBy('timestamp', 'desc'));
            const listingsSnap = await getDocs(listingsQuery);

            let listingsResults = [];

            listingsSnap.forEach((l) => {
                return listingsResults.push({
                    id: l.id,
                    data: l.data(),
                })
            })

            setUserListings(listingsResults);
            setLoading(false);
        }

        fetchUserListings();

    }, [auth.currentUser.uid])

    const onLogOut = () => {
        auth.signOut();
        navigate('/sign-in');
    }

    const onDelete = async (id) => {
        if(window.confirm('Are you sure you want to delete your listing? This cannot be undone.')){
            await deleteDoc(doc(db, 'listings', id));
            const updatedListings = userListings.filter((l) => l.id !== id);
            setUserListings(updatedListings);
            toast.success('Successfully removed listing')
        }
    }

    const onEdit = (id) => {
        navigate(`/edit/${id}`);
    }

    const onSubmit = async () => {
        try {
            if(auth.currentUser.displayName !== name){
                await updateProfile(auth.currentUser, {
                    displayName: name
                });

                const userRef = doc(db, 'users', auth.currentUser.uid);
                await updateDoc(userRef, {name});
            }
        } catch (err) {
            toast.error("There was an error updating your info")
        }
    }

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.id]: e.target.value,
        }))
    }

    if(loading){
        return <Spinner />
    }

    return <div className="profile">
        <header className="profileHeader">

            <p className="pageHeader">My Profile</p>
            <button className="logOut" type="button" onClick={onLogOut}>Log Out</button>
        </header>

        <main>
            <div className="profileDetailsHeader">
                <p className="profileDetailsText">Profile Details</p>
                <p className="changePersonalDetails" onClick={() => {
                    editingProfile && onSubmit();
                    setEditingProfile((prevState) => !prevState);
                }}>
                    {editingProfile ? 'done' : 'change'}
                </p>
            </div>
            <div className="profileCard">
                <form>
                    <input type="text" id="name" className={(!editingProfile ? 'profileName' : 'profileNameActive')} disabled={!editingProfile} value={name} onChange={onChange}/>
                    <input type="text" id="email" className='profileEmail' disabled={true} value={email} onChange={onChange}/>

                </form>
            </div>
            <Link to='/create-listing' className='createListing'>
                <img src={homeIcon} alt="home"/>
                <p>Sell or Rent your home</p>
                <img src={arrowRight} alt="arrow right"/>
            </Link>

            <p className="profileDetailsText">Your Listings</p>
            {(userListings.length > 0 ?
                userListings.map(({data, id}) => {
                    return <ListingItem listing={data} id={id} onDelete={onDelete} onEdit={onEdit} key={id}/>
                }) :
                <p>No Listings</p>
            )}

        </main>
    </div>
};

export default Profile;