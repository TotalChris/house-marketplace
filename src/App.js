import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import {ToastContainer, Slide} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'
import PrivateRoute from "./components/PrivateRoute";
import Explore from "./pages/Explore";
import Offers from "./pages/Offers";
import Profile from "./pages/Profile";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import Navbar from "./components/Navbar";
import Category from "./pages/Category";
import CreateListing from "./pages/CreateListing";
import Listing from "./pages/Listing";
import NotFound from "./pages/NotFound";
import Contact from "./pages/Contact";
import EditListing from "./pages/EditListing";
function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Explore />} />
          <Route path="/offers" element={<Offers />} />
          <Route path="/category/:categoryName" element={<Category />} />
          <Route path="/category/:categoryName/:listingId" element={<Listing />} />
          <Route path="/profile" element={<PrivateRoute />}>
            <Route path="/profile" element={<Profile />} />
          </Route>
          <Route path="/sign-in" element={<Signin />} />
          <Route path="/sign-up" element={<Signup />} />
          <Route path="/forgot" element={<ForgotPassword />} />
          <Route path="/not-found" element={<NotFound />} />
          <Route path='/create-listing' element={<CreateListing />} />
          <Route path='/contact/:sellerId' element={<Contact />} />
          <Route path='/edit/:listingId' element={<EditListing />} />
        </Routes>
        <Navbar/>
      </Router>
    <ToastContainer autoClose={3000} position={"top-center"} theme={"colored"} transition={Slide}/>
    </>
  );
}

export default App;
