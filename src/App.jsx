// import { RouterProvider, createBrowserRouter } from "react-router-dom";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import "./App.scss";
// import routes from "./Routing/Routes.jsx";
// import { useEffect } from "react";

// function App() {
//   useEffect(() => {
//     localStorage.setItem("isLogged", "");
//   }, []);

//   const router = createBrowserRouter([
//     {
//       path: "/",
//       children: routes,
//       // errorElement: <ErrorBoundary />,
//     },
//   ]);

//   return (
//     <>
//       <ToastContainer />
//       <RouterProvider router={router} />
//     </>
//   );
// }

// export default App;


import React, { useEffect } from "react";
import { RouterProvider, createBrowserRouter, useLocation, useParams } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.scss";
import routes from "./Routing/Routes.jsx";
import { REACT_APP_DOMAIN_KEY } from "./Common/comman_fun";
import { useDispatch } from "react-redux";
import { logoutState } from "./Utility/Slices/user.slice";

function App() {
  const loc = useParams()
  const router = createBrowserRouter([
    {
      path: "/",
      children: routes,
    },
  ], { basename: `/${REACT_APP_DOMAIN_KEY}` });


  return (
    <>
      <ToastContainer />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
