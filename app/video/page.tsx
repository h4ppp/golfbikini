"use client"; // делаем всю страницу клиентской

import dynamic from "next/dynamic";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import styles from "../../styles/Video.module.css";

// Динамический импорт FavoriteVideos без SSR
const FavoriteVideos = dynamic(() => import("../../components/FavoriteVideos"), { ssr: false });

const RecommendedVideos = dynamic(() => import("../../components/RecommendedVideos"), {
    ssr: false,
});

export default function VideoPage() {
    return (
        <>
            <Header />
            <section className={styles.video}>
                <div className="container">
                    <div className={styles.wrapper}>
                        <h1 className={styles.title}>
                            Golf Has Never <span>Looked Like This</span>
                        </h1>
                        <div className={styles.subtitle}>
                            In our footage, golf transforms into the aesthetics of an easy, carefree
                            life in the tropics.
                        </div>
                    </div>
                </div>
            </section>

            <section className="section"></section>

            <FavoriteVideos />

            <RecommendedVideos favoriteMode={false} sectionTitle="Recommended Video" />

            <Footer />
        </>
    );
}
