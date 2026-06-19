"use client";
import React, { useState, useImperativeHandle, forwardRef } from "react";
import { IoSearchOutline } from "react-icons/io5";

const categories = [
  "Graphics & Design",
  "Web Development",
  "Video Editing",
  "AI Development",
  "Digital Marketing",
  "Software Development",
  "App Development",
  "Logo Design",
  "Search Engine Optimization",
];


const Searchbar = forwardRef(({ onSearch }, ref) => {
  const [query, setQuery] = useState("");
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    const filtered = categories.filter((cat) =>
      cat.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredCategories(filtered);
    setShowSuggestions(true);
  };

  const handleSelect = (category) => {
    setQuery(category);
    setShowSuggestions(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      onSearch(query);
      setShowSuggestions(false);
    }
  };

  useImperativeHandle(ref, () => ({
    setQueryExternally: (value) => {
      setQuery(value);
      const filtered = categories.filter((cat) =>
        cat.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredCategories(filtered);
      setShowSuggestions(true);
    },
  }));

  return (
    <div className="relative w-fit">
      <div className="flex mt-4 sm:mt-0 relative">
        <span className="absolute left-2 top-1 sm:top-2.5 sm:py-1 py-1 text-xl text-gray-500">
          <IoSearchOutline />
        </span>
        <input
          type="text"
          placeholder='Try "our services"'
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className="w-full sm:w-120 md:w-140 h-9 gap-y-4 sm:h-10 shadow-2xl sm:py-6 py-2 px-10 rounded-l-md bg-base-200 text-black outline-none"
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
        />
        <button
          className="bg-black px-6 rounded-r-md text-white"
          onClick={() => onSearch(query)}
        >
          Search
        </button>
      </div>

      {showSuggestions && filteredCategories.length > 0 && (
        <ul className="absolute z-10 bg-white border mt-1 rounded-md w-full max-h-50 text-left overflow-y-auto shadow-md">
          {filteredCategories.map((cat, index) => (
            <li
              key={index}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onMouseDown={() => handleSelect(cat)}
            >
              {cat}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
});


export default Searchbar;
