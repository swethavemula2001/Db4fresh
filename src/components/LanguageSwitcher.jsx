// // // import i18n from "i18next";

// // // export default function LanguageSwitcher() {
// // //   const changeLang = (lang) => {
// // //     i18n.changeLanguage(lang);
// // //     localStorage.setItem("lang", lang);
// // //   };

// // //   return (
// // //     <select onChange={(e) => changeLang(e.target.value)}>
// // //       <option value="en">English</option>
// // //       <option value="hi">हिंदी</option>
// // //     </select>
// // //   );
// // // }
// // import React, { useState, useEffect } from "react";

// // export default function LanguageSettings() {
// //   const [language, setLanguage] = useState(
// //     localStorage.getItem("app_language") || "en"
// //   );

// //   useEffect(() => {
// //     localStorage.setItem("app_language", language);
// //     window.location.reload(); // reload to apply language
// //   }, [language]);

// //   return (
// //     <div>
// //       <h3 style={{ marginBottom: "10px" }}>Language Preferences</h3>
// //       <p style={{ color: "#666", marginBottom: "20px" }}>
// //         Choose your preferred language
// //       </p>

// //       <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
// //         <label>
// //           <input
// //             type="radio"
// //             name="language"
// //             value="en"
// //             checked={language === "en"}
// //             onChange={() => setLanguage("en")}
// //           />
// //           English
// //         </label>

// //         <label>
// //           <input
// //             type="radio"
// //             name="language"
// //             value="te"
// //             checked={language === "te"}
// //             onChange={() => setLanguage("te")}
// //           />
// //           తెలుగు (Telugu)
// //         </label>

// //         <label>
// //           <input
// //             type="radio"
// //             name="language"
// //             value="hi"
// //             checked={language === "hi"}
// //             onChange={() => setLanguage("hi")}
// //           />
// //           हिंदी (Hindi)
// //         </label>

// //         <label>
// //           <input
// //             type="radio"
// //             name="language"
// //             value="ta"
// //             checked={language === "ta"}
// //             onChange={() => setLanguage("ta")}
// //           />
// //           தமிழ் (Tamil)
// //         </label>
// //       </div>
// //     </div>
// //   );
// // }

// import React, { useState } from "react";

// export default function LanguageSettings() {
//   const [language, setLanguage] = useState(
//     localStorage.getItem("app_language") || "en"
//   );

//   const changeLanguage = (lang) => {
//     setLanguage(lang);
//     localStorage.setItem("app_language", lang);
//   };

//   return (
//     <div>
//       <h3>Language Preferences</h3>
//       <p style={{ color: "#666", marginBottom: "16px" }}>
//         Choose your preferred language
//       </p>

//       <label>
//         <input
//           type="radio"
//           checked={language === "en"}
//           onChange={() => changeLanguage("en")}
//         />
//         English
//       </label>
//       <br />

//       <label>
//         <input
//           type="radio"
//           checked={language === "te"}
//           onChange={() => changeLanguage("te")}
//         />
//         తెలుగు
//       </label>
//       <br />

//       <label>
//         <input
//           type="radio"
//           checked={language === "hi"}
//           onChange={() => changeLanguage("hi")}
//         />
//         हिंदी
//       </label>
//     </div>
//   );
// }

import { useLanguage } from "../context/LanguageContext";

export default function LanguageSettings() {
  const { language, changeLanguage } = useLanguage();

  return (
    <div>
      <h3>Language Preferences</h3>
      <p style={{ color: "#666", marginBottom: "16px" }}>
        Choose your preferred language
      </p>

      {[
        ["en", "English"],
        ["te", "తెలుగు"],
        ["hi", "हिंदी"],
        ["ta", "தமிழ்"],
        ["kn", "ಕನ್ನಡ"],
        ["ml", "മലയാളം"],
      ].map(([code, label]) => (
        <label key={code} style={{ display: "block", marginBottom: 8 }}>
          <input
            type="radio"
            checked={language === code}
            onChange={() => changeLanguage(code)}
          />
          {" "}{label}
        </label>
      ))}
    </div>
  );
}
