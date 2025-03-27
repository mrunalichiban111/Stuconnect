import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom"
import { RootState, store } from "./app/store";
import { initializeApiInterceptors } from "./app/api";

const Layout: React.FC = () => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  // Assuming you have access to the token here:
const token = store.getState().auth.accessToken;
// console.log(token);

// Initialize the interceptors with the token
initializeApiInterceptors(store, token);
  return (
    <div>
    {isAuthenticated ? <Outlet /> : <Navigate replace to="/sign-in"/>}
    </div>
  );
};

export default Layout
