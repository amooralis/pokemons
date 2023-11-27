// reducer.js
const initialState = {
    pokemonList: [],
};

const rootReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'LOAD_POKEMON_LIST':
            return {
                ...state,
                pokemonList: action.payload,
            };

        case 'ADD_POKEMON':
            console.log('Adding Pokemon:', action.payload);
            return {
                ...state,
                pokemonList: [action.payload, ...state.pokemonList],
            };

        case 'REMOVE_POKEMON':
            return {
                ...state,
                pokemonList: state.pokemonList.filter(pokemon => pokemon.name !== action.payload),
            };

        default:
            return state;
    }
};

export default rootReducer;
