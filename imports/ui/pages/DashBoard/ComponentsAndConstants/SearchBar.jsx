import React from "react";

const SearchBar = () => {
    return (
        <div>
            <input
                className="w-1/2 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search.."
            />
        </div>
    );
};

export default SearchBar;
