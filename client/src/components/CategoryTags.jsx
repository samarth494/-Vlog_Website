import React from 'react';
import './CategoryTags.css';

function CategoryTags({ onSelect }) {
  const categories = [
    { label: "Travel Vlogs", query: "travel vlog" },
    { label: "Food Vlogs", query: "food vlog" },
    { label: "Tech Vlogs", query: "tech vlog" },
    { label: "Lifestyle Vlogs", query: "lifestyle vlog" },
    { label: "Educational Vlogs", query: "educational vlog" },
  ];

  return (
    <div className="tag-container">
      {categories.map((cat) => (
        <button key={cat.query} onClick={() => onSelect(cat.query)}>
          {cat.label}
        </button>
      ))}
    </div>
  );
}

export default CategoryTags;
