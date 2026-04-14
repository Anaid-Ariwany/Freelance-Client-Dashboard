/* Theme Toggle functions */
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


/* client form modal */
const addClientBtn = document.querySelector(".addClientButton");
const clientModal = document.querySelector("#clientFormModal");

addClientBtn.addEventListener('shown.bs.modal', () => {
    clientModal.focus();
});

/* 
const myModal = document.getElementById('myModal')
const myInput = document.getElementById('myInput')

myModal.addEventListener('shown.bs.modal', () => {
  myInput.focus()
})
*/




