'use client'; // Marca este componente como Client Component

import { useState } from 'react';

export default function SearchInput() {
  const [search, setSearch] = useState('');

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      console.log('Search:', search); // Aquí irá la lógica de búsqueda más adelante
    }
  };

  return (
    <div className="search-input">
      <form id="search" action="#" onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          placeholder="Type Something"
          id="searchText"
          name="searchKeyword"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <i className="fa fa-search"></i>
      </form>
    </div>
  );
}