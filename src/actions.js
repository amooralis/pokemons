// actions.js
export const LOAD_POKEMON_LIST = 'LOAD_POKEMON_LIST';
export const ADD_POKEMON = 'ADD_POKEMON';
export const REMOVE_POKEMON = 'REMOVE_POKEMON';

export const loadPokemonList = (pokemonList) => ({
    type: LOAD_POKEMON_LIST,
    payload: pokemonList,
});

export const addPokemon = (pokemon) => ({
    type: ADD_POKEMON,
    payload: pokemon,
});

export const removePokemon = (pokemonName) => ({
    type: REMOVE_POKEMON,
    payload: pokemonName,
});
