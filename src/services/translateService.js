// const API_URL = "http://localhost:5000/translate";

// export async function translateText(text, targetLang) {
//   if (!text || targetLang === "en") return text;

//   try {
//     const res = await fetch(API_URL, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         q: text,
//         source: "en",
//         target: targetLang,
//         format: "text",
//       }),
//     });

//     const data = await res.json();
//     return data.translatedText || text;
//   } catch (err) {
//     console.error("Translation failed:", err);
//     return text;
//   }
// }

const API_URL = import.meta.env.VITE_TRANSLATE_API;

export async function translateText(text, targetLang) {
  if (!text || targetLang === "en") return text;

  try {
    const res = await fetch(`${API_URL}/translate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        q: text,
        source: "en",
        target: targetLang,
        format: "text",
      }),
    });

    const data = await res.json();
    return data.translatedText || text;
  } catch (err) {
    console.error("Translation failed:", err);
    return text;
  }
}

