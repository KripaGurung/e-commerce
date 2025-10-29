// Check user login
const userName = localStorage.getItem("userLogIn");

if (userName) {
  const message = document.getElementById("message");
  message.textContent = "Welcome, " + userName + "!";
} else {
  window.location.href = "login.html";
}

// Get cart or initialize empty
const loggedInEmail = localStorage.getItem("loggedInUserEmail");
let cart = JSON.parse(localStorage.getItem(`cart_${loggedInEmail}`)) || [];


// Products array
let products = [];
let filteredProducts = [];

// Fetch products from API
function fetchProducts() {
  fetch("https://fakestoreapi.com/products")
    .then(response => response.json())
    .then(data => {
      products = data;
      filteredProducts = data;
      showProducts();
      updateCartCount();
    })
    .catch(error => console.log("Error fetching products:", error));
}

// Render products 
function showProducts() {
  const container = document.querySelector(".product-container");
  container.innerHTML = "";
  
  filteredProducts.forEach(product => {
    const isInCart = cart.some(item => item.id === product.id);

    const div = document.createElement("div");
    div.className = "product-card";
    div.dataset.id = product.id;

    div.innerHTML ='<img src="' + product.image + '" alt="' + product.title + '">' + '<div class="product-details">' + '<h3>' + product.title + '</h3>' + '<p class="category">' 
    + product.category + '</p>' + '<p class="price">$' + product.price + '</p>' + '</div>' + '<button class="add-to-cart-btn ' + (isInCart ? "added" : "") + '" data-id="' + product.id + '">' 
    + (isInCart ? "Added to Cart" : "Add to Cart") +'</button>';

    container.appendChild(div);

    // Card click → go to product details
    div.addEventListener("click", e => {
      if (e.target.classList.contains("add-to-cart-btn")) return; // ignore button
      localStorage.setItem("selectedProductId", product.id);
      window.location.href = "product.html"; 
    });

    // Button click → add/remove from cart
    const button = div.querySelector(".add-to-cart-btn");
    button.addEventListener("click", addToCart);
  });
}

// Add or remove from cart
function addToCart(e) {
  const button = e.currentTarget;
  const productId = parseInt(button.dataset.id);

  const product = products.find(p => p.id === productId);
  const itemIndex = cart.findIndex(item => item.id === productId);

  if (itemIndex !== -1) {
    // remove from cart
    cart.splice(itemIndex, 1);
    button.textContent = "Add to Cart";
    button.classList.remove("added");
  } else {
    // add to cart
    cart.push({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      category: product.category,
      quantity: 1
    });
    button.textContent = "Added to Cart";
    button.classList.add("added");
    alert('Are you sure you want to add this to cart ? ');
  }

  localStorage.setItem(`cart_${loggedInEmail}`, JSON.stringify(cart));
  updateCartCount();
}

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

// search form
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("searchInput");
const backArrow = document.getElementById("go-back");

// hide arrow initially
backArrow.style.display = "none";

searchForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const searchValue = searchInput.value.toLowerCase().trim();

  if (searchValue === "") {
    filteredProducts = products;
    showProducts();
    backArrow.style.display = "none";
    return;
  }

  filteredProducts = products.filter(p =>
    p.title.toLowerCase().includes(searchValue) ||
    (p.description?.toLowerCase().includes(searchValue))
  );

  const container = document.querySelector(".product-container");
  container.innerHTML = "";

  if (filteredProducts.length === 0) {
    container.innerHTML = "<p class='not-found'>Product not found.</p>";
  } else {
    showProducts();
  }

  // arrow dekhauney jaba searched
  backArrow.style.display = "inline-block";
});

// when arrow clicked than redirect to dashboard
backArrow.addEventListener("click", () => {
  searchInput.value = "";
  filteredProducts = products;
  showProducts();
  backArrow.style.display = "none";
});

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
  logoutBtn.addEventListener("click", function() {
    // remove only login-related info
    localStorage.removeItem("userLogIn");
    localStorage.removeItem("loggedInUserEmail");

    alert("You have been logged out!");
    window.location.href = "login.html";
  });
}

fetchProducts();