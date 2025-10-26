let cart = JSON.parse(localStorage.getItem('cart')) || [];
const cartItemsDiv = document.getElementById('cart-items');
const totalDiv = document.getElementById('total');
const cartCount = document.getElementById('cart-count');

function displayCart() {
    cartItemsDiv.innerHTML = '';
    let total = 0;
    if (cart.length === 0) {
        cartItemsDiv.innerHTML = '<p>Your cart is empty.</p>';
        totalDiv.textContent = 'Total: $0';
        cartCount.textContent = 0;
        return;
    }
    
    cart.forEach((item, index) => {
        total += item.price * item.quantity;
        
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
        <img src="${item.image}" alt="${item.title}" class="cart-img">
        <div class="cart-info">
        <h4>${item.title}</h4>
        <p>Price: $${item.price}</p>
        <p>Quantity: ${item.quantity}</p>
        </div>
        <button class="remove-btn" onclick="removeItem(${index})">
        <i class="fa fa-trash"></i>
        </button>`;
        cartItemsDiv.appendChild(div);
    });
    
    totalDiv.textContent = `Total: $${total.toFixed(2)}`;
}

function removeItem(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
}

document.getElementById('back-btn').addEventListener('click', () => {
    window.location.href = 'product.html';
});

document.getElementById('checkout-btn').addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    alert('Checkout successful!');
    localStorage.removeItem('cart');
    displayCart();
});

displayCart();