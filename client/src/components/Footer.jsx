import React from "react";
import { assets } from "../assets/assets";
import { TrendingUp } from "lucide-react";

const Footer = () => {
  return (
    <div className="container px-4 2xl:px-20 mx-auto flex items-center justify-between gap-4 py-3 mt-20">
      {/* New Logo */}
      <div className="flex items-center gap-2 cursor-pointer">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
          <TrendingUp className="w-5 h-5 text-white" />
        </div>
        <span className="text-lg font-bold text-gray-900">CareerFlow</span>
      </div>

      <p className="flex-1 border-l pl-4 text-sm text-gray-500 max-sm:hidden">
        Copyright © CareerFlow | All rights reserved.
      </p>

      <div className="flex gap-2.5">
        <img width={32} src={assets.facebook_icon} alt="Facebook" />
        <img width={32} src={assets.twitter_icon} alt="Twitter" />
        <img width={32} src={assets.instagram_icon} alt="Instagram" />
      </div>
    </div>
  );
};

export default Footer;
