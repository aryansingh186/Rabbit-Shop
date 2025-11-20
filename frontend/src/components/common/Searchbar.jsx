import React, { useState } from 'react';
import { HiMagnifyingGlass, HiMiniXMark } from 'react-icons/hi2';

const Searchbar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleSearchToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Search Term:', searchTerm);
  };

  return (
    <div
      className={`flex items-center justify-center w-full transition-all duration-100 ${
        isOpen ? "absolute top-0 left-0 bg-white h-24 z-50" : "w-auto"
      }`}
    >
      {isOpen ? (
        <form 
          onSubmit={handleSearch}
          className="relative flex items-center justify-center w-full"
        >
          <div className="relative w-1/2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search..."
              className="bg-gray-200 px-4 py-2 pl-2 pr-12 focus:outline-none rounded-md w-full text-gray-800"
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-300 active:bg-gray-400 transition-all"
            >
              <HiMagnifyingGlass className="h-6 w-6 text-gray-600" />
            </button>
          </div>

          {/* Close Button */}
          <button
            type="button"
            onClick={handleSearchToggle}
            className="ml-2 p-1 bg-gray-200 rounded-full hover:bg-gray-300 active:bg-gray-100 transition-all"
          >
            <HiMiniXMark className="h-6 w-6 text-gray-600" />
          </button>
        </form>
      ) : (
        <button onClick={handleSearchToggle}>
          <HiMagnifyingGlass className="h-5 w-5 mx-2 text-gray-700" />
        </button>
      )}
    </div>
  );
};

export default Searchbar;
