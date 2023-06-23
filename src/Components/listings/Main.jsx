import React, { useState, useEffect } from 'react';
import Card from './Card';
import Pokeinfo from './Pokeinfo';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';

const Main = () => {
  const [pokeData, setPokeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [url, setUrl] = useState('https://pokeapi.co/api/v2/pokemon/');
  const [nextUrl, setNextUrl] = useState('');
  const [prevUrl, setPrevUrl] = useState('');
  const [pokeDex, setPokeDex] = useState('');
  const [allPokeData, setAllPokeData] = useState([]);
  const [scrollPosition, setScrollPosition] = useState(0); // Track scroll position

  const pokeFun = async () => {
    setLoading(true);
    const res = await axios.get(url);
    setNextUrl(res.data.next);
    setPrevUrl(res.data.previous);
    getPokemon(res.data.results);
    setLoading(false);
  };

  const getPokemon = async (res) => {
    for (let i = 0; i < res.length; i++) {
      const result = await axios.get(res[i].url);
      setAllPokeData((state) => {
        state = [...state, result.data];
        state.sort((a, b) => (a.id > b.id ? 1 : -1));
        return state;
      });
    }
  };

  useEffect(() => {
    pokeFun();
    const storedPosition = localStorage.getItem('scrollPosition');
    if (storedPosition) {
      window.scrollTo(0, parseInt(storedPosition));
    }
    return () => {
      localStorage.setItem('scrollPosition', window.pageYOffset.toString());
    };
  }, [url]);

  const loadMoreData = () => {
    if (nextUrl) {
      const currentPosition = window.pageYOffset; // Get current scroll position
      setUrl(nextUrl);
      setScrollPosition(currentPosition); // Store the current scroll position
    }
  };

  useEffect(() => {
    window.scrollTo(0, scrollPosition); // Restore scroll position after rendering new content
  }, [allPokeData]);

  return (
    <>
      <div className="container">
        <div className="left-content">
          <Card
            pokemon={allPokeData}
            loading={loading}
            infoPokemon={(poke) => setPokeDex(poke)}
          />

          <div className="btn-group">
            {prevUrl && (
              <button
                onClick={() => {
                  setUrl(prevUrl);
                }}
              >
                Previous
              </button>
            )}

            {nextUrl && (
              <InfiniteScroll
                dataLength={allPokeData.length}
                next={loadMoreData}
                hasMore={true}
                loader={<div className="loading-spinner"></div>}
              />
            )}
          </div>
        </div>
        <div className="right-content">
          <Pokeinfo data={pokeDex} />
        </div>
      </div>
    </>
  );
};

export default Main;
