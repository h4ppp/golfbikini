const host = process.env.DB_HOST?.replace(/\/+$/, "");
const API_URL = `https://${host}/api/db.php`; 

export const db = {
  async query(sql, params = []) {
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sql, params }),
      });

      const data = await res.json();

      if (!data.success) throw new Error(data.error || "DB query failed");

      return [data.result];
    } catch (error) {
      console.error("❌ Ошибка при запросе к PHP API:", error);
      throw error;
    }
  },
};

export async function checkDBConnection() {
  try {
    const res = await fetch(`${API_URL}?action=ping`);
    const data = await res.json();
    return { success: data.success, logs: [data.message] };
  } catch (error) {
    console.error("❌ Ошибка подключения:", error);
    return { success: false, logs: [error.message] };
  }
}

export async function getUserByEmail(email) {
  const [rows] = await db.query(
    "SELECT email, first_name, second_name FROM users WHERE email = ?",
    [email]
  );
  return rows[0] || null;
}
