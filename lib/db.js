import mysql from "mysql2/promise";

export const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
});

export async function checkDBConnection() {
    try {
        //console.log("🔹 Проверка соединения с базой...");
        const connection = await db.getConnection();
        //console.log("✅ Подключение установлено");

        const [rows] = await db.query("SELECT NOW() as now");
        //console.log("🕒 Время сервера MySQL:", rows[0].now);

        connection.release();
        return { success: true, logs: ["Подключение успешно", `Время MySQL: ${rows[0].now}`] };
    } catch (error) {
        console.error("❌ Ошибка подключения:", error);
        return { success: false, logs: [error.message, JSON.stringify(error, null, 2)] };
    }
}

export async function getUserByEmail(email) {
    const [rows] = await db.query(
        "SELECT email, first_name, second_name FROM users WHERE email = ? LIMIT 1",
        [email],
    );
    return rows[0] || null;
}
