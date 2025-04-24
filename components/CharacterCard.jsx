import Image from "next/image";
import styles from "../styles/CharacterCard.module.css";

export default function CharacterCard({ character, onClick }) {
    return (
        <div className={styles.card} onClick={onClick}>
            <Image 
            src={character.image}
            alt={character.name}
            width={255}
            height={125}
            className={styles.avatar}
            />
            <h3 className={styles.title}>{character.name}</h3>
            <p>{character.status}</p>
            <p>{character.species}</p>
            <p>{character.type || "Sem tipo"}</p>
            <p>{character.gender}</p>
            <p>{character.origin?.name}</p>
        </div>
    );
}