import React, {useState, useEffect, useRef} from 'react';
import {getAuth, onAuthStateChanged} from "firebase/auth";
import {addDoc, collection, serverTimestamp} from 'firebase/firestore'
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {useNavigate} from "react-router-dom";
import Spinner from "../components/Spinner";
import {toast} from "react-toastify";
import {db} from "../firebase.config";


const CreateListing = () => {

    const [loading, setLoading] = useState(false);
    const storage = getStorage();

    const [formData, setFormData] = useState({
        type: 'rent',
        name: '',
        bedrooms: 1,
        bathrooms: 1,
        parking: false,
        furnished: false,
        address: '',
        offers: false,
        regularPrice: 0,
        discountedPrice: 0,
        images: {},
        imageUrls: [],
    });

    const {
        type,
        name,
        bedrooms,
        bathrooms,
        parking,
        furnished,
        address,
        offers,
        regularPrice,
        discountedPrice,
        images,
        imageUrls,
    } = formData

    const auth = getAuth();
    const navigate = useNavigate();
    const isMounted = useRef(true);

    useEffect(() => {
        if (isMounted) {
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    setFormData((prevState) => {
                        return {
                            ...prevState,
                            userRef: user.uid
                        }
                    })
                } else {
                    navigate('/sign-in')
                }
            })
        }
        return () => {
            isMounted.current = false;
        }
    }, [isMounted, auth, navigate]);


    if (loading) {
        return <Spinner></Spinner>
    }

    const onSubmit = async (e) => {
        e.preventDefault()
        setLoading(true);

        if(discountedPrice >= regularPrice){
            toast.error('Offer price cannot be greater or equal to regular price');
            setLoading(false);
            return;
        }

        if(images.length > 6){
            toast.error('Please add no more than 6 images');
            setLoading(false);
            return;
        }

        try {
            for (const image of [...images]) {
                const snapshot = await uploadBytes(ref(storage, crypto.randomUUID()), image)
                const downloadUrl = await getDownloadURL(snapshot.ref);
                imageUrls.push(downloadUrl);
            }

            const formDataClone = {
                ...formData,
                timestamp: serverTimestamp(),
            }
            delete formDataClone.images;
            console.log(formDataClone.longitude, formDataClone.latitude)
            const newListingRef = await addDoc(collection(db, 'listings'), formDataClone);
            setLoading(false)
            navigate(`/category/${type}/${newListingRef.id}`);
        } catch (e) {
            toast.error('There was an error uploading your selected images.');
            console.log(e);
            return;
        }
    }

    const onMutate = (e) => {

        let boolVal = null;
        let intVal = null;

        if(e.target.value === 'true'){
            boolVal = true;
        }

        if(e.target.value === 'false'){
            boolVal = false;
        }

        if(parseInt(e.target.value) > 0 && e.target.id !== 'address' && e.target.id !== 'name'){
            intVal = parseInt(e.target.value);
        }

        //files to upload
        if(e.target.files) {
            setFormData((prevState) => {
                return {
                    ...prevState,
                    images: e.target.files,
                }
            })
        }

        //text, booleans, numbers
        if(!e.target.files) {
            setFormData((prevState) => {
                return {
                    ...prevState,
                    [e.target.id]: boolVal ?? (intVal ?? e.target.value),
                }
            })
        }


    }

    return (
        <div className='profile'>
            <header>
                <p className='pageHeader'>Create a Listing</p>
            </header>

            <main>
                <form onSubmit={onSubmit}>
                    <label className='formLabel'>Sell / Rent</label>
                    <div className='formButtons'>
                        <button
                            type='button'
                            className={type === 'sale' ? 'formButtonActive' : 'formButton'}
                            id='type'
                            value='sale'
                            onClick={onMutate}
                        >
                            Sell
                        </button>
                        <button
                            type='button'
                            className={type === 'rent' ? 'formButtonActive' : 'formButton'}
                            id='type'
                            value='rent'
                            onClick={onMutate}
                        >
                            Rent
                        </button>
                    </div>

                    <label className='formLabel'>Name</label>
                    <input
                        className='formInputName'
                        type='text'
                        id='name'
                        value={name}
                        onChange={onMutate}
                        maxLength='32'
                        minLength='10'
                        required
                    />

                    <div className='formRooms flex'>
                        <div>
                            <label className='formLabel'>Bedrooms</label>
                            <input
                                className='formInputSmall'
                                type='number'
                                id='bedrooms'
                                value={bedrooms}
                                onChange={onMutate}
                                min='1'
                                max='50'
                                required
                            />
                        </div>
                        <div>
                            <label className='formLabel'>Bathrooms</label>
                            <input
                                className='formInputSmall'
                                type='number'
                                id='bathrooms'
                                value={bathrooms}
                                onChange={onMutate}
                                min='1'
                                max='50'
                                required
                            />
                        </div>
                    </div>

                    <label className='formLabel'>Parking spot</label>
                    <div className='formButtons'>
                        <button
                            className={parking ? 'formButtonActive' : 'formButton'}
                            type='button'
                            id='parking'
                            value={true}
                            onClick={onMutate}
                            min='1'
                            max='50'
                        >
                            Yes
                        </button>
                        <button
                            className={
                                !parking && parking !== null ? 'formButtonActive' : 'formButton'
                            }
                            type='button'
                            id='parking'
                            value={false}
                            onClick={onMutate}
                        >
                            No
                        </button>
                    </div>

                    <label className='formLabel'>Furnished</label>
                    <div className='formButtons'>
                        <button
                            className={furnished ? 'formButtonActive' : 'formButton'}
                            type='button'
                            id='furnished'
                            value={true}
                            onClick={onMutate}
                        >
                            Yes
                        </button>
                        <button
                            className={
                                !furnished && furnished !== null
                                    ? 'formButtonActive'
                                    : 'formButton'
                            }
                            type='button'
                            id='furnished'
                            value={false}
                            onClick={onMutate}
                        >
                            No
                        </button>
                    </div>

                    <label className='formLabel'>Address</label>
                    <textarea
                        className='formInputAddress'
                        type='text'
                        id='address'
                        value={address}
                        onChange={onMutate}
                        required
                    />

                    <label className='formLabel'>Offer</label>
                    <div className='formButtons'>
                        <button
                            className={offers ? 'formButtonActive' : 'formButton'}
                            type='button'
                            id='offers'
                            value={true}
                            onClick={onMutate}
                        >
                            Yes
                        </button>
                        <button
                            className={
                                !offers && offers !== null ? 'formButtonActive' : 'formButton'
                            }
                            type='button'
                            id='offers'
                            value={false}
                            onClick={onMutate}
                        >
                            No
                        </button>
                    </div>

                    <label className='formLabel'>Regular Price</label>
                    <div className='formPriceDiv'>
                        <input
                            className='formInputSmall'
                            type='number'
                            id='regularPrice'
                            value={regularPrice}
                            onChange={onMutate}
                            min='50'
                            max='750000000'
                            required
                        />
                        {type === 'rent' && <p className='formPriceText'>$ / Month</p>}
                    </div>

                    {offers && (
                        <>
                            <label className='formLabel'>Discounted Price</label>
                            <input
                                className='formInputSmall'
                                type='number'
                                id='discountedPrice'
                                value={discountedPrice}
                                onChange={onMutate}
                                min='50'
                                max='750000000'
                                required={offers}
                            />
                        </>
                    )}

                    <label className='formLabel'>Images</label>
                    <p className='imagesInfo'>
                        The first image will be the cover (max 6).
                    </p>
                    <input
                        className='formInputFile'
                        type='file'
                        id='images'
                        onChange={onMutate}
                        max='6'
                        accept='.jpg,.png,.jpeg'
                        multiple
                        required
                    />
                    <button type='submit' className='primaryButton createListingButton'>
                        Create Listing
                    </button>
                </form>
            </main>
        </div>

    );
};

export default CreateListing;