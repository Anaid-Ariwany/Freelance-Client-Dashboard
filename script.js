/* Theme Toggle functions */
const toggleBtn = document.getElementById('theme-toggle');
const themeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

function getStoredThemePreference() {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark' || savedTheme === 'light' || savedTheme === 'auto'
        ? savedTheme
        : 'auto';
}

function getResolvedTheme(preference = getStoredThemePreference()) {
    if (preference === 'dark') return 'dark';
    if (preference === 'light') return 'light';
    return themeMediaQuery.matches ? 'dark' : 'light';
}

function updateIcon() {
    if (!toggleBtn) return;

    const preference = getStoredThemePreference();
    const resolvedTheme = getResolvedTheme(preference);

    if (preference === 'auto') {
        toggleBtn.textContent = resolvedTheme === 'dark' ? 'Auto: Dark' : 'Auto: Light';
        return;
    }

    toggleBtn.textContent = resolvedTheme === 'dark' ? 'Light mode' : 'Dark mode';
}

function applyThemePreference(preference = getStoredThemePreference()) {
    document.documentElement.classList.toggle('dark', getResolvedTheme(preference) === 'dark');
    updateIcon();
}

window.applyThemePreference = applyThemePreference;

applyThemePreference();

if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
        const nextPreference = getResolvedTheme() === 'dark' ? 'light' : 'dark';
        localStorage.setItem('theme', nextPreference);
        applyThemePreference(nextPreference);
    });
}

if (typeof themeMediaQuery.addEventListener === 'function') {
    themeMediaQuery.addEventListener('change', () => {
        if (getStoredThemePreference() === 'auto') {
            applyThemePreference('auto');
        }
    });
} else if (typeof themeMediaQuery.addListener === 'function') {
    themeMediaQuery.addListener(() => {
        if (getStoredThemePreference() === 'auto') {
            applyThemePreference('auto');
        }
    });
}

window.addEventListener('storage', (event) => {
    if (event.key === 'theme') {
        applyThemePreference(getStoredThemePreference());
    }
});


/* client form modal */
const addClientBtn = document.querySelector('.addClientButton');
const clientModal = document.querySelector('#clientFormModal');

if (addClientBtn && clientModal) {
    addClientBtn.addEventListener('shown.bs.modal', () => {
        clientModal.focus();
    });
}


/* project form modal */
const addProjectBtn = document.querySelector('.addProjectButton');
const projectModal = document.querySelector('#projectFormModal');

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
        opt.textContent = client.company ? `${client.name} - ${client.company}` : client.name;
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
