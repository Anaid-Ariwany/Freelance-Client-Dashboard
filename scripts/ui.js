let clientToDelete = null;

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
        if (typeof form !== 'undefined' && form) form.setAttribute('data-id', clientId);
        const modal = new bootstrap.Modal(document.getElementById('clientFormModal'));
        modal.show();

        /* close modal on submit */
        if (typeof form !== 'undefined' && form) {
            form.addEventListener('submit', () => {
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

