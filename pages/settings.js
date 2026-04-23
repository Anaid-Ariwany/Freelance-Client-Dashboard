const themeForm = document.getElementById('themeSettingsForm');
const cancelThemeBtn = document.getElementById('themeCancelBtn');
const themeInputs = Array.from(document.querySelectorAll('input[name="themePreference"]'));

function getSettingsThemePreference() {
    const saved = localStorage.getItem('theme');
    return saved === 'light' || saved === 'dark' || saved === 'auto' ? saved : 'auto';
}

function syncThemeSelection(preference = getSettingsThemePreference()) {
    themeInputs.forEach((input) => {
        input.checked = input.value === preference;
    });
}

if (themeForm && themeInputs.length) {
    syncThemeSelection();

    cancelThemeBtn?.addEventListener('click', () => {
        syncThemeSelection();
    });

    themeForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const selected = themeInputs.find((input) => input.checked)?.value || 'auto';
        localStorage.setItem('theme', selected);

        if (typeof window.applyThemePreference === 'function') {
            window.applyThemePreference(selected);
        }

        syncThemeSelection(selected);
    });

    window.addEventListener('storage', (event) => {
        if (event.key === 'theme') {
            syncThemeSelection(getSettingsThemePreference());
        }
    });
}
