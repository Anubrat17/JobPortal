import React, { useContext } from "react";
import { TrendingUp } from "lucide-react";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";

const Navbar = () => {
  const { openSignIn } = useClerk();
  const { user } = useUser();
  const navigate = useNavigate();
  const { setShowRecruiterLogin } = useContext(AppContext);
  const logoType = "icon"; 

  const renderLogo = () => {
    switch (logoType) {
      case "icon":
        return (
          <div
            onClick={() => navigate("/")}
            className="cursor-pointer flex items-center gap-2"
          >
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">CareerFlow</span>
          </div>
        );
      case "text":
        return (
          <div
            onClick={() => navigate("/")}
            className="cursor-pointer"
          >
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              CareerFlow
            </h1>
          </div>
        );
      case "image":
        return (
          <img
            onClick={() => navigate("/")}
            className="cursor-pointer h-10"
            src={assets.logo}
            alt="CareerFlow"
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="shadow py-4">
      <div className="container px-4 2x1:px-20 mx-auto flex justify-between">
        {/* Logo */}
        {renderLogo()}

        {/* Right side */}
        {user ? (
          <div className="flex items-center gap-4">
            <Link to={"/application"}>Applied Jobs</Link>
            <p className="max-sm:hidden">
              Hi, {user.firstName + " " + user.lastName}
            </p>
            <UserButton />
          </div>
        ) : (
          <div className="flex gap-4 max-sm:text-xs">
            <button
              onClick={() => setShowRecruiterLogin(true)}
              className="text-gray-600"
            >
              Recruiter Login
            </button>
            <button
              onClick={() => openSignIn()}
              className="bg-blue-600 text-white px-6 sm:px-9 py-2 rounded-full"
            >
              Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
