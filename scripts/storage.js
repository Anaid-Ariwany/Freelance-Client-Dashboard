/* create resuable functions for local storage operations */

// getData retrieves data from local storage and parses it as JSON. 
// If the key does not exist, it returns an empty array.
function getData(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
}

// setData takes a key and data, converts the data to a JSON string, 
// and stores it in local storage under the specified key.
function setData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}


/* create resuable functions for local storage operations */
/* client functions */
// addClient adds a new client to the existing list of clients in local storage.
function addClient(client) {
    const clients = getData('clients');
    clients.push(client);
    setData('clients', clients);
}

// getClients retrieves the list of clients from local storage.
function getClients() {
    return getData('clients');
}

// delete client by id
function deleteClient(clientId) {
    let clients = getData('clients');
    clients = clients.filter(client => client.id !== clientId);
    setData('clients', clients);
}

// update client data by id
function updateClient(clientId, updatedClient) {
    let clients = getData('clients');
    clients = clients.map(client => client.id === clientId ? updatedClient : client);
    setData('clients', clients);
}


/* project functions */
// addProject adds a new project to the existing list of projects in local storage.
function addProject(project) {
    const projects = getData('projects');
    projects.push(project);
    setData('projects', projects);
}

// getProjects retrieves the list of projects from local storage.
function getProjects() {
    return getData('projects');
}

// delete project by id
function deleteProject(projectId) {
    let projects = getData('projects');
    projects = projects.filter(project => project.id !== projectId);
    setData('projects', projects);
}

// update project data by id
function updateProject(projectId, updatedProject) {
    let projects = getData('projects');
    projects = projects.map(project => project.id === projectId ? updatedProject : project);
    setData('projects', projects);
}


/* payment functions */
// addPayment adds a new payment to the existing list of payments in local storage.
function addPayment(payment) {
    const payments = getData('payments');
    payments.push(payment);
    setData('payments', payments);
}

// getPayments retrieves the list of payments from local storage.
function getPayments() {
    return getData('payments');
}

// delete payment by id
function deletePayment(paymentId) {
    let payments = getData('payments');
    payments = payments.filter(payment => payment.id !== paymentId);
    setData('payments', payments);
}

// update payment data by id
function updatePayment(paymentId, updatedPayment) {
    let payments = getData('payments');
    payments = payments.map(payment => payment.id === paymentId ? updatedPayment : payment);
    setData('payments', payments);
}


/* handle add client form submissions */
const clientForm = document.querySelector('#clientForm');
const clientFormModal = document.querySelector('#clientFormModal');

if (clientForm && clientFormModal) {
    const modal = new bootstrap.Modal(clientFormModal);

    clientForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const clientId = clientForm.getAttribute('data-id');
        const clientData = {
            id: clientId || Date.now().toString(),
            name: document.querySelector('#clientName')?.value || '',
            email: document.querySelector('#clientEmail')?.value || '',
            company: document.querySelector('#clientCompany')?.value || '',
            notes: document.querySelector('#clientNotes')?.value || ''
        };
        if (clientId) {
            updateClient(clientId, clientData);
        }
        else {
            addClient(clientData);
        }
        if (typeof renderClients === 'function') {
            renderClients();
        }
        clientForm.reset();
        modal.hide();
    });
}


/* handle add project form submissions */
const projectForm = document.querySelector('#projectForm');
const projectFormModal = document.querySelector('#projectFormModal');

if (projectForm && projectFormModal) {
    const modal = new bootstrap.Modal(projectFormModal);

    projectForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const projectId = projectForm.getAttribute('data-id');

        const clientId = document.querySelector('#clientNameSelect')?.value || '';
        const clients = getData('clients');
        const client = clients.find(c => c.id === clientId);

        const projectData = {
            id: projectId || Date.now().toString(),
            name: document.querySelector('#projectName')?.value || '',
            clientId,
            clientName: client?.name || '',
            clientCompany: client?.company || '',
            status: document.querySelector('#status')?.value || '',
            deadline: document.querySelector('#deadline')?.value || '',
            budget: Number(document.querySelector('#budget')?.value || 0),
        };

        if (projectId) {
            updateProject(projectId, projectData);
        } else {
            addProject(projectData);
        }

        if (typeof renderProjects === 'function') {
            renderProjects();
        }

        projectForm.reset();
        projectForm.removeAttribute('data-id');

        const submitBtn = document.getElementById('projectFormSubmitButton');
        if (submitBtn) submitBtn.textContent = 'Add Project';

        modal.hide();
    });

    projectFormModal.addEventListener('hidden.bs.modal', () => {
        projectForm.reset();
        projectForm.removeAttribute('data-id');

        const submitBtn = document.getElementById('projectFormSubmitButton');
        if (submitBtn) submitBtn.textContent = 'Add Project';
    });
}


