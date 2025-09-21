"use client";

import Image from "next/image";

import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";

import { Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/thumbs";
import "swiper/css/pagination";

SwiperCore.use([Pagination]);

import styles from "../styles/Auth.module.css";

interface PlayersSliderProps {
    sectionTitle?: string;
    favoriteMode?: boolean;
    favoriteVideos?: number[];
}

export default function PlayersSlider({ sectionTitle = "" }: PlayersSliderProps) {
    const filteredVideos = [1, 2, 3, 4, 5, 6, 7, 8];

    return (
        <>
            <h2 className={styles.redTitle}>{sectionTitle}</h2>
            <Swiper
                spaceBetween={6}
                loop={true}
                slidesPerView={"auto"}
                pagination={{ clickable: true }}
                className={styles.playerSlider}>
                {filteredVideos.map((video) => (
                    <SwiperSlide key={video} className={styles.playerSlide}>
                        <Image
                            src="/img/player.png"
                            className={styles.playerSlideImg}
                            alt="Player"
                            width={404}
                            height={404}
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
        </>
    );
}
