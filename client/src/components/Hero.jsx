import React, { useRef, useContext } from "react";
import { Search, MapPin } from "lucide-react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";

const Hero = () => {
  const { setSearchFilter, setIsSearched } = useContext(AppContext);
  const titleRef = useRef(null);
  const locationRef = useRef(null);

  const onSearch = () => {
    setSearchFilter({
      title: titleRef.current.value,
      location: locationRef.current.value,
    });
    setIsSearched(true);
  };

  return (
    <div className="container 2xl:px-20 mx-auto my-10">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 mx-2 overflow-hidden">
        
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16 text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-medium mb-4">
            Find Your Next Opportunity
          </h2>
          <p className="mb-8 max-w-xl mx-auto text-sm font-light px-5">
            Discover thousands of open positions tailored for you. Start your career journey today and unlock exciting opportunities that match your skills and ambitions.
          </p>
          <div className="flex item-center justify-between bg-white rounded text-gray-600 max-w-xl pl-4 mx-4 sm:mx-auto">
            <div className="flex items-center">
              <Search className="h-4 sm:h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Job title or keywords"
                className="max-sm:text-xs p-2 rounded outline-none w-full"
                ref={titleRef}
              />
            </div>
            <div className="flex items-center">
              <MapPin className="h-4 sm:h-5 text-gray-500" />
              <input
                type="text"
                placeholder="City or region"
                className="max-sm:text-xs p-2 rounded outline-none w-full"
                ref={locationRef}
              />
            </div>
            <button
              onClick={onSearch}
              className="bg-blue-600 px-6 py-2 rounded text-white m-1"
            >
              Explore
            </button>
          </div>
        </div>

        {/* Trusted Companies Section */}
        <div className="bg-gray-50 border-t border-gray-200 p-6">
          <div className="flex justify-center gap-10 lg:gap-16 flex-wrap w-full items-center">
            <p className="font-medium text-gray-700">Trusted by</p>
            <img className="h-6" src={assets.microsoft_logo} alt="Microsoft" />
            <img className="h-6" src={assets.walmart_logo} alt="Walmart" />
            <img className="h-6" src={assets.accenture_logo} alt="Accenture" />
            <img className="h-6" src={assets.samsung_logo} alt="Samsung" />
            <img className="h-6" src={assets.amazon_logo} alt="Amazon" />
            <img className="h-6" src={assets.adobe_logo} alt="Adobe" />
          </div>
        </div>

      </div>
    </div>
  );
};

export default Hero;

