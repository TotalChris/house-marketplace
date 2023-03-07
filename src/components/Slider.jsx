import React, {useState, useEffect} from 'react';
import {useNavigate} from "react-router-dom";
import {collection, getDocs, query, orderBy, limit} from "firebase/firestore";
import {db} from "../firebase.config";
import SwiperCore, {Navigation, Pagination, Scrollbar, A11y, Parallax} from "swiper";
import {Swiper, SwiperSlide} from "swiper/react";
import 'swiper/css/bundle'
import Spinner from "./Spinner";
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y, Parallax])

const Slider = () => {
    const [loading, setLoading] = useState(true);
    const [listings, setListings] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchListings = async () => {
            const listingsRef = collection(db, 'listings');
            const listingsQuery = query(listingsRef, orderBy('timestamp', 'desc'), limit(5));
            const listingsSnap = await getDocs(listingsQuery);

            let listings = [];

            listingsSnap.forEach((l) => {
                return listings.push({
                    id: l.id,
                    data: l.data(),
                })
            })

            setListings(listings);
            setLoading(false);
        }

        fetchListings();
    }, [])

    if(!listings || listings.length === 0){
        return <></>
    }

    return (
        (loading ? (
            <Spinner />
        ) : (
            <>
                <p className='exploreHeading'>Recommended</p>
                <Swiper slidesPerView={1} pagination={{clickable: true,}} style={{height: '30vh', borderRadius: '1.5rem', cursor: 'pointer'}}>
                    {listings.map(({data, id}) => {
                        return <SwiperSlide key={id}>
                            <div onClick={() => {navigate(`/category/${data.type}/${id}`)}} className="swiperSlideDiv" style={{background: `url(${data.imageUrls[0]}) center no-repeat`, backgroundSize: `cover`}}>
                                <p className="swiperSlideText">{data.name}</p>
                                <p className="swiperSlidePrice">
                                    ${data.offers
                                    ? data.discountedPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                    : data.regularPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    {data.type === 'rent' && '/mo.'}
                                </p>
                            </div>
                        </SwiperSlide>
                    })}
                </Swiper>
            </>
        ))

    );
};

export default Slider;