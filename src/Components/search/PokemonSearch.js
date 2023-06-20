import React, { useState } from 'react';
import './SearchPage.css';

const SearchPage = () => {
  const [pokemonName, setPokemonName] = useState('');
  const [pokemonData, setPokemonData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    setPokemonName(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}/`);
      if (response.ok) {
        const data = await response.json();
        setPokemonData(data);
      } else {
        console.log('Error:', response.statusText);
      }
    } catch (error) {
      console.log('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="search-page">
      <h1>Pokémon Search</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" value={pokemonName} onChange={handleInputChange} placeholder="Enter Pokémon name" />
        <button type="submit">Search</button>
      </form>

      {isLoading && <div className="loading">Loading...</div>}

      {pokemonData && (
        <div className="pokemon-details">
          <h2>{pokemonData.name}</h2>
          <img src={pokemonData.sprites.front_default} alt="Pokemon Sprite" />
          <p>Height: {pokemonData.height}</p>
          <p>Weight: {pokemonData.weight}</p>
          <div className="details-section">
            <h3>Abilities:</h3>
            <ul>
              {pokemonData.abilities.map((ability) => (
                <li key={ability.ability.name}>{ability.ability.name}</li>
              ))}
            </ul>
          </div>
          <div className="details-section">
            <h3>Types:</h3>
            <ul>
              {pokemonData.types.map((type) => (
                <li key={type.type.name}>{type.type.name}</li>
              ))}
            </ul>
          </div>
          <div className="details-section">
            <h3>Moves:</h3>
            <ul>
              {pokemonData.moves.map((move) => (
                <li key={move.move.name}>{move.move.name}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
