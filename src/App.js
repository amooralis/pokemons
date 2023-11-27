// App.js
import React, {useState, useEffect, useCallback, useMemo} from 'react';
import './App.css';
import {Provider, useDispatch, useSelector} from 'react-redux';
import store from './store';
import {ThemeProvider, useTheme} from './ThemeContext';
import {loadPokemonList, addPokemon, removePokemon} from './actions';

function App() {
    const dispatch = useDispatch();
    const pokemonList = useSelector((state) => state.pokemonList);
    const [searchInput, setSearchInput] = useState('');
    const {isLight, toggleTheme} = useTheme();

    const handleSearch = useCallback(async () => {
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${searchInput.toLowerCase()}`);
            if (response.ok) {
                const data = await response.json();
                const isPokemonInList = pokemonList.some((pokemon) => pokemon.name === data.name);

                if (isPokemonInList) {
                    dispatch(removePokemon(data.name));
                }
                dispatch(addPokemon(data));
                const updatedPokemonList = [...pokemonList, data];
                localStorage.setItem('pokemonList', JSON.stringify(updatedPokemonList));
            } else {
                alert("Такой покемон не найден");
            }
        } catch (error) {
            console.error('Error during search:', error);
            alert('Произошла ошибка при поиске покемона');
        }
    }, [searchInput, pokemonList, dispatch]);


    const handleRemove = useCallback((pokemonName) => {
        dispatch(removePokemon(pokemonName));
    }, [dispatch]);

    useEffect(() => {
        const loadInitialData = async () => {
            const storedData = localStorage.getItem('pokemonList');
            if (storedData) {
                dispatch(loadPokemonList(JSON.parse(storedData)));
            } else {
                const response = await fetch('https://pokeapi.co/api/v2/pokemon');
                if (response.ok) {
                    const data = await response.json();
                    dispatch(loadPokemonList(data.results));
                    localStorage.setItem('pokemonList', JSON.stringify(data.results));
                } else {
                    alert('Не удалось загрузить исходные данные');
                }
            }
        };
        loadInitialData();
    }, [dispatch]);

    return (
        <div className={`App ${isLight ? 'light-theme' : 'dark-theme'}`}>
            <div className="switch-container">
                <label className="switch">
                    <input
                        className="theme"
                        type="checkbox"
                        checked={isLight}
                        onChange={toggleTheme}
                    />
                    <span className="slider round"></span>
                </label>
            </div>

            <div className="top-bar">
                <input
                    className="main-input"
                    type="text"
                    id="input-id"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                />
                <button onClick={handleSearch}>Найти</button>
            </div>

            {pokemonList.map((pokemon) => (
                <PokemonItem
                    key={pokemon.name}
                    name={pokemon.name}
                    onRemove={() => handleRemove(pokemon.name)}
                />
            ))}
        </div>
    );
}

function PokemonItem({name, onRemove}) {
    const [pokemonDetails, setPokemonDetails] = useState(null);
    const {isLight} = useTheme();

    useEffect(() => {
        const loadPokemonDetails = async () => {
            try {
                const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
                if (!response.ok) {
                    throw new Error('Ошибка при загрузке данных о покемоне');
                }
                const data = await response.json();
                setPokemonDetails(data);
            } catch (error) {
                console.error(error);
                alert('Ошибка при загрузке данных о покемоне');
            }
        };

        if (name) {
            loadPokemonDetails();
        }
    }, [name]);

    const memoizedDetails = useMemo(() => (
        <div className="details">
            <div className="text">
                <p>Количество форм: {pokemonDetails && pokemonDetails.forms.length}</p>
                <p>Названия форм: {pokemonDetails && pokemonDetails.forms.map((form) => form.name).join(', ')}</p>
            </div>
            <img src={pokemonDetails && pokemonDetails.sprites.front_default} alt={name}/>
        </div>
    ), [pokemonDetails, name]);

    return (
        <div className={`pokemon-card ${isLight ? 'light-theme-card' : 'dark-theme-card'}`}>
            <p className="name"><b>{name}</b></p>
            {pokemonDetails && memoizedDetails}
            <button onClick={() => onRemove(name)}>✖</button>
        </div>
    );
}

const All = () => (
    <Provider store={store}>
        <ThemeProvider>
            <App/>
        </ThemeProvider>
    </Provider>
);

export default All;
