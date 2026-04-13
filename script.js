const toggleBtn = document.getElementById("theme-toggle");
const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
    document.documentElement.classList.add("dark");
} else if (savedTheme === "light") {
    document.documentElement.classList.remove("dark");
} else {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.classList.toggle("dark", prefersDark);
}

function updateIcon() {
    toggleBtn.textContent = document.documentElement.classList.contains("dark")
        ? "☀️"
        : "🌙";
}

updateIcon();

toggleBtn.addEventListener("click", () => {
    const isDark = document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    updateIcon();
});