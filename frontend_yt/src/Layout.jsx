import React from "react";
import Navbar from "./components/Header/Navbar";
import { Outlet } from "react-router-dom";
import Sidebar from "./components/Header/Sidebar";


// function Layout() {
//   return (
//     <>
//       <Navbar />
//       <div className="flex bg-black">
//         {/* Sidebar only visible on medium screens and up */}
//         <div className="hidden md:block w-56 shrink-0 bg-black border-r border-slate-600 fixed left-0 top-0 h-screen z-10">
//           <Sidebar />
//         </div>

//         {/* Main content */}
//         <div className="w-full md:pl-56 pt-16 pb-20 flex flex-col flex-1 bg-black overflow-y-auto overflow-x-hidden scrollbar-hide">
//           <Outlet />
//         </div>
//       </div>
//     </>
//   );
// }



// function Layout() {
//   return (
//     <>
//       <Navbar />
//       <div className="flex bg-black relative min-h-screen">
//         {/* Sidebar for md and up: LEFT */}
//         <div className="hidden md:block w-56 shrink-0 bg-black border-r border-slate-600 fixed left-0 top-0 h-screen z-10">
//           <Sidebar variant="desktop" />
//         </div>

//         {/* Sidebar for sm to md: RIGHT floating panel */}
//         <div className="hidden sm:block md:hidden fixed right-0 top-16 w-56 h-[calc(100vh-64px)] bg-black border-l border-slate-600 z-20">
//           <Sidebar variant="right" />
//         </div>

//         {/* Main content */}
//         <div className="w-full md:pl-56 pt-16 pb-20 flex flex-col flex-1 bg-black overflow-y-auto overflow-x-hidden scrollbar-hide">
//           <Outlet />
//         </div>

//         {/* Bottom nav for <=640px */}
//         <div className="sm:hidden fixed bottom-0 w-full z-50">
//           <Sidebar variant="mobile" />
//         </div>
//       </div>
//     </>
//   );
// }
function Layout() {
  return (
    <>
      <Navbar />
      <div className="flex bg-black relative min-h-screen">
        {/* Sidebar: visible from sm and up, fixed on the left */}
        <div className="hidden sm:block w-56 shrink-0 bg-black border-r border-slate-600 fixed left-0 top-0 h-screen z-10">
          <Sidebar variant="desktop" />
        </div>

        {/* Main content with padding from sm and up */}
        <div className="w-full sm:pl-56 pt-16 pb-20 flex flex-col flex-1 bg-black overflow-y-auto overflow-x-hidden scrollbar-hide">
          <Outlet />
        </div>

        {/* Bottom nav for <640px only */}
        <div className="sm:hidden fixed bottom-0 w-full z-50">
          <Sidebar variant="mobile" />
        </div>
      </div>
    </>
  );
}




export default Layout;

