// import React from "react";
// import "./SidebarDashboard.scss";
// import {
//   CloseOutlined,
//   LogoutOutlined,
//   SettingOutlined,
//   SoundOutlined,
// } from "@ant-design/icons";
// import Logo from "../../assets/HeaderLogo.png";
// import HeaderMenu from "../Header/HeaderMenu";
// import { Path } from "../../Routing/Constant/RoutePaths";
// import { Link, useNavigate } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { loginUserState, logoutState } from "../../Utility/Slices/user.slice";
// import Toaster from "../Toast/Toast";
// import { useLazyGetlogoutQuery } from "../../Utility/Services/UserLoginAPI";
// import { toast } from "react-toastify";

// function SidebarDashboard() {
//   // const [logout] = useLazyGetlogoutQuery();

//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   // const handleLogout = async () => {
//   //   try {
//   //     // await logout().unwrap();
//   //     dispatch(loginUserState(null));
//   //     Toaster(true, "Logout successfully.");
//   //     navigate("/login");
//   //   } catch (error) {
//   //     Toaster(false, "Logout failed. Please try again.");
//   //   }
//   // };

//   const handleLogout = () => {
//     try {
//       dispatch(loginUserState(null));
//       // handleLogout
//       Toaster(true, "Logout successfully.");
//     } catch (error) {
//       Toaster(true, "Somthing Went Wrong.");

//     }
//   }

//   return (
//     <div className="sideBar">
//       <div className="sideBar_onRight">
//         <div>
//           {" "}
//           <div className="sideBar_closeIcon">
//             <CloseOutlined />
//           </div>
//           <div className="sideBar_logo">
//             <img src={Logo} alt="" />
//           </div>
//           <div className="sideBar_menuItem">
//             <div className="sideBar_menuItem_top">
//               <h3>
//                 <Link to={Path.ANNOUNCEMENT}>
//                   <SoundOutlined /> Announcement
//                 </Link>
//               </h3>
//               <h3>
//                 <Link to={Path.SETTING}>
//                   {" "}
//                   <SettingOutlined /> Settings / Admin Controls
//                 </Link>
//               </h3>
//             </div>
//             <HeaderMenu className="displayShow" />
//           </div>
//         </div>
//         <div className="sideBar_onRight_logout">
//           <span
//             // onClick={() => {
//             //   dispatch(loginUserState(null));
//             //   // handleLogout
//             //   toast.success(true, "Logout successfully.");
//             // }}
//             onClick={handleLogout}
//             className="sideBar_closeIcon"
//           >
//             <LogoutOutlined /> Logout
//           </span>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default SidebarDashboard;


import React, { useState } from "react";
import "./SidebarDashboard.scss";
import {
  CloseOutlined,
  LogoutOutlined,
  SettingOutlined,
  SoundOutlined,
} from "@ant-design/icons";
import Logo from "../../assets/HeaderLogo.png";
import HeaderMenu from "../Header/HeaderMenu";
import { Path } from "../../Routing/Constant/RoutePaths";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginUserState } from "../../Utility/Slices/user.slice";
import Toaster from "../Toast/Toast";
import { Modal, Button } from "antd";

function SidebarDashboard() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(loginUserState(null));
    setIsModalVisible(false);
    Toaster(true, "Logout successfully.");
    navigate("/login");
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="sideBar">
      <div className="sideBar_onRight">
        <div>
          <div className="sideBar_closeIcon">
            <CloseOutlined />
          </div>
          <div className="sideBar_logo">
            <img src={Logo} alt="" />
          </div>
          <div className="sideBar_menuItem">
            <div className="sideBar_menuItem_top">
              <h3>
                <Link to={Path.ANNOUNCEMENT}>
                  <SoundOutlined /> Announcement
                </Link>
              </h3>
              <h3>
                <Link to={Path.SETTING}>
                  <SettingOutlined /> Settings / Admin Controls
                </Link>
              </h3>
            </div>
            <HeaderMenu className="displayShow" />
          </div>
        </div>
        <div className="sideBar_onRight_logout">
          <Button onClick={showModal} icon={<LogoutOutlined />} type="link">
            Logout
          </Button>
        </div>
      </div>
      <Modal
        title="Logout"
        visible={isModalVisible}
        onCancel={handleCancel}
        maskClosable={false}
        footer={null} // Remove footer so that custom buttons can be used
      >
        <p>Are you sure you want to logout?</p>
        <div style={{ textAlign: "right" }}>
          <Button onClick={handleCancel} style={{ marginRight: 10 }}>
            No
          </Button>
          <Button type="primary" onClick={handleLogout}>
            Yes
          </Button>
        </div>
      </Modal>
    </div>
  );
}

export default SidebarDashboard;
