import { useState } from "react";
import { getAuth, updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { doc, updateDoc } from 'firebase/firestore';
import { db } from './../firebase';

export default function Profile() {
  const auth = getAuth();
  const navigate = useNavigate();
  const [changeProfile, setChangeProfile] = useState(false);

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
        </div>
      </section>
    </>
  );
}
