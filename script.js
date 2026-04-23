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
    if (!toggleBtn) return;
    toggleBtn.textContent = document.documentElement.classList.contains("dark")
        ? "☀️"
        : "🌙";
}

updateIcon();

if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
        const isDark = document.documentElement.classList.toggle("dark");
        localStorage.setItem("theme", isDark ? "dark" : "light");
        updateIcon();
    });
}


/* client form modal */
const addClientBtn = document.querySelector(".addClientButton");
const clientModal = document.querySelector("#clientFormModal");

if (addClientBtn && clientModal) {
    addClientBtn.addEventListener('shown.bs.modal', () => {
        clientModal.focus();
    });
}


/* project form modal */
const addProjectBtn = document.querySelector(".addProjectButton");
const projectModal = document.querySelector("#projectFormModal");

function populateClientNameSelect() {
    const select = document.getElementById('clientNameSelect');
    if (!select) return;

    const clients =
        (typeof getClients === 'function' ? getClients()
            : (typeof getData === 'function' ? getData('clients') : [])) || [];

    const firstOption = select.querySelector('option[value=""]');
    select.innerHTML = '';
    if (firstOption) {
        select.appendChild(firstOption);
    } else {
        const opt = document.createElement('option');
        opt.value = '';
        opt.textContent = 'Select Client';
        select.appendChild(opt);
    }

    if (clients.length === 0) {
        select.disabled = true;
        const opt = document.createElement('option');
        opt.value = '';
        opt.textContent = 'No clients found';
        select.appendChild(opt);
        return;
    }

    select.disabled = false;
    clients.forEach((client) => {
        const opt = document.createElement('option');
        opt.value = client.id;
        opt.textContent = client.company ? `${client.name} — ${client.company}` : client.name;
        select.appendChild(opt);
    });
}

if (addProjectBtn && projectModal) {
    addProjectBtn.addEventListener('shown.bs.modal', () => {
        projectModal.focus();
        populateClientNameSelect();
    });
}

if (projectModal) {
    projectModal.addEventListener('show.bs.modal', populateClientNameSelect);
}

document.addEventListener('DOMContentLoaded', () => {
    populateClientNameSelect();
});






