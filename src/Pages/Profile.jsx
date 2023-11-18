import { useEffect, useState } from "react";
import { getAuth, updateProfile } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { collection, doc, getDocs, orderBy, query, updateDoc, where, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { FcMoneyTransfer } from 'react-icons/fc';
import ListingItem from "../components/ListingItem";




export default function Profile() {

  const auth = getAuth();
  const navigate = useNavigate();
  const [changeProfile, setChangeProfile] = useState(false);

  const [listings, setListings] = useState(null); 
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });

  const { name, email } = formData;

  function onLogout() {
    auth.signOut();
    navigate("/");
  }

  function onChange(e) {
    setFormData ((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  }

  // update Firestore
  async function onSubmit() {
    try {
      if(auth.currentUser.displayName !== name) {
        await updateProfile(auth.currentUser, {
          displayName: name,
        });
        const docRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(docRef, {
          name,
        })        
      }
      toast.success("Profile updated")
    } catch (error) {
      toast.error("Error updating profile")
    }
  }

  useEffect(() => {
    async function fetchUserListings() {
      const listingRef = collection(db, "listings");
      const q = query(
        listingRef,
        where("userRef", "==", auth.currentUser.uid),
        orderBy("timestamp", "desc")
      );
      const querySnap = await getDocs(q);
      let listings = [];
      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setListings(listings);
      setLoading(false);
    }
    fetchUserListings();
  }, [auth.currentUser.uid]);


  async function onDelete(listingID) {
    if (window.confirm("Whoa! Are you sure you want to delete?")) {
      await deleteDoc(doc(db, "listings", listingID));
      const updatedListings = listings.filter(
        (listing) => listing.id !== listingID
      );
      setListings(updatedListings);
      toast.success("BAM! Successfully deleted the listing");
    }
  }
  function onEdit(listingID) {
    navigate(`/edit-listing/${listingID}`);
  }
    



  return (
    <>
      <section className="flex justify-center items-center text-center flex-col  max-w-6xl mx-auto ">
        <h1 className="mb-6 text=3xl text-center mt-6 font-bold">
          My Awesome Profile
        </h1>

        <div className="w-full md:w-[50%] mt-6 px-3">
          <form>
            <input
              type="text"
              id="name"
              value={name}
              disabled={!changeProfile}
              onChange={onChange}
              className={`mb-6 w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out ${
                changeProfile && "bg-red-200 focus:bg-red-200"
              }`}
            />

            <input
              type="email"
              id="email"
              value={email}
              disabled
              className="mb-6 w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out"
            />

            <div className="flex justify-between whitespace-nowrap text-sm sm:text-lg mb-6">
              <p className="flex items-center">
                Need to change your name?{" "}
                <span
                  onClick={() => {
                    changeProfile && onSubmit()
                    setChangeProfile((prevState) => !prevState);
                  }}  
                  className="text-red-500 hover:text-red-700 transition ease-in-out duration-200 ml-1 cursor-pointer"
                >
                  {changeProfile ? "Apply Change" : "Edit"}
                </span>
              </p>

              <p
                onClick={onLogout}
                className="text-blue-500 hover:text-blue-700 transition ease-in-out duration-200 ml-1 cursor-pointer  "
              >
                Sign Out
              </p>
            </div>
          </form>

          <button type="submit" className="w-full bg-blue-700 text-white uppercase px-7 py-3 text-sm font-medium rounded shadow-md hover:bg-blue-800 transition duration-150 ease-in-out hover:shadow-lg active:bg-blue-900 ">

            <Link to="/create-listing" className="flex justify-center items-center ">
              <FcMoneyTransfer className="mr-2 text-4xl rounded-full p-1 border-2"/>
              Ready to Sell or Trade?
            </Link>   
          </button>          


        </div>


      </section>

      <div className="max-w-6xl px-3 mt-6 mx-auto">
        {!loading && listings.length > 0 && (
          <>
            <h2 className="text-2xl text-center font-semibold mb-6">
              My Listings
            </h2>
            <ul className="sm:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 mt-6 mb-6">
              {listings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  id={listing.id}
                  listing={listing.data}
                  onDelete={() => onDelete(listing.id)}
                  onEdit={() => onEdit(listing.id)}
                />
              ))}
            </ul>
          </>
        )}
      </div>
    </>
  );
}