const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');
const type = document.getElementById('type');

// 1. Obtener Transacciones del Backend
async function getTransactions() {
    try {
        const res = await fetch('/api/transactions');
        const data = await res.json();
        updateValues(data);
        updateDOM(data);
    } catch (err) {
        console.error("Error fetching data", err);
    }
}

// 2. Agregar Transacción
async function addTransaction(e) {
    e.preventDefault();

    if (text.value.trim() === '' || amount.value.trim() === '') {
        alert('Por favor agrega un texto y una cantidad');
        return;
    }

    // Convertir a negativo si es "expense"
    let finalAmount = +amount.value;
    if (type.value === 'expense') {
        finalAmount = -Math.abs(finalAmount);
    } else {
        finalAmount = Math.abs(finalAmount);
    }

    const transaction = {
        text: text.value,
        amount: finalAmount
    };

    await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transaction)
    });

    text.value = '';
    amount.value = '';
    getTransactions();
}

// 3. Borrar Transacción
window.removeTransaction = async (id) => {
    await fetch(`/api/transactions/${id}`, { method: 'DELETE' });
    getTransactions();
}

// 4. Actualizar DOM (Lista)
function updateDOM(transactions) {
    list.innerHTML = '';
    transactions.forEach(transaction => {
        const sign = transaction.amount < 0 ? '-' : '+';
        const item = document.createElement('li');

        // Clase CSS basada en valor
        item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');

        item.innerHTML = `
            ${transaction.text} <span>${sign}$${Math.abs(transaction.amount).toFixed(2)}</span>
            <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
        `;

        list.appendChild(item);
    });
}

// 5. Actualizar Balance y Totales
function updateValues(transactions) {
    const amounts = transactions.map(t => t.amount);

    const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
    
    const income = amounts
        .filter(item => item > 0)
        .reduce((acc, item) => (acc += item), 0)
        .toFixed(2);

    const expense = (
        amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) * -1
    ).toFixed(2);

    balance.innerText = `$${total}`;
    money_plus.innerText = `+$${income}`;
    money_minus.innerText = `-$${expense}`;
}

form.addEventListener('submit', addTransaction);
getTransactions();
