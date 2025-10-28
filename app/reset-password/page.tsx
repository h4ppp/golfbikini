"use client";
export const dynamic = "force-dynamic";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import styles from "../../styles/Auth.module.css";

function ResetPasswordForm({ token }: { token: string }) {
    const router = useRouter();
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!password || !confirm) {
            setError("All fields are required.");
            return;
        }
        if (password !== confirm) {
            setError("Passwords do not match.");
            return;
        }

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/reset-password.php`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, password }),
            });

            const data = await res.json();

            if (data.success) {
                setSuccess("Password successfully updated.");
                setTimeout(() => router.push("/sign-in"), 2000);
            } else {
                setError(data.message || "Something went wrong. Try again.");
            }
        } catch (err) {
            setError("Server error. Please try later.");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="input-mb">
                <div className="input">
                    <div className="input-title">New Password*</div>
                    <div className="input-wrapper">
                        <div
                            className={`input-view ${showPassword ? "active" : ""}`}
                            onClick={() => setShowPassword(!showPassword)}
                        ></div>
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Create new password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="input">
                <div className="input-title">Confirm Password*</div>
                <div className="input-wrapper">
                    <div
                        className={`input-view ${showPassword ? "active" : ""}`}
                        onClick={() => setShowPassword(!showPassword)}
                    ></div>
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Re-enter your new password"
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                    />
                </div>
            </div>

            <div className={styles.btnMt}></div>
            <button type="submit" className="btn">
                <span>RESET PASSWORD</span>
            </button>

            {error && <div className="error">{error}</div>}
            {success && <div className="success">{success}</div>}
        </form>
    );
}

function TokenHandler() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const t = searchParams.get("token");
        if (!t) router.replace("/sign-in");
        else setToken(t);
    }, [searchParams, router]);

    if (!token) return null;
    return <ResetPasswordForm token={token} />;
}

export default function ResetPasswordPage() {
    return (
        <section className={styles.section}>
            <Suspense fallback={<div>Loading...</div>}>
                <div className="container">
                    <div className={styles.wrapper}>
                        <Link href="/" className={styles.logo}>
                            <Image src="/img/logo.svg" alt="Logo" width={177} height={68} />
                        </Link>

                        <h1 className={styles.title}>RESET PASSWORD</h1>
                        <p className={styles.subtitle}>
                            Create a new password for your account. <br />
                            Make sure it’s strong and easy to remember.
                        </p>

                        <TokenHandler />
                    </div>
                </div>
            </Suspense>
        </section>
    );
}
