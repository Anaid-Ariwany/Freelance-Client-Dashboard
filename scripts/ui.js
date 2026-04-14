//function to render clients
function renderClients() {
    const clients = getData('clients');
    const clientList = document.getElementById('clientList');
    clientList.innerHTML = '';
    clients.forEach(client => {
        const clientItem = document.createElement('div');
        clientItem.classList.add('client-item');
        clientItem.innerHTML = `
            <h3>${client.name}</h3>
            <p>Email: ${client.email}</p>
            <p>Company: ${client.company}</p>
            <p>Notes: ${client.notes}</p>
            <button class="edit-btn" data-id="${client.id}">Edit</button>
            <button class="delete-btn" data-id="${client.id}">Delete</button>
        `;
        clientList.appendChild(clientItem);
    });

    // add event listeners for edit and delete buttons  
    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const clientId = e.target.getAttribute('data-id');
            const client = clients.find(c => c.id === clientId);
            document.querySelector('#clientName').value = client.name;
            document.querySelector('#clientEmail').value = client.email;
            document.querySelector('#clientCompany').value = client.company;
            document.querySelector('#clientNotes').value = client.notes;

            const form = document.querySelector('#clientForm');
            form.setAttribute('data-id', clientId);
            document.querySelector('#formSubmitButton').textContent = 'Update Client';
            const modal = new bootstrap.Modal(document.querySelector('#clientFormModal'));
            modal.show();

            /* close modal on submit */
            form.addEventListener('submit', () => {
                modal.hide();
            });
        });
    });

    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const clientId = e.target.getAttribute('data-id');
            deleteClient(clientId);
            renderClients();
        });
    });
}

renderClients();
