"use client";

import dynamic from "next/dynamic";
import HeroSection from "../components/HeroSection";
import FormSection from "../components/FormSection";
import AboutSection from "../components/AboutSection";
import EventsSection from "../components/EventsSection";
import FAQSection from "../components/FAQSection";
import Header from "../components/Header";
import Footer from "../components/Footer";

const FavoriteVideos = dynamic(() => import("../components/FavoriteVideos"), { ssr: false });

export default function HomePage() {
    return (
        <>
            <Header />
            <HeroSection />
            <FavoriteVideos />
            <FormSection />
            <AboutSection />
            <EventsSection />
            <FAQSection />
            <Footer />
        </>
    );
}
