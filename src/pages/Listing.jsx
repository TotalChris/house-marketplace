import React, {useEffect, useState} from 'react';
import {Link, useNavigate, useParams} from "react-router-dom";
import {MapContainer, Marker, Popup, TileLayer} from "react-leaflet";
import SwiperCore, {Navigation, Pagination, Scrollbar, A11y} from "swiper";
import {Swiper, SwiperSlide} from "swiper/react";
import 'swiper/css/bundle'
import {getAuth} from "firebase/auth";
import {doc, getDoc} from "firebase/firestore";
import {db} from "../firebase.config";
import Spinner from "../components/Spinner";
import shareIcon from '../assets/svg/shareIcon.svg';
import keyboardArrowRightIcon from '../assets/svg/keyboardArrowRightIcon.svg'
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y])

const Listing = () => {

    const auth = getAuth();
    const params = useParams();
    const navigate = useNavigate();
    const [listingData, setListingData] = useState({});
    const [loading, setLoading] = useState(true);
    const [shareLinkCopied, setShareLinkCopied] = useState(false);
    const [coordinates, setcoordinates] = useState([0,0]);


    useEffect(() => {
        const fetchListing = async (lid) => {
            const listingRef = await getDoc(doc(db, 'listings', lid));
            if(listingRef.exists()){
                setListingData(listingRef.data());

                const geoApiKey = process.env.REACT_APP_GEO_API_KEY
                const geoApiUrl = 'https://api.opencagedata.com/geocode/v1/json';

                const georesponse = await fetch(geoApiUrl + '?key=' + geoApiKey + '&q=' + encodeURIComponent(listingData.address));
                if(georesponse.status !== 200){
                    throw new Error("HTTP Response code " + georesponse.status);
                }
                const geojson = await georesponse.json();

                setcoordinates([geojson.results[0].geometry.lat, geojson.results[0].geometry.lng])

                setLoading(false);
            } else {
                navigate('/not-found')
            }
        }

        fetchListing(params.listingId);
    }, [navigate, params.listingId, listingData.address])

    const {
        type,
        name,
        bedrooms,
        bathrooms,
        parking,
        furnished,
        offers,
        regularPrice,
        discountedPrice,
        imageUrls,
        address,
        userRef
    } = listingData


    window.title = 'House Marketplace | ' + listingData.name;

    return (loading ? <Spinner/> : (
        <main>
            <div className="backIconDiv" onClick={ () => {
                navigate(-1)
            }}>
                <img src={keyboardArrowRightIcon} style={{transform: 'rotate(180deg)'}} alt=""/>
            </div>

            <Swiper slidesPerView={1} pagination={{clickable: true,}} style={{height: '50vh'}}>
                {imageUrls.map((url, idx) => {
                    return <SwiperSlide key={idx}>
                        <div className="swiperSlideDiv" style={{background: `url(${url}) center no-repeat`, backgroundSize: `cover`}}></div>
                    </SwiperSlide>
                })}
            </Swiper>

            <div className="shareIconDiv" onClick={ () => {
                navigator.clipboard.writeText(window.location.href);
                setShareLinkCopied(true);
                setTimeout(() => {
                    setShareLinkCopied(false);
                }, 2000)
            }}>
                <img src={shareIcon} alt=""/>
            </div>
            {(shareLinkCopied && <p className='linkCopied'>Link Copied!</p>)}

            <div className="listingDetails">
                <p className="listingName">
                    {name} -
                    ${offers ? discountedPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : regularPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                </p>
                <p className="listingLocation">{address}</p>
                <p className="listingType">For {type === 'rent' ? 'Rent' : 'Sale'}</p>
                {offers && (
                    <p className="discountPrice">
                        ${(regularPrice - discountedPrice).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} off
                    </p>
                )}
                <ul className="listingDetailsList">
                    <li>
                        {bedrooms > 1 ? `${bedrooms} Bedrooms` : `1 Bedroom`}
                    </li>
                    <li>
                        {bathrooms > 1 ? `${bathrooms} Bathrooms` : `1 Bathroom`}
                    </li>
                    <li>
                        {parking ? 'Parking Available' : 'Parking Unavailable'}
                    </li>
                    <li>
                        {furnished ? 'Pre-Furnished' : 'Unfurnished'}
                    </li>

                    <p className="listingLocationTitle">Location</p>

                    <div className="leafletContainer">
                        <MapContainer style={{height: '100%', width: '100%'}} center={coordinates} zoom={13} scrollWheelZoom={false}>
                            <TileLayer
                                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                url='https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png'
                            />

                            <Marker
                                position={coordinates}
                            >
                                <Popup>{address}</Popup>
                            </Marker>
                        </MapContainer>
                    </div>

                    {auth.currentUser?.uid !== userRef && (<Link to={`/contact/${userRef}?listingName=${name}`} className='primaryButton'>
                        Contact Seller
                    </Link>)}
                </ul>
            </div>
        </main>
    ));
};

export default Listing;