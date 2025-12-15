export const db = mysql.createPool({
    host: process.env.DB_HOST,
});

const API_URL = `https://${host}/api/db.php`; // путь к PHP endpoint

// Проверка подключения
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

// Получение пользователя по email
export async function getUserByEmail(email) {
  const res = await fetch(`${API_URL}?action=getUser&email=${encodeURIComponent(email)}`);
  const data = await res.json();
  return data.user || null;
}

