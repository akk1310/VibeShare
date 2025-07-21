import React from "react";
import {
  BiHistory,
  BiLike,
  CiSettings,
  HiOutlineVideoCamera,
  IoFolderOutline,
  RiHome6Line,
  TbUserCheck,
} from "../icons";
import { NavLink, useNavigate } from "react-router-dom";
import { IoMdLogOut } from "react-icons/io";
import { useSelector, useDispatch } from "react-redux";
import { userLogout } from "../../store/Slices/authSlice";
import {ContactCard} from "../index";
const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const username = useSelector((state) => state.auth?.userData?.username);

  const sidebarTopItems = [
    {
      icon: <RiHome6Line size={25} />,
      title: "Home",
      url: "/",
    },
    {
      icon: <BiLike size={25} />,
      title: "Liked Videos",
      url: "/liked-videos",
    },
    {
      icon: <BiHistory size={25} />,
      title: "History",
      url: "/history",
    },
    {
      icon: <HiOutlineVideoCamera size={25} />,
      title: "My Content",
      url: `/channel/${username}`,
    },
    {
      icon: <IoFolderOutline size={25} />,
      title: "Collections",
      url: "/collections",
    },
    {
      icon: <TbUserCheck size={25} />,
      title: "Subscriptions",
      url: "/subscriptions",
    },
  ];
  const bottomBarItems = [
    {
      icon: <RiHome6Line size={25} />,
      title: "Home",
      url: "/",
    },
    {
      icon: <BiHistory size={25} />,
      title: "History",
      url: "/history",
    },
    {
      icon: <IoFolderOutline size={25} />,
      title: "Collections",
      url: "/collections",
    },
    {
      icon: <TbUserCheck size={25} />,
      title: "Subscriptions",
      url: "/subscriptions",
    },
  ];

  const logout = async () => {
    await dispatch(userLogout());
    navigate("/");
  };
  return (
    <>
       <div className="sm:block hidden bg-black fixed top-16 left-0 h-[calc(100vh-64px)] z-10">
        <div className="text-white lg:w-56 md:w-46 w-20 sm:p-3 p-2 border-slate-600 border-r h-full flex flex-col gap-45 justify-between overflow-y-auto">
          <div className="flex flex-col gap-4 mt-0">
            {sidebarTopItems.map((item) => (
              <NavLink
                to={item.url}
                key={item.title}
                className={({ isActive }) => (isActive ? "bg-purple-500" : "")}
              >
                <div className="flex items-center gap-2 justify-center sm:justify-start hover:bg-purple-500 cursor-pointer py-1 px-2 border border-slate-600">
                  {item.icon}
                  <span className="text-base hidden md:block">
                    {item.title}
                  </span>
                </div>
              </NavLink>
            ))}
          </div>

          <div className="flex flex-col gap-8">

          

          <div className="space-y-6 ">
            {username && (
              <div
                className="flex items-center bg-red-500 gap-2 justify-center sm:justify-start hover:bg-purple-500 cursor-pointer py-1 px-2 border border-slate-600"
                onClick={() => logout()}
              >
                <IoMdLogOut size={25} />
                <span className="text-base hidden md:block">Logout</span>
              </div>
            )}
            
          </div>

          <div className="flex flex-col">
            
            <ContactCard />
          </div>
          </div>
        </div>
      </div>

      {/* for mobile sidebar is bottom bar*/}
      <div className="border-t-2 text-white h-16 sm:hidden z-20 p-1 w-full flex justify-around fixed bottom-0 bg-[#0E0F0F]">
        {bottomBarItems.map((item) => (
          <NavLink
            to={item.url}
            key={item.title}
            className={({ isActive }) => (isActive ? "text-purple-500" : "")}
          >
            <div className="flex flex-col items-center gap-1 cursor-pointer p-1">
              {item.icon}
              <span className="text-sm">{item.title}</span>
            </div>
          </NavLink>
        ))}
      </div>
    </>
  );
};

export default Sidebar;
