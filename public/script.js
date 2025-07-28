document.addEventListener('DOMContentLoaded', () => {
    fetchMenus();
    fetchOrders();

    document.getElementById('orderForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const menuId = document.getElementById('menu').value;
        const note = document.getElementById('note').value;
        await fetch('/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, menuId, note })
        });
        fetchOrders();
    });
});

async function fetchMenus() {
    const res = await fetch('/menus');
    const menus = await res.json();
    const select = document.getElementById('menu');
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
        row.innerHTML = `<td>${o.Name}</td><td>${o.MenuName}</td><td>${o.Price}</td><td>${o.Note || ''}</td>`;
        tbody.appendChild(row);
    });
}
