const translations = {
  en: {
    title: "Kolekta - Wisdom for Community and Tradition",
    logo: "Wisdom for Community & Tradition",
    login: "Login",
    signup: "Sign Up",
    searchTitle: "Looking for a nearby synagogue?",
    searchDesc: "Enter your location or community name:",
    searchPlaceholder: "Enter your location or community name",
    appsTitle: "Want to stay connected?",
    appsDesc: "Download our mobile app:",
    featuresTitle: "What can you do with the system?",
    feature1: "Get prayer times and community activities",
    feature2: "Register, donate, send announcements",
    feature3: "Manage aliyot, Torah scrolls, community members",
    ctaTitle: "New here?",
    join: "Want to join a community",
    create: "Community admin – open a community",
  },
  he: {
    title: "קולקטה - בינה לקהילה ומסורת",
    logo: "בינה לקהילה ומסורת",
    login: "התחברות",
    signup: "הרשמה",
    searchTitle: "מחפשים בית כנסת קרוב?",
    searchDesc: "הכנס את המיקום שלך או שם קהילה:",
    searchPlaceholder: "הכנס את המיקום שלך או שם קהילה",
    appsTitle: "רוצה להישאר מחובר?",
    appsDesc: "הורד את האפליקציה שלנו לסלולרי:",
    featuresTitle: "מה אפשר לעשות עם המערכת?",
    feature1: "לקבל זמני תפילה ופעילויות בקהילה",
    feature2: "להירשם, לתרום, להודיע הודעות",
    feature3: "לנהל עליות, ספרי תורה, חברים בקהילה",
    ctaTitle: "חדש כאן?",
    join: "רוצה להצטרף לקהילה",
    create: "מנהל קהילה – פתח קהילה",
  },
};

function applyTranslations(lang) {
  const t = translations[lang];
  if (!t) return;
  document.title = t.title;
  document.getElementById("logo").innerText = t.logo;
  document.getElementById("btnLogin").innerText = t.login;
  document.getElementById("btnSignup").innerText = t.signup;
  document.getElementById("searchTitle").innerText = t.searchTitle;
  document.getElementById("searchDesc").innerText = t.searchDesc;
  document.getElementById("searchInput").placeholder = t.searchPlaceholder;
  document.getElementById("appsTitle").innerText = t.appsTitle;
  document.getElementById("appsDesc").innerText = t.appsDesc;
  document.getElementById("featuresTitle").innerText = t.featuresTitle;
  document.getElementById("feature1").innerText = t.feature1;
  document.getElementById("feature2").innerText = t.feature2;
  document.getElementById("feature3").innerText = t.feature3;
  document.getElementById("ctaTitle").innerText = t.ctaTitle;
  document.getElementById("btnJoin").innerText = t.join;
  document.getElementById("btnCreate").innerText = t.create;
}

function setLanguage(lang) {
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "en" ? "ltr" : "rtl";
  applyTranslations(lang);
}

document.getElementById("langSwitcher").addEventListener("change", function () {
  setLanguage(this.value);
});

// Initialize with current document language
setLanguage(document.documentElement.lang || "he");
