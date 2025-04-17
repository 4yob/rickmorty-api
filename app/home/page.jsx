"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import styles from "./Home.module.css";
import CharacterCard from "../../components/CharacterCard";

export default function Home() {
    const [search, setSearch] = useState("");
    const [characters, setCharacters] = useState([]);
    const [notFound, setNotFound] = useState(false);

    
        const fetchCharacters = async (name = "") => {
            setNotFound(false);
            try {
                const { data } = await axios.get(`https://rickandmortyapi.com/api/character/?name=${name}`);
                setCharacters(data.results);
            } catch {
                setNotFound(true);
                setCharacters([]);
            }
        };

        useEffect(() => {
            fetchCharacters();
        }, []);

        const handleCardClick = (name) => {
            toast.info(`Você clicou no personagem: ${name}`, {});
        };

        const handleButtonClick = (message) => {
            toast.info(message, {
                position: "top-right",
                autoClose: 7500,
                hideProgressBar: false,
                newestOnTop: false,
                closeOnClick: true,
                rtl: false,
                pauseOnFocusLoss: true,
                draggable: true,
                pauseOnHover: true,
                theme: "dark",
            });
        };

    console.log(characters);

    return (
        <div className={styles.container}>
            <ToastContainer position="bottom-right" autoClose={7500} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="dark" />
            <h1 className={styles.title}>Personagens de Rick and Morty</h1>
            <div className={styles.search}>
                <input 
                className={styles.searchbar} 
                type="text" 
                placeholder="Pesquise por um personagem"
                value={search}
                onChange={(e) => setSearch(e.target.value)}/>
                <button 
                className={styles.buttonSearch} 
                onClick={() => {
                    handleButtonClick("Você pesquisou por: " + search);
                    fetchCharacters(search.trim())
                    }}>Buscar</button>
                <button 
                className={styles.buttonReset} 
                onClick={() => {
                    handleButtonClick("Você resetou a busca!");
                    setSearch("");
                    fetchCharacters();
                }}>Resetar</button>
            </div>
            {notFound && (
                <h1 className={styles.notFound}>Nenhum personagem identificado. Tente novamente.</h1>
            )}
            <div className={styles.grid}>
                {characters.map((char) => (
                <CharacterCard key={char.id} character={char} onClick={() => handleCardClick(char.name)} />
                ))}
            </div>
        </div>
    );
}