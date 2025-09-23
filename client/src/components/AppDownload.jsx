import React from "react";
import { Smartphone, Star, Users, Zap } from "lucide-react";
import { assets } from "../assets/assets"; 

const FeaturesPromo = () => {
  const features = [
    { icon: <Zap className="w-4 h-4" />, text: "Lightning Fast Job Search" },
    { icon: <Users className="w-4 h-4" />, text: "Connect with Top Employers" },
    { icon: <Star className="w-4 h-4" />, text: "Rated 4.8/5 by Users" }
  ];

  return (
    <div className="container px-4 2xl:px-20 mx-auto my-20">
      <div className="relative bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-12 sm:p-16 lg:p-20 overflow-hidden shadow-lg">
        <div className="grid lg:grid-cols-2 gap-6 items-center">

          {/* Left Content */}
          <div className="space-y-5 relative z-10">
            <h1 className="text-2xl sm:text-3xl font-bold max-w-md">
              Explore CareerFlow <br />
              <span className="text-purple-600">Powerful Job Tools</span>
            </h1>

            {/* Features */}
            <div className="space-y-2">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-gray-700 text-sm">
                  <div className="flex items-center justify-center w-6 h-6 bg-purple-100 rounded-full">
                    {feature.icon}
                  </div>
                  <span>{feature.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Image with Floating Icons */}
          <div className="flex justify-center lg:justify-end relative">
            {/* Floating Icons */}
            <div className="absolute -top-4 -right-4 animate-bounce">
              <Smartphone className="w-5 h-5 text-blue-600" />
            </div>
            <div className="absolute -bottom-4 -left-4 animate-pulse">
              <Star className="w-5 h-5 text-yellow-400" />
            </div>

            {/* Girl Image */}
            <img
              className="w-72 max-lg:w-64 relative z-10 drop-shadow-lg rounded-2xl"
              src={assets.app_main_img}
              alt="CareerFlow Girl"
            />
          </div>

        </div>

        {/* Bottom CTA Strip */}
        <div className="bg-black/10 backdrop-blur-sm border-t border-gray-200 mt-6 p-4 rounded-lg flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="text-gray-700 text-sm">
            <p className="font-semibold">Ready to accelerate your career?</p>
            <p>Join thousands of professionals using CareerFlow</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default FeaturesPromo;
