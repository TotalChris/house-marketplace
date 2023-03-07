import React from 'react';
import {Link} from "react-router-dom";
import {ReactComponent as ArrowRightIcon} from '../assets/svg/keyboardArrowRightIcon.svg'

const NotFound = () => {
    return (
        <div className="pageContainer">
            <header>
                <p className="pageHeader">Whoops! We couldn't triangulate that.</p>
            </header>
            <main>
                <p>Let's bring it home...</p>
                <Link to='/' >
                    <p className='weightedLink'>Return Home <ArrowRightIcon fill='#00cc66' height='32px' width='32px'/></p>

                </Link>
            </main>
        </div>
    );
};

export default NotFound;