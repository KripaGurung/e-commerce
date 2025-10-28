// Check user login
const userName = localStorage.getItem("userLogIn");

if (userName) {
  const message = document.getElementById("message");
  message.textContent = "Welcome, " + userName + "!";
} else {
  window.location.href = "login.html";
}

let cart = JSON.parse(localStorage.getItem('cart')) || [];
const cartItemsDiv = document.getElementById('cart-items');
const totalDiv = document.getElementById('total');

let filteredCart = [...cart]; // make a copy of cart

function displayCart(items = filteredCart) {
  cartItemsDiv.innerHTML = '';
  let total = 0;

  if (items.length === 0) {
    cartItemsDiv.innerHTML = '<p>Your cart is empty.</p>';
    totalDiv.textContent = 'Total: $0';
    return;
  }

  items.forEach((item, index) => {
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
      </button>
    `;
    cartItemsDiv.appendChild(div);
  });

  totalDiv.textContent = `Total: $${total.toFixed(2)}`;
}

function removeItem(index) {
  cart.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
  applyFilters(); // refresh after removing
}

document.getElementById('go-back').addEventListener('click', () => {
  window.location.href = 'dashboard.html';
});

document.getElementById('checkout-btn').addEventListener('click', () => {
  if (cart.length === 0) {
    alert('Your cart is empty!');
    return;
  }
  alert('Checkout successful!');
  localStorage.removeItem('cart');
  cart = [];
  filteredCart = [];
  displayCart();
});

document.getElementById('search-form').addEventListener('submit', function (e) {
  e.preventDefault();
  applyFilters();
});

document.getElementById('category-filter').addEventListener('change', function () {
  applyFilters();
});

function applyFilters() {
  const searchValue = document.getElementById('searchInput').value.toLowerCase();
  const selectedCategory = document.getElementById('category-filter').value;

  filteredCart = cart.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchValue);
    const matchesCategory =
      selectedCategory === 'all' ||
      (item.category && item.category.toLowerCase() === selectedCategory);

    return matchesSearch && matchesCategory;
  });

  displayCart(filteredCart);
}

displayCart();
