import { useLocation, useNavigate } from "react-router-dom"


export default function Header() {

    const location = useLocation()
    const navigate = useNavigate()



    function isCurrentPath(path) {
       if ( path === location.pathname){
              return true
       }
    }




  return (

    <div className='bg-white border-b shadow-sm sticky top-0 z-50'>

     <header className='flex justify-between items-center px-3 max-w-6xl mx-auto'>

        <div>
            <img src="./images/logo.png" alt="site logo" className="h-20 cursor-pointer" onClick={()=>navigate("/")}/>
        </div>

        <div>
            <ul className='flex space-x-10'>

                <li className={`cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-[3px] border-b-transparent ${isCurrentPath("/") && "text-black border-b-red-500"}`} onClick={()=>navigate("/")}>Home</li>

                <li className={`cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-[3px] border-b-transparent ${isCurrentPath("/offers") && "text-black border-b-red-500"}`}onClick={()=>navigate("/offers")}>Offers</li>

                <li className={`cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-[3px] border-b-transparent ${isCurrentPath("/sign-in") && "text-black border-b-red-500"}`}onClick={()=>navigate("/sign-in")}>Sign In</li>
            </ul>
        </div>

     </header>

    </div>
  )
}
