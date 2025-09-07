"use client";

import { useEffect, useState } from "react";

export default function TestDBPage() {
    const [logs, setLogs] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchDB() {
            try {
                const res = await fetch("/api/test-db");
                const data = await res.json();
                if (data.logs) setLogs(data.logs);
            } catch (err: any) {
                setLogs([err.message || "Unknown error"]);
            } finally {
                setLoading(false);
            }
        }

        fetchDB();
    }, []);

    return (
        <div style={{ padding: 20, fontFamily: "monospace" }}>
            <h1>Тест подключения к базе</h1>
            {loading ? <p>Загрузка...</p> : null}
            <div style={{ background: "#eee", padding: 10, borderRadius: 5 }}>
                {logs.map((log, i) => (
                    <div key={i}>{log}</div>
                ))}
            </div>
        </div>
    );
}
