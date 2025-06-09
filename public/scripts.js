document.getElementById("langSwitcher").addEventListener("change", function () {
  const lang = this.value;
  if (lang === "en") {
    document.documentElement.lang = "en";
    document.documentElement.dir = "ltr";
    alert("שפה באנגלית עדיין לא זמינה – coming soon");
  } else {
    document.documentElement.lang = "he";
    document.documentElement.dir = "rtl";
  }
});
