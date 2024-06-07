// script.js
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('user-form');
    const userList = document.getElementById('user-list');
    const API_URL = 'http://localhost:3000/users';

    // Fetch and display users
    async function fetchUsers() {
        const res = await fetch(API_URL);
        const users = await res.json();
        userList.innerHTML = '';
        users.forEach(user => {
            const li = document.createElement('li');
            li.innerHTML = `
                ${user.name} (${user.email})
                <button class="delete" data-id="${user.id}">Delete</button>
                <button class="edit" data-id="${user.id}">Edit</button>
            `;
            userList.appendChild(li);
        });
    }

    fetchUsers();

    // Add user
    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;

        const res = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email })
        });

        const newUser = await res.json();
        fetchUsers();
        form.reset();
    });

    // Delete user
    userList.addEventListener('click', async function (e) {
        if (e.target.classList.contains('delete')) {
            const id = e.target.getAttribute('data-id');
            await fetch(`${API_URL}/${id}`, {
                method: 'DELETE'
            });
            fetchUsers();
        }
    });

    // Edit user
    userList.addEventListener('click', async function (e) {
        if (e.target.classList.contains('edit')) {
            const id = e.target.getAttribute('data-id');
            const res = await fetch(`${API_URL}/${id}`);
            const user = await res.json();

            document.getElementById('name').value = user.name;
            document.getElementById('email').value = user.email;

            form.removeEventListener('submit', addUser);
            form.addEventListener('submit', async function updateUser(e) {
                e.preventDefault();
                const name = document.getElementById('name').value;
                const email = document.getElementById('email').value;

                await fetch(`${API_URL}/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name, email })
                });

                fetchUsers();
                form.reset();

                form.addEventListener('submit', addUser);
                form.removeEventListener('submit', updateUser);
            });
        }
    });

    // Function to add user
    async function addUser(e) {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;

        const res = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email })
        });

        const newUser = await res.json();
        fetchUsers();
        form.reset();
    }
});
