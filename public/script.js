document.addEventListener('DOMContentLoaded', () => {
    fetchMenus();
    fetchOrders();
    fetchStats();

    document.getElementById('loginForm').addEventListener('submit', login);
    document.getElementById('logoutBtn').addEventListener('click', logout);

    document.getElementById('orderForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const menuId = document.getElementById('menu').value;
        const note = document.getElementById('note').value;
        await fetch('/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ menuId, note })
        });
        fetchOrders();
        fetchStats();
    });

    document.getElementById('menuForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('menuName').value;
        const price = document.getElementById('menuPrice').value;
        const date = document.getElementById('menuDate').value;
        await fetch('/menus', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, price, availableDate: date })
        });
        fetchMenus();
    });
});

async function login(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const res = await fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    if (res.ok) {
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('logoutBtn').style.display = 'inline';
        document.getElementById('welcome').textContent = `Hello, ${username}`;
        document.getElementById('welcome').style.display = 'block';
        document.getElementById('orderForm').style.display = 'block';
        const data = await res.json().catch(()=>({}));
        if (data.isAdmin) {
            document.getElementById('menuAdmin').style.display = 'block';
        }
    }
}

async function logout() {
    await fetch('/auth/logout', { method: 'POST' });
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('logoutBtn').style.display = 'none';
    document.getElementById('welcome').style.display = 'none';
    document.getElementById('orderForm').style.display = 'none';
    document.getElementById('menuAdmin').style.display = 'none';
}

async function fetchMenus() {
    const res = await fetch('/menus');
    const menus = await res.json();
    const select = document.getElementById('menu');
    select.innerHTML = '';
    menus.forEach(m => {
        const option = document.createElement('option');
        option.value = m.Id;
        option.textContent = `${m.Name} ($${m.Price})`;
        select.appendChild(option);
    });
}

async function fetchOrders() {
    const res = await fetch('/orders');
    const orders = await res.json();
    const tbody = document.querySelector('#ordersTable tbody');
    tbody.innerHTML = '';
    orders.forEach(o => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${o.Username}</td><td>${o.MenuName}</td><td>${o.Price}</td><td>${o.Note || ''}</td>`;
        tbody.appendChild(row);
    });
}

async function fetchStats() {
    const res = await fetch('/orders/stats/today');
    const data = await res.json();
    const tbody = document.querySelector('#statsTable tbody');
    tbody.innerHTML = '';
    data.items.forEach(i => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${i.Name}</td><td>${i.Quantity}</td><td>${i.Total}</td>`;
        tbody.appendChild(row);
    });
    document.getElementById('summary').textContent = `Total Orders: ${data.summary.TotalCount}  Amount: $${data.summary.TotalAmount || 0}`;
}
