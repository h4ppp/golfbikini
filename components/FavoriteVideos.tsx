"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { useVideos } from "../lib/useVideos";
import "swiper/css";
import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
import styles from "../styles/FavoriteVideos.module.css";
//import VimeoCustomPlayer from "@/components/VimeoCustomPlayer";

SwiperCore.use([]);

export default function FavoriteVideos() {
    const { data: videos = [] } = useVideos();
    const [thumbsSwiper, setThumbsSwiper] = useState<SwiperCore | null>(null);
    const [mainSwiper, setMainSwiper] = useState<SwiperCore | null>(null);
    const [favorites, setFavorites] = useState<number[]>([]);
    const [loadingIds, setLoadingIds] = useState<number[]>([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [playingVideoId, setPlayingVideoId] = useState<number | null>(null);
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        (Fancybox.bind as any)("[data-fancybox]", {
            toolbar: false,
            video: { autoStart: true },
        });
        return () => {
            Fancybox.destroy();
        };
    }, []);

    useEffect(() => {
        if (typeof window !== "undefined" && pathname === "/video" && mainSwiper) {
            const indexParam = searchParams.get("index");
            if (indexParam) {
                const idx = parseInt(indexParam, 10);
                if (!isNaN(idx)) {
                    mainSwiper.slideToLoop(idx);
                }
            }
        }
    }, [pathname, searchParams, mainSwiper]);

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

    const toggleFavorite = async (videoId: number) => {
        setFavorites((prev) =>
            prev.includes(videoId) ? prev.filter((id) => id !== videoId) : [...prev, videoId],
        );
        setLoadingIds((prev) => [...prev, videoId]);
        try {
            const res = await fetch("/api/favorites", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ videoId }),
                credentials: "include",
            });
            if (res.status === 401) {
                router.push("/sign-in");
                return;
            }
        } catch (err) {
            console.error("toggleFavorite error:", err);
        } finally {
            setLoadingIds((prev) => prev.filter((id) => id !== videoId));
        }
    };

    return (
        <section className={styles.section}>
            <div className="container">
                <div className={styles.flex}>
                    <h2 className={styles.title}>Videos</h2>
                    <Image
                        src="/img/video-title.png"
                        className={styles.desktop}
                        alt="Videos"
                        width={983}
                        height={151}
                    />
                    <Image
                        src="/img/video-mobile.png"
                        className={styles.mobile}
                        alt="Videos"
                        width={346}
                        height={99}
                    />
                </div>
                <Swiper
                    onSwiper={setThumbsSwiper}
                    spaceBetween={6}
                    slidesPerView={"auto"}
                    loop={false}
                    className={styles.thumbsSlider}>
                    {videos.map((video, index) => (
                        <SwiperSlide
                            key={video.id}
                            className={`${styles.thumbSlide} ${
                                index === activeIndex ? "active" : ""
                            }`}
                            onClick={() => {
                                if (pathname !== "/video") {
                                    router.push(`/video?index=${index}`);
                                } else {
                                    mainSwiper?.slideToLoop(index);
                                }
                            }}>
                            <div className={styles.thumbItem}>
                                <img
                                    src={video.acf.thumb}
                                    className={styles.icon}
                                    alt={video.title.rendered}
                                    width={339}
                                    height={185}
                                />
                                <p>{video.acf.tab}</p>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>

                <Swiper
                    onSwiper={setMainSwiper}
                    spaceBetween={10}
                    loop={false}
                    navigation
                    speed={0}
                    thumbs={thumbsSwiper ? { swiper: thumbsSwiper } : undefined}
                    className={styles.mainSlider}
                    onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}>
                    {videos.map((video) => {
                        const isFavorite = favorites.includes(video.id);
                        const isLoading = loadingIds.includes(video.id);
                        return (
                            <SwiperSlide key={video.id} className={styles.mainSlide}>
                                {playingVideoId === video.id ? (
                                    <video
                                        src={video.acf.video}
                                        controls
                                        autoPlay
                                        className={styles.videoPlayer}
                                        width="100%"
                                        height="100%"
                                    />
                                ) : null}
                                {/*{playingVideoId === video.id ? (
                                    <div dangerouslySetInnerHTML={{ __html: video.acf.video }} />
                                ) : null}*/}
                                <div className={styles.mainSlideItem}>
                                    <img
                                        src={video.acf.bg}
                                        className={styles.mainItemImg}
                                        alt={video.title.rendered}
                                        width={1721}
                                        height={703}
                                    />
                                    <div className={styles.mainItemWrapper}>
                                        <div className={styles.mainItemBox}>
                                            <p className={styles.category}>{video.acf.cat}</p>
                                            <h3 className={styles.videoTitle}>
                                                {video.title.rendered}
                                            </h3>
                                            <p
                                                className={styles.description}
                                                dangerouslySetInnerHTML={{ __html: video.acf.text }}
                                            />
                                            <div
                                                className={styles.playButton}
                                                onClick={() => setPlayingVideoId(video.id)}></div>
                                        </div>
                                    </div>
                                    <div
                                        className={`${styles.btnFavorite} ${
                                            isFavorite ? styles.active : ""
                                        } ${isLoading ? styles.disabled : ""}`}
                                        onClick={() => {
                                            setPlayingVideoId(video.id);
                                        }}></div>
                                </div>
                            </SwiperSlide>
                        );
                    })}
                </Swiper>
            </div>
        </section>
    );
}
