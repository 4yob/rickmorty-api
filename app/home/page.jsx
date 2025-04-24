"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import styles from "./Home.module.css";
import CharacterCard from "../../components/CharacterCard";
import Loader from "../../components/Loader";

export default function Home() {
    const [search, setSearch] = useState("");
    const [characters, setCharacters] = useState([]);
    const [notFound, setNotFound] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);

    
        const fetchCharacters = async (name, pageNumber) => {
            try {
                const { data } = await axios.get(`https://rickandmortyapi.com/api/character/?page=${pageNumber}&name=${name}`);
                setCharacters(data.results);
                setTotalPages(data.info.pages);
                setNotFound(false);
            } catch {
                setNotFound(true);
                setCharacters([]);
            }
        };

        useEffect(() => {
            fetchCharacters(search.trim(), page);
        }, [page]);

        useEffect(() => {
            fetchCharacters(search, page)
        }, [search]);

        const handleCardClick = (name) => {
            toast.info(`Você clicou no personagem: ${name}`, {});
        };

        const handleButtonClick = (message) => {
            toast.info(message, {
                position: "top-right",
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
            <div className={styles.navControls}>
                <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className={styles.buttonNav}
                >
                    Página Anterior
                </button>
                <button
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                className={styles.buttonNav}
                >
                    Próxima Página
                </button>
            </div>
            {notFound && (
                <h1 className={styles.notFound}>Nenhum personagem identificado. Tente novamente.</h1>
            )}
            {loading ? (
                <div className={`${styles.loaderWrapper} ${loading ? "" : styles.hidden}`}>
                    <Loader />
                </div>
            ) : (
            <div className={styles.grid}>
                {characters.map((char) => (
                <CharacterCard key={char.id} character={char} onClick={() => handleCardClick(char.name)} />
                ))}
            </div>
            )}
        </div>
    );
}