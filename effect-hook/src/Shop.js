import React, { useState, useEffect } from 'react';
import { get } from './mockBackend/fetch';

export default function Shop() {
  const [categories, setCategories] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [items, setItems] = useState({});

  // This retrieves the list of categories.  [] means first time only.
  // Calling setCategories will cause the component to re-render.
  useEffect(() => {
      get('/categories').then((response) => {
        setCategories(response.data);
      });
  },[]);

  // If a category is selected, retrieve its items.
  // Add / overlay the retrieved items to the existing items object.
  // This will cause the component to re-render.
  // Only do this if the selectedCategory has changed.
  useEffect(() => {
    if (selectedCategory ) {
        get(`/items?category=${selectedCategory}`)
            .then((response) => {
                setItems((prev) => ({ ...prev, [selectedCategory]: response.data }));
            });
    }
  },[selectedCategory]);

  // If categories have not yet been retrieved, display 'Loading..'
  if (!categories) {
    return <p>Loading..</p>;
  }

  return (
    <div className='App'>
      <h1>Clothes 'n Things</h1>
      <nav>
        {categories.map((category) => (
          <button key={category} onClick={() => setSelectedCategory(category)}>
            {category}
          </button>
        ))}
      </nav>
      <h2>{selectedCategory}</h2>
      <ul>
        {!items[selectedCategory]
          ? null
          : items[selectedCategory].map((item) => <li key={item}>{item}</li>)}
      </ul>
    </div>
  );
}
