import React, { useState } from 'react';

const Search = ({ onSearchChange }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleInputChange = (event) => {
        const newSearchTerm = event.target.value;
        setSearchTerm(newSearchTerm);
        if (onSearchChange) {
            onSearchChange(newSearchTerm); // Appelle la fonction passée en prop
        }
    };

    return (
        <div className="search-container relative flex items-center">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                    className="h-7 w-7 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                >
                    <path
                        fillRule="evenodd"
                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                        clipRule="evenodd"
                    />
                </svg>
            </div>
            <input
                type="text"
                placeholder="Rechercher un exercice..."
                value={searchTerm}
                onChange={handleInputChange}
                className="search-input py-4 pl-12 pr-4 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        </div>
    );
};
export default Search;