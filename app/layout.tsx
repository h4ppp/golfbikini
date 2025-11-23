import "../styles/globals.css";
import ReactQueryProvider from "../lib/ReactQueryProvider";

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
            <body>
                <div className="page-wrapper">
                    <ReactQueryProvider>{children}</ReactQueryProvider>
                </div>
            </body>
        </html>
    );
}
