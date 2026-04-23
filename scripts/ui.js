let clientToDelete = null;
let projectToDelete = null;

//function to render clients
function renderClients() {
    const clients = getData('clients');
    const clientList = document.getElementById('clientList');

    if (!clientList) return;

    clientList.innerHTML = '';

    clients.forEach(client => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${client.name}</td>
            <td>${client.email}</td>
            <td>${client.company}</td>
            <td class="notes-cell">${client.notes}</td>
            <td class="actions-cell">
                <button class="edit-btn" data-id="${client.id}">Edit</button>
                <button class="delete-btn" data-id="${client.id}">Delete</button>
            </td>
        `;

        clientList.appendChild(row);
    });
}

if (document.getElementById('clientList')) {
    renderClients();
}

/* handle edit and delete button */
const clientListEl = document.getElementById('clientList');
if (clientListEl) clientListEl.addEventListener('click', (e) => {
    if (e.target.classList.contains('edit-btn')) {
        const clientId = e.target.getAttribute('data-id');
        const client = getData('clients').find(c => c.id === clientId);
        document.getElementById('clientName').value = client.name;
        document.getElementById('clientEmail').value = client.email;
        document.getElementById('clientCompany').value = client.company;
        document.getElementById('clientNotes').value = client.notes;
        document.getElementById('formSubmitButton').textContent = 'Update Client';
        const clientForm = document.getElementById('clientForm');
        if (clientForm) clientForm.setAttribute('data-id', clientId);
        const modal = new bootstrap.Modal(document.getElementById('clientFormModal'));
        modal.show();

        /* close modal on submit */
        if (clientForm) {
            clientForm.addEventListener('submit', () => {
                modal.hide();
            });
        }
    } else if (e.target.classList.contains('delete-btn')) {
        clientToDelete = e.target.getAttribute('data-id');

        const modal = new bootstrap.Modal(document.getElementById('confirmDeleteModal'));
        modal.show();
    }
});

const confirmDeleteBtn = document.getElementById('confirmDeleteButton');

if (confirmDeleteBtn) confirmDeleteBtn.addEventListener('click', () => {
    if (clientToDelete) {
        deleteClient(clientToDelete);
        renderClients();
        clientToDelete = null;
    }

    const modalEl = document.getElementById('confirmDeleteModal');
    const modalInstance = bootstrap.Modal.getInstance(modalEl);
    modalInstance.hide();
});


//function to render the projects
/* projects */
function renderProjects() {
    const projectList = document.getElementById('projectList');
    if (!projectList) return;

    const searchInput = document.getElementById('projectSearchInput');
    const query = (searchInput?.value || '').trim().toLowerCase();

    const projects = getData('projects');
    const clients = getData('clients');

    projectList.innerHTML = '';

    projects.forEach(project => {
        const client = clients.find(c => c.id === project.clientId);
        const clientLabel =
            client
                ? (client.company ? `${client.name} — ${client.company}` : client.name)
                : (project.clientName || 'Unknown client');

        const status = project.status || '';
        const statusClass =
            status === 'Completed' ? 'status-completed'
                : status === 'In Progress' ? 'status-in-progress'
                    : status === 'Not Started' ? 'status-not-started'
                        : 'status-unknown';

        const budgetNumber = Number(project.budget || 0);
        const budgetLabel = Number.isFinite(budgetNumber)
            ? new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(budgetNumber)
            : '';

        if (query) {
            const haystack = [
                project.name,
                clientLabel,
                status,
                project.deadline,
                budgetLabel
            ]
                .filter(Boolean)
                .join(' ')
                .toLowerCase();

            if (!haystack.includes(query)) return;
        }

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${project.name || ''}</td>
            <td>${clientLabel}</td>
            <td><span class="status-pill ${statusClass}">${status}</span></td>
            <td>${project.deadline || ''}</td>
            <td>${budgetLabel}</td>
            <td class="actions-cell">
                <button class="edit-project-btn" data-id="${project.id}">Edit</button>
                <button class="delete-project-btn" data-id="${project.id}">Delete</button>
            </td>
        `;

        projectList.appendChild(row);
    });
}

if (document.getElementById('projectList')) {
    renderProjects();
}

const projectSearchInput = document.getElementById('projectSearchInput');
if (projectSearchInput) {
    projectSearchInput.addEventListener('input', () => {
        renderProjects();
    });
}

const projectListEl = document.getElementById('projectList');
if (projectListEl) projectListEl.addEventListener('click', (e) => {
    if (e.target.classList.contains('edit-project-btn')) {
        const projectId = e.target.getAttribute('data-id');
        const project = getData('projects').find(p => p.id === projectId);
        if (!project) return;

        const submitBtn = document.getElementById('projectFormSubmitButton');
        if (submitBtn) submitBtn.textContent = 'Update Project';

        const projectForm = document.getElementById('projectForm');
        if (projectForm) projectForm.setAttribute('data-id', projectId);

        const projectFormModalEl = document.getElementById('projectFormModal');
        const modal = new bootstrap.Modal(projectFormModalEl);

        const fillOnce = () => {
            projectFormModalEl.removeEventListener('shown.bs.modal', fillOnce);

            // ensure dropdown is populated before setting selection
            if (typeof populateClientNameSelect === 'function') {
                populateClientNameSelect();
            }

            document.getElementById('projectName').value = project.name || '';
            document.getElementById('clientNameSelect').value = project.clientId || '';
            document.getElementById('status').value = project.status || '';
            document.getElementById('deadline').value = project.deadline || '';
            document.getElementById('budget').value = project.budget ?? '';
        };

        projectFormModalEl.addEventListener('shown.bs.modal', fillOnce);
        modal.show();

        /* close modal on submit */
        if (projectForm) {
            projectForm.addEventListener('submit', () => {
                modal.hide();
            });
        }
    } else if (e.target.classList.contains('delete-project-btn')) {
        projectToDelete = e.target.getAttribute('data-id');
        const modal = new bootstrap.Modal(document.getElementById('confirmProjectDeleteModal'));
        modal.show();
    }
});

const confirmProjectDeleteBtn = document.getElementById('confirmProjectDeleteButton');
if (confirmProjectDeleteBtn) confirmProjectDeleteBtn.addEventListener('click', () => {
    if (projectToDelete) {
        deleteProject(projectToDelete);
        renderProjects();
        projectToDelete = null;
    }

    const modalEl = document.getElementById('confirmProjectDeleteModal');
    const modalInstance = bootstrap.Modal.getInstance(modalEl);
    modalInstance.hide();
});

/* dashboard */
function formatKES(amount) {
    const n = Number(amount || 0);
    return Number.isFinite(n)
        ? new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(n)
        : 'KES 0.00';
}

function formatTimeAgo(iso) {
    const date = iso ? new Date(iso) : new Date();
    const diffMs = Date.now() - date.getTime();
    const diffMin = Math.max(0, Math.floor(diffMs / 60000));
    if (diffMin < 60) return `${diffMin || 1} min ago`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr} hour${diffHr === 1 ? '' : 's'} ago`;
    const diffDay = Math.floor(diffHr / 24);
    return `${diffDay} day${diffDay === 1 ? '' : 's'} ago`;
}

// Earnings Overview chart removed (null and void).

function renderDashboard() {
    const metricCardsEl = document.getElementById('metricCards');
    const activityEl = document.getElementById('recentActivity');
    if (!metricCardsEl && !activityEl) return;

    const clients = getData('clients');
    const projects = getData('projects');
    const activities = typeof getActivities === 'function' ? getActivities() : getData('activity');

    const totalClients = clients.length;
    const activeProjects = projects.filter(p => (p.status || '') === 'In Progress').length;
    const totalEarnings = projects
        .filter(p => (p.status || '') === 'Completed')
        .reduce((sum, p) => {
            const budget = Number(p.budget ?? 0);
            return sum + (Number.isFinite(budget) ? budget : 0);
    }, 0);

    if (metricCardsEl) {
        metricCardsEl.innerHTML = `
            <div class="metricCard">
                <div>
                    <h3>Total Clients</h3>
                    <p class="metricValue">${totalClients}</p>
                </div>
                <div class="metricIcon success" aria-hidden="true"></div>
            </div>
            <div class="metricCard">
                <div>
                    <h3>Active Projects</h3>
                    <p class="metricValue">${activeProjects}</p>
                </div>
                <div class="metricIcon primary" aria-hidden="true"></div>
            </div>
            <div class="metricCard">
                <div>
                    <h3>Total Earnings</h3>
                    <p class="metricValue">${formatKES(totalEarnings)}</p>
                </div>
                <div class="metricIcon warning" aria-hidden="true"></div>
            </div>
        `;
    }

    if (activityEl) {
        const top = (activities || []).slice(0, 6);
        if (top.length === 0) {
            activityEl.innerHTML = `<div class="activityItem"><div class="activityLeft"><span class="activityDot"></span><div class="activityText"><span class="subject">No activity yet</span></div></div><div class="activityTime"></div></div>`;
            return;
        }

        const typeToDot = (t) => t === 'payment' ? 'success' : t === 'project' ? 'primary' : 'warning';

        activityEl.innerHTML = top.map(a => {
            const dotClass = typeToDot(a.type);
            const subject = a.subject || 'Activity';
            const action = a.action || '';
            const time = formatTimeAgo(a.createdAt);
            return `
                <div class="activityItem">
                    <div class="activityLeft">
                        <span class="activityDot ${dotClass}"></span>
                        <div class="activityText">
                            <span class="subject">${subject}</span>
                            <span>-</span>
                            <span class="action">${action}</span>
                        </div>
                    </div>
                    <div class="activityTime">${time}</div>
                </div>
            `;
        }).join('');
    }
}

renderDashboard();
