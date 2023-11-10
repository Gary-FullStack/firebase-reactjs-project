import { Outlet, Navigate } from "react-router-dom";
import {useAuthStatus} from "../hooks/useAuthStatus";


export default function PrivateRoute() {

  const { loggedIn, checkingStatus } = useAuthStatus();

  if (checkingStatus)
    return <div>Checking authentication status...</div>;
  return loggedIn ? <Outlet /> : <Navigate to="/sign-in" />;

}