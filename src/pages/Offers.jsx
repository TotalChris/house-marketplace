import React from 'react';
import {useEffect, useState} from "react";
import {collection, getDocs, query, where, orderBy, limit, startAfter} from 'firebase/firestore'
import {db} from '../firebase.config'
import {toast} from "react-toastify";
import Spinner from "../components/Spinner";
import ListingItem from "../components/ListingItem";

const Offers = () => {

    const [listings, setListings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [lastFetchedListing, setLastFetchedListing] = useState(null);

    useEffect(() => {
        const fetchListings = async () => {
            try {
                //set data reference
                const listingsRef = collection(db, 'listings');

                //create a query
                const q = query(listingsRef, where('offers', '==', true), orderBy('timestamp', 'desc'), limit(10));

                //execute query snapshot
                const qSnap = await getDocs(q);

                setLastFetchedListing(qSnap.docs[qSnap.docs.length - 1]);

                const listings = []

                qSnap.forEach((doc) => {
                    return listings.push({
                        id: doc.id,
                        data: doc.data(),
                    });
                })

                setListings(listings);
                setLoading(false)
            } catch (e) {
                console.log(e)
                toast.error('An error occurred fetching listings');
            }
        }

        fetchListings();
    }, []);

    const onFetchMoreListings = async () => {
        try {
            //set data reference
            const listingsRef = collection(db, 'listings');

            //create a query
            const q = query(listingsRef, where('offers', '==', true), orderBy('timestamp', 'desc'), startAfter(lastFetchedListing), limit(10));

            //execute query snapshot
            const qSnap = await getDocs(q);

            setLastFetchedListing(qSnap.docs[qSnap.docs.length - 1]);

            const listings = []

            qSnap.forEach((doc) => {
                return listings.push({
                    id: doc.id,
                    data: doc.data(),
                });
            })

            setListings((prevState) => {
                return [...prevState, ...listings]
            });
            setLoading(false)
        } catch (e) {
            toast.error('An error occurred fetching listings');
        }
    }


    return (
        <div className='category'>
            <header>
                <p className="pageHeader">Offers</p>
            </header>
            {loading ? <Spinner /> : (listings && listings.length > 0 ? <>
                <main>
                    <ul className="categoryListings">
                        {listings.map((listing) => {
                            return <ListingItem listing={listing.data} id={listing.id} key={listing.id} />
                        })}
                    </ul>
                </main>
                <br/>
                <br/>
                {lastFetchedListing && (
                    <p className="loadMore" onClick={onFetchMoreListings}>Load More</p>
                )}
            </> : <p>No current offers available.</p>)}
        </div>

    );
};
export default Offers;