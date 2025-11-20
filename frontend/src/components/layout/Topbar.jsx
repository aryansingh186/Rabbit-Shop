import React from "react";
import { TbBrandMeta } from "react-icons/tb";
import { IoLogoInstagram } from "react-icons/io";
import { RiTwitterXLine } from "react-icons/ri";

const Topbar = () => {
  return (
    <div className="bg-[#ea2e0e] text-white py-2 text-sm">
      <div className="container mx-auto flex justify-between items-center px-4">
        {/* Left: Social Icons */}
        <div className="hidden md:flex items-center space-x-4">
          <a href="#" className="hover:text-gray-300">
            <TbBrandMeta className="h-5 w-5 text-white" />
          </a>
          <a href="#" className="hover:text-gray-300">
            <IoLogoInstagram className="h-5 w-5 text-white" />
          </a>
          <a href="#" className="hover:text-gray-300">
            <RiTwitterXLine className="h-5 w-5 text-white" />
          </a>
        </div>

        {/* Center: Message */}
        <div className="text-center flex-grow">
          <span>We ship worldwide — fast, reliable shipping!</span>
        </div>

        {/* Right: Contact */}
        <div className=" hidden md:block">
          <a href="tel:+917050445860" className="hover:text-gray-300">
            +91 7050445860
          </a>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
