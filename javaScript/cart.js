// Check user login
const userName = localStorage.getItem("userLogIn");

if (userName) {
  const message = document.getElementById("message");
  message.textContent = "Welcome, " + userName + "!";
} else {
  window.location.href = "login.html";
}

let products = [];

// Update cart count in top-bar
function updateCartCount() {
  const cartCount = document.getElementById("cart-count");
  cartCount.textContent = cart.length;
}

// Category filter
const categoryFilter = document.getElementById("category-filter");
categoryFilter.addEventListener("change", function () {
  const category = this.value;
  filteredProducts = category === "all" 
    ? products 
    : products.filter(p => p.category === category);
  showProducts();
});

// Search products
const searchForm = document.getElementById("search-form");
searchForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const searchValue = document.getElementById("searchInput").value.toLowerCase().trim();

  filteredProducts = searchValue === "" 
    ? products 
    : products.filter(p => 
        p.title.toLowerCase().includes(searchValue) || 
        p.description.toLowerCase().includes(searchValue)
      );
  showProducts();
});

let cart = JSON.parse(localStorage.getItem('cart')) || [];
const cartItemsDiv = document.getElementById('cart-items');
const totalDiv = document.getElementById('total');

function displayCart() {
    cartItemsDiv.innerHTML = '';
    let total = 0;
    if (cart.length === 0) {
        cartItemsDiv.innerHTML = '<p>Your cart is empty.</p>';
        totalDiv.textContent = 'Total: $0';
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
    displayCart();
});

displayCart();