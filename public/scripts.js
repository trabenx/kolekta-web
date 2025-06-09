const translations = {
  en: {
    title: "Kolekta - Wisdom for Community and Tradition",
    selectedCommunityLabel: "Selected community:",
    navHome: "Home",
    navAliyot: "Aliyot",
    navMessages: "Messages",
    navClasses: "Classes",
    navPayments: "Payments",
    navTorah: "Sifrei Torah",
    welcomeMain: "\u2714 Welcome Yossi, you are a Gabai in \"Ahavat Hesed\"",
    welcomeSecondary: "\uD83D\uDED0 You are also a member of: \"Tiferet Moshe\" (regular user)",
    btnSwitchCommunity: "Switch community \u27A5",
    todayServicesTitle: "Today's Services",
    serviceShacharit: "Shacharit: 06:30",
    serviceMincha: "Mincha: 18:40",
    aliyotTitle: "Aliyot for Shabbat",
    aliyotMaftir: "Maftir: Not assigned",
    editAliyot: "Edit \u27A5",
    aliyotHaftara: "Haftarah: Cohen",
    messagesTitle: "Community Messages",
    msg1: "Board meeting Tuesday",
    msg2: "Singing night Thursday",
    classesTitle: "This Week's Classes",
    class1: "Daily Halacha at 19:00",
    class2: "Daf Yomi at 20:15",
    paymentTitle: "Payment Status",
    paymentDebt: "Debt: annual membership",
    paymentLast: "Last payment: Nissan",
    torahTitle: "Sifrei Torah",
    torah1: "Torah Cohen: in the synagogue",
    torah2: "Torah Levi: loaned to Holon"
  },
  he: {
    title: "קולקטה - בינה לקהילה ומסורת",
    selectedCommunityLabel: "קהילה נבחרת:",
    navHome: "בית",
    navAliyot: "עליות",
    navMessages: "הודעות",
    navClasses: "שיעורים",
    navPayments: "תשלומים",
    navTorah: "ספרי תורה",
    welcomeMain: "✔ ברוך הבא יוסי, אתה גבאי ב\"אהבת חסד\"",
    welcomeSecondary: "🕍 אתה גם חבר ב: \"תפארת משה\" (משתמש רגיל)",
    btnSwitchCommunity: "החלפת קהילה ⮕",
    todayServicesTitle: "שירותי היום",
    serviceShacharit: "שחרית: 06:30",
    serviceMincha: "מנחה: 18:40",
    aliyotTitle: "עליות לשבת",
    aliyotMaftir: "מפטיר: לא הוקצה",
    editAliyot: "עריכה ⮕",
    aliyotHaftara: "הפטרה: כהן",
    messagesTitle: "הודעות קהילה",
    msg1: "פגישת ועד ביום שלישי",
    msg2: "ערב שירה בחמישי",
    classesTitle: "השיעורים השבוע",
    class1: "הלכה יומית ב-19:00",
    class2: "דף יומי ב-20:15",
    paymentTitle: "סטטוס תשלומים",
    paymentDebt: "חוב: דמי חבר שנתיים",
    paymentLast: "תשלום אחרון: ניסן",
    torahTitle: "ספרי תורה",
    torah1: "תורה כהן: בבית הכנסת",
    torah2: "תורה לוי: הושאל לחולון"
  }
};

function applyTranslations(lang) {
  const t = translations[lang];
  if (!t) return;
  document.title = t.title;
  document.getElementById("selectedCommunityLabel").innerText = t.selectedCommunityLabel;
  document.getElementById("navHome").innerText = t.navHome;
  document.getElementById("navAliyot").innerText = t.navAliyot;
  document.getElementById("navMessages").innerText = t.navMessages;
  document.getElementById("navClasses").innerText = t.navClasses;
  document.getElementById("navPayments").innerText = t.navPayments;
  document.getElementById("navTorah").innerText = t.navTorah;
  document.getElementById("welcomeMain").innerText = t.welcomeMain;
  document.getElementById("welcomeSecondary").innerText = t.welcomeSecondary;
  document.getElementById("btnSwitchCommunity").innerText = t.btnSwitchCommunity;
  document.getElementById("todayServicesTitle").innerText = t.todayServicesTitle;
  document.getElementById("serviceShacharit").innerText = t.serviceShacharit;
  document.getElementById("serviceMincha").innerText = t.serviceMincha;
  document.getElementById("aliyotTitle").innerText = t.aliyotTitle;
  document.getElementById("aliyotMaftir").childNodes[0].nodeValue = t.aliyotMaftir + " ";
  document.getElementById("editAliyot").innerText = t.editAliyot;
  document.getElementById("aliyotHaftara").innerText = t.aliyotHaftara;
  document.getElementById("messagesTitle").innerText = t.messagesTitle;
  document.getElementById("msg1").innerText = t.msg1;
  document.getElementById("msg2").innerText = t.msg2;
  document.getElementById("classesTitle").innerText = t.classesTitle;
  document.getElementById("class1").innerText = t.class1;
  document.getElementById("class2").innerText = t.class2;
  document.getElementById("paymentTitle").innerText = t.paymentTitle;
  document.getElementById("paymentDebt").innerText = t.paymentDebt;
  document.getElementById("paymentLast").innerText = t.paymentLast;
  document.getElementById("torahTitle").innerText = t.torahTitle;
  document.getElementById("torah1").innerText = t.torah1;
  document.getElementById("torah2").innerText = t.torah2;
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
