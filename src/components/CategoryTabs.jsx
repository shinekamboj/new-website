import React from 'react';

export default function CategoryTabs({ categories, selected, onSelect }) {
  return (
    <div className="category-list" role="group" aria-label="Filter games by category">
      {categories.map((category) => (
        <button
          className={`category-chip ${selected === category ? 'selected' : ''}`}
          type="button"
          key={category}
          aria-pressed={selected === category}
          onClick={() => onSelect(category)}
        >
          {category === 'All games' ? '✨' : '✦'} {category}
        </button>
      ))}
    </div>
  );
}
