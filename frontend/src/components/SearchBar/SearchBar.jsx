import React from 'react';

const SearchBar = ({ value, onChange, placeholder = 'Search for healthy food items...' }) => {
  return (
    <div className="input-group input-group-lg shadow-sm border border-success border-opacity-10 rounded-pill overflow-hidden bg-white mb-4">
      <span className="input-group-text bg-white border-0 ps-4">
        <i className="bi bi-search text-success"></i>
      </span>
      <input
        type="text"
        className="form-control border-0 py-3 shadow-none text-dark"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ fontSize: '1rem' }}
      />
    </div>
  );
};

export default SearchBar;
