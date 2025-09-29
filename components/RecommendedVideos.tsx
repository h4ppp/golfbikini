"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { useVideos } from "../lib/useVideos";

import { Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/thumbs";
import "swiper/css/pagination";

import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";

import styles from "../styles/FavoriteVideos.module.css";

SwiperCore.use([Pagination]);

interface RecommendedVideosProps {
    sectionTitle?: string;
    favoriteMode?: boolean;
    favoriteVideos?: number[];
}

export default function RecommendedVideos({
    sectionTitle = "",
    favoriteMode = false,
    favoriteVideos = [],
}: RecommendedVideosProps) {
    const { data: videos = [] } = useVideos();
    const [favorites, setFavorites] = useState<number[]>([]);
    const [playingVideoId, setPlayingVideoId] = useState<number | null>(null);
    const router = useRouter();

    // Fancybox init
    useEffect(() => {
        if (typeof window !== "undefined") {
            (Fancybox.bind as any)("[data-fancybox]", {
                Toolbar: { display: ["close"] },
                video: { autoStart: true },
            });
        }
        return () => {
            try {
                Fancybox.destroy();
            } catch {}
        };
    }, []);

    // Получаем избранное при монтировании
    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const res = await fetch("/api/favorites", {
                    method: "GET",
                    credentials: "include",
                });
                if (res.ok) {
                    const data = await res.json();
                    setFavorites(data.favorites || []);
                }
            } catch (err) {
                console.error("fetchFavorites error:", err);
            }
        };
        fetchFavorites();
    }, []);

    // Простой toggle
    const toggleFavorite = async (videoId: number) => {
        // Сразу локально переключаем
        setFavorites((prev) =>
            prev.includes(videoId) ? prev.filter((id) => id !== videoId) : [...prev, videoId],
        );

        // Потом вызываем сервер, просто сохраняем
        try {
            const res = await fetch("/api/favorites", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ videoId }), // обязательно число
                credentials: "include",
            });

            if (res.status === 401) {
                router.push("/sign-in");
            }
        } catch (err) {
            console.error("toggleFavorite error:", err);
        }
    };

    const filteredVideos = videos.filter((video) => {
        const checkbox = (video as any)?.acf?.rec?.[0] ?? null;

        if (favoriteMode) {
            if (!favoriteVideos || favoriteVideos.length === 0) return false;
            return favoriteVideos.includes(video.id);
        } else {
            return checkbox === "yes";
        }
    });

    if (filteredVideos.length === 0) return null;

    return (
        <section className={styles.rec}>
            <div className="container">
                <h2 className={styles.redTitle}>{sectionTitle}</h2>
                <Swiper
                    spaceBetween={10}
                    loop={true}
                    slidesPerView={"auto"}
                    pagination={{ clickable: true }}
                    className={styles.recSlider}>
                    {filteredVideos.map((video) => {
                        const isFavorite = favorites.includes(video.id);

                        return (
                            <SwiperSlide key={video.id} className={styles.recSlide}>
                                {/*{playingVideoId === video.id ? (
                                    <video
                                        src={video.acf.video}
                                        controls
                                        autoPlay
                                        className={styles.videoPlayer}
                                        width="100%"
                                        height="100%"
                                    />
                                ) : null}*/}

                                {playingVideoId === video.id ? (
                                    <div dangerouslySetInnerHTML={{ __html: video.acf.video }} />
                                ) : null}

                                <div className={styles.recSliderItem}>
                                    <img
                                        src={video.acf.bg}
                                        className={styles.recSliderImg}
                                        alt={video.title.rendered}
                                        width={684}
                                        height={404}
                                    />
                                    <div className={styles.recSliderWrapper}>
                                        <div className={styles.recSliderBox}>
                                            <h3 className={styles.recSliderTitle}>
                                                {video.title.rendered}
                                            </h3>
                                            <p
                                                className={styles.recSliderDesc}
                                                dangerouslySetInnerHTML={{ __html: video.acf.text }}
                                            />
                                        </div>

                                        <div
                                            className={styles.playButton}
                                            onClick={() => setPlayingVideoId(video.id)}
                                        />
                                    </div>

                                    <div
                                        className={`${styles.btnFavorite} ${
                                            isFavorite ? styles.active : ""
                                        }`}
                                        onClick={() => toggleFavorite(video.id)}
                                    />
                                </div>
                            </SwiperSlide>
                        );
                    })}
                </Swiper>
            </div>
        </section>
    );
}
