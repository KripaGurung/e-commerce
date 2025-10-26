const userName = localStorage.getItem("userLogIn");

if (userName) {
  // show welcome message
  const message = document.getElementById("message");
  message.textContent = "Welcome, " + userName + "!";
} else {
  // if not logged in, go to login page
  window.location.href = "login.html";
}

// Get cart from local storage or make empty cart
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Make empty array for products
let products = [];
let filteredProducts = [];

// Fetch products from API
function fetchProducts() {
  fetch("https://fakestoreapi.com/products")
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      products = data;
      filteredProducts = data;
      showProducts();
    })
    .catch(function (error) {
      console.log("Error fetching products:", error);
    });
}

// Show products on the page
function showProducts() {
  const container = document.querySelector(".product-container");
  container.innerHTML = "";
  
  for (let i = 0; i < filteredProducts.length; i++) {
    const product = filteredProducts[i];
    
    // check if product already in cart
    let isInCart = false;
    for (let j = 0; j < cart.length; j++) {
        if (cart[j].id === product.id) {
            isInCart = true;
            break;
        }
    }
    
    const div = document.createElement("div");
    div.className = "product-card";
    
    div.innerHTML =
    '<div class="product-clickable" data-id="' + product.id + '">' +
    '<img src="' + product.image + '" alt="' + product.title + '">' +
    "<h3>" + product.title + "</h3>" +
    '<p class="category">' + product.category + "</p>" +
    '<p class="price">$' + product.price + "</p>" +
    "</div>" +
    '<button class="add-to-cart-btn ' + (isInCart ? "added" : "") + '" data-id="' + product.id + '">' +
    (isInCart ? "Added to Cart" : "Add to Cart") +
    "</button>";
    
    container.appendChild(div);
}

// Add click for product details
const productCards = document.querySelectorAll(".product-clickable");
for (let i = 0; i < productCards.length; i++) {
    productCards[i].addEventListener("click", navigateToProductDetails);
}

// Add click for Add to Cart
const addCartBtns = document.querySelectorAll(".add-to-cart-btn");
for (let i = 0; i < addCartBtns.length; i++) {
    addCartBtns[i].addEventListener("click", addToCart);
}
}

// Go to product detail page
function navigateToProductDetails(e) {
    const productId = e.currentTarget.getAttribute("data-id");
    localStorage.setItem("selectedProductId", productId);
    window.location.href = "product.html";
}

// Add or remove product from cart
function addToCart(e) {
    const button = e.currentTarget;
    const productId = parseInt(button.getAttribute("data-id"));
    let product;
    
    for (let i = 0; i < products.length; i++) {
        if (products[i].id === productId) {
            product = products[i];
            break;
        }
    }
    
    let itemIndex = -1;
    for (let i = 0; i < cart.length; i++) {
        if (cart[i].id === productId) {
            itemIndex = i;
            break;
        }
    }
    
    if (itemIndex !== -1) {
        // remove item if already added
        cart.splice(itemIndex, 1);
        button.textContent = "Add to Cart";
        button.classList.remove("added");
    } else {
       // add item to cart 
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
        alert('Are you sure you want to add this to cart!');
    }
    
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
}

// Update cart count in navbar
function updateCartCount() {
    const cartCount = document.getElementById("cart-count");
    cartCount.textContent = cart.length;
}

const categoryFilter = document.getElementById("category-filter");
categoryFilter.addEventListener("change", function () {
    const category = this.value;
    
    if (category === "all") {
        filteredProducts = products;
    } else {
        filteredProducts = [];
        for (let i = 0; i < products.length; i++) {
            if (products[i].category === category) {
                filteredProducts.push(products[i]);
            }
        }
    }
    showProducts();
});

// Search products
const searchForm = document.getElementById("search-form");
searchForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const searchValue = document.getElementById("searchInput").value.toLowerCase();
    
    if (searchValue === "") {
        filteredProducts = products;
    } else {
        filteredProducts = [];
        for (let i = 0; i < products.length; i++) {
            const title = products[i].title.toLowerCase();
            const description = products[i].description.toLowerCase();
            if (title.includes(searchValue) || description.includes(searchValue)) {
                filteredProducts.push(products[i]);
            }
        }
    }
    showProducts();
});

fetchProducts();