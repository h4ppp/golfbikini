import "../styles/globals.css";
import ReactQueryProvider from "../lib/ReactQueryProvider";
import Script from "next/script";

export const metadata = {
    title: "Bikini Golf",
    description:
        "Golf Has Never Looked Like This,Tropical courses. Bikini-clad golfers with serious skills. Each episode delivers beauty, competition, and unforgettable moments. Welcome to Bikini Golf — where ...",

    icons: {
        icon: "/img/favicon.svg",
        shortcut: "/img/favicon.svg",
        apple: "/img/favicon.svg",
    },

    openGraph: {
        title: "Bikini Golf",
        description:
            "Golf Has Never Looked Like This,Tropical courses. Bikini-clad golfers with serious skills. Each episode delivers beauty, competition, and unforgettable moments. Welcome to Bikini Golf — where ...",
        url: "https://www.bikinigolfofficial.com",
        siteName: "Bikini Golf",
        type: "website",
        images: [
            {
                url: "/img/og.png",
                width: 1200,
                height: 630,
                alt: "Bikini Golf Preview",
            }
        ],
    },

    twitter: {
        card: "summary_large_image",
        title: "Bikini Golf",
        description:
            "Golf Has Never Looked Like This,Tropical courses. Bikini-clad golfers with serious skills. Each episode delivers beauty, competition, and unforgettable moments. Welcome to Bikini Golf — where ...",
        images: ["/img/og.png"],
    },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <head>
                {/* ---------------- GOOGLE TAG MANAGER ---------------- */}
                <Script id="gtm-head" strategy="afterInteractive">
                    {`
                        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                        })(window,document,'script','dataLayer','GTM-WNKRLV99');
                    `}
                </Script>

                {/* ---------------- GOOGLE ANALYTICS ---------------- */}
                <Script
                    src="https://www.googletagmanager.com/gtag/js?id=G-VB4R1JD8YS"
                    strategy="afterInteractive"
                />
                <Script id="ga-tag" strategy="afterInteractive">
                    {`
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', 'G-VB4R1JD8YS');
                    `}
                </Script>

                {/* ---------------- YANDEX METRIKA ---------------- */}
                <Script id="yandex-metrika" strategy="afterInteractive">
                    {`
                        (function(m,e,t,r,i,k,a){
                            m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
                            m[i].l=1*new Date();
                            for (var j = 0; j < document.scripts.length; j++) {
                                if (document.scripts[j].src === r) { return; }
                            }
                            k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
                        })(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=105506660', 'ym');

                        ym(105506660, 'init', {ssr:true, webvisor:true, clickmap:true, ecommerce:"dataLayer", accurateTrackBounce:true, trackLinks:true});
                    `}
                </Script>
            </head>

            <body>
                {/* ------------ GOOGLE TAG MANAGER (noscript) ------------ */}
                <noscript>
                    <iframe
                        src="https://www.googletagmanager.com/ns.html?id=GTM-WNKRLV99"
                        height="0"
                        width="0"
                        style={{ display: "none", visibility: "hidden" }}
                    ></iframe>
                </noscript>

                {/* ------------ YANDEX METRIKA (noscript) ------------ */}
                <noscript>
                    <div>
                        <img
                            src="https://mc.yandex.ru/watch/105506660"
                            style={{ position: "absolute", left: "-9999px" }}
                            alt=""
                        />
                    </div>
                </noscript>

                <div className="page-wrapper">
                    <ReactQueryProvider>{children}</ReactQueryProvider>
                </div>
            </body>
        </html>
    );
}