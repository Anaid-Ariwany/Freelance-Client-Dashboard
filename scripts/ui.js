let clientToDelete = null;

//function to render clients
function renderClients() {
    const clients = getData('clients');
    const clientList = document.getElementById('clientList');

    clientList.innerHTML = '';

    clients.forEach(client => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${client.name}</td>
            <td>${client.email}</td>
            <td>${client.company}</td>
            <td>${client.notes}</td>
            <td>
                <button class="edit-btn" data-id="${client.id}">Edit</button>
                <button class="delete-btn" data-id="${client.id}">Delete</button>
            </td>
        `;

        clientList.appendChild(row);
    });
}

renderClients();

/* handle edit and delete button */
//edit button, ensure the user can edit the client data in the form and update the client data in local storage
//the add button is changed to update button when editing a client, and the form is pre-filled with the client data
//once the edit form closes, the add button is changed back to add and the form is reset and the form closes
document.getElementById('clientList').addEventListener('click', (e) => {
    if (e.target.classList.contains('edit-btn')) {
        const clientId = e.target.getAttribute('data-id');
        const client = getData('clients').find(c => c.id === clientId);
        document.getElementById('clientName').value = client.name;
        document.getElementById('clientEmail').value = client.email;
        document.getElementById('clientCompany').value = client.company;
        document.getElementById('clientNotes').value = client.notes;
        document.getElementById('formSubmitButton').textContent = 'Update Client';
        form.setAttribute('data-id', clientId);
        const modal = new bootstrap.Modal(document.getElementById('clientFormModal'));
        modal.show();

        /* close modal on submit */
        form.addEventListener('submit', () => {
            modal.hide();
        });
    } else if (e.target.classList.contains('delete-btn')) {
        clientToDelete = e.target.getAttribute('data-id');

        const modal = new bootstrap.Modal(document.getElementById('confirmDeleteModal'));
        modal.show();
    }
});

const confirmDeleteBtn = document.getElementById('confirmDeleteButton');

confirmDeleteBtn.addEventListener('click', () => {
    if (clientToDelete) {
        deleteClient(clientToDelete);
        renderClients();
        clientToDelete = null;
    }

    const modalEl = document.getElementById('confirmDeleteModal');
    const modalInstance = bootstrap.Modal.getInstance(modalEl);
    modalInstance.hide();
});