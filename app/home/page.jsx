"use client";

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import styles from "./Home.module.css";
import CharacterCard from "../../components/CharacterCard";
import Loader from "../../components/Loader";

export default function Home() {
    const [characters, setCharacters] = useState([]);
    const [notFound, setNotFound] = useState(false);
    const [loading, setLoading] = useState(true);

    const cacheRef = useRef(new Map());

        const fetchCharacters = async (name = "", pageNumber = 1) => {
            setLoading(true);
            const cache = cacheRef.current;
            const cacheKey = `${name}_${pageNumber}`;
            const nextPageNumber = pageNumber + 1;
            const nextCacheKey = `${name}_${nextPageNumber}`;
            
            const cleanCacheIfNeeded = () => {
                while (cache.size >= 5) {
                    const firstKey = cache.keys().next().value;
                    cache.delete(firstKey);
                    console.log(`♻ Removido do cache: ${firstKey}`);
                }
            };

            console.log("🔍 Verificando cache...");
            console.log(`📊 Cache anterior: ${cache.size} páginas.`);

            let total = totalPages;

            if (cache.has(cacheKey)) {
                const cached = cache.get(cacheKey);
                setCharacters(cached.results);
                setTotalPages(cached.totalPages);
                total = cached.totalPages;
                setNotFound(false);
                setLoading(false);
                console.log(`✅ Cache encontrado: ${cacheKey}`);
            } else {
                try {
                    const { data } = await axios.get(`https://rickandmortyapi.com/api/character/?page=${pageNumber}&name=${name}`);
                    cleanCacheIfNeeded();
                    cache.set(cacheKey, {
                    results: data.results,
                    totalPages: data.info.pages,
                    });
                    setCharacters(data.results);
                    setTotalPages(data.info.pages);
                    total = data.info.pages;
                    setNotFound(false);
                    console.log(`💾 Cache salvo: ${cacheKey}`);
                } catch {
                    setNotFound(true);
                    setCharacters([]);
                } finally {
                    setLoading(false);
                }
            }

            if (nextPageNumber <= total && !cache.has(nextCacheKey)) {
                try {
                    const res = await axios.get(`https://rickandmortyapi.com/api/character/?page=${pageNumber}&name=${name}`);
                    cleanCacheIfNeeded();
                    cache.set(nextCacheKey, {
                        results: res.data.results,
                        totalPages: res.data.info.pages,
                    });
                    console.log(`📋 Prefetch salvo: ${nextCacheKey}`);
                } catch (err) {
                    console.error(`❌ Prefetch falhou: ${nextCacheKey}`, err);
                }
            } else {
                console.log(`ℹ Prefetch ignorado: já no cache ou fora do limite.`);
            }

            console.log(`📦 Cache final: ${cache.size} páginas.`);
            for (const [key, val] of cache.entries()) {
                console.log(`📦 ${key} - ${val.results.length} personagens.`);
            }

            console.log(`📊 Total de páginas: ${total}`);
        };

        useEffect(() => {
            fetchCharacters();
        }, []);

        const [search, setSearch] = useState("");

        const handleSearch = () => {
            setPage(1);
            fetchCharacters(search, 1);
        };

        const handleReset = () => {
            setSearch("");
            setPage(1);
            fetchCharacters("", 1);
            toast.success("Busca resetada!", {
                position: "top-right",
            });
        };

        const handleCardClick = (char) => {
            toast.info(`Você clicou no personagem: ${char.name}`);
        };

        const [page, setPage] = useState(1);
        const [totalPages, setTotalPages] = useState(1);

        useEffect(() => {
            fetchCharacters(search, page);
        }, [page]);

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
                onClick={handleSearch}>Buscar</button>
                <button 
                className={styles.buttonReset} 
                onClick={handleReset}>Resetar</button>
            </div>

            <div className={styles.navControls}>
                <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1 || notFound}
                className={styles.buttonNav}
                >
                    Página Anterior
                </button>

                <span className={styles.pageInfo}>
                    Página {page} de {totalPages}
                </span>

                <button
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages || notFound}
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