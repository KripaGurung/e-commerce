// Check user login
const userName = localStorage.getItem("userLogIn");

if (userName) {
  const message = document.getElementById("message");
  message.textContent = "Welcome, " + userName + "!";
} else {
  window.location.href = "login.html";
}

// Get cart from localStorage or make it empty
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let products = [];

// Fetch product details
function fetchProductDetails() {
  const productId = localStorage.getItem('selectedProductId');

  if (!productId) {
    // if product id not found, go back to dashboard
    window.location.href = "dashboard.html";
    return;
  }

  try {
    const storedProducts = localStorage.getItem('allProducts');

    if (storedProducts) {
      // if products already saved in localStorage
      products = JSON.parse(storedProducts);
      displayProductDetails(productId);
    } else {
      // fetch products from API
      fetch("https://fakestoreapi.com/products")
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          products = data;
          localStorage.setItem('allProducts', JSON.stringify(products));
          displayProductDetails(productId);
        })
        .catch(function (error) {
          console.log("Error fetching products:", error);
        });
    }
  } catch (error) {
    console.log("Error:", error);
  }
}

// Display product details
function displayProductDetails(productId) {
  const container = document.getElementById('productCard');

  // find the product by id
  let product = null;
  for (let i = 0; i < products.length; i++) {
    if (products[i].id == productId) {
      product = products[i];
      break;
    }
  }

  if (!product) {
    container.innerHTML = "<p>Product not found.</p>";
    return;
  }

  // check if product already in cart
  let isInCart = false;
  for (let i = 0; i < cart.length; i++) {
    if (cart[i].id == product.id) {
      isInCart = true;
      break;
    }
  }

  // show product details
  container.innerHTML =
    '<div class="product-detail-card">' +
    '<div class="product-image">' +
    '<img src="' + product.image + '" alt="' + product.title + '">' +
    '</div>' +
    '<div class="product-info">' +
    '<h1>' + product.title + '</h1>' +
    '<p class="category">' + product.category.toUpperCase() + '</p>' +
    '<div class="rating">' +
    '<div class="rating-stars">' + generateStarRating(product.rating.rate) + '</div>' +
    '<span class="rating-count">(' + product.rating.count + ' reviews)</span>' +
    '</div>' +
    '<p class="price">$' + product.price + '</p>' +
    '<p class="description">' + product.description + '</p>' +
    '<div class="button-container">' +
    '<button class="add-to-cart-btn ' + (isInCart ? 'added' : '') + '" data-id="' + product.id + '">' +
    (isInCart ? 'Added to Cart' : 'Add to Cart') +
    '</button>' +
    '</div>' +
    '</div>' +
    '</div>';

  // Add to cart button click
  const addBtn = document.querySelector('.add-to-cart-btn');
  addBtn.addEventListener('click', addToCart);

  // Back button click
  const backBtn = document.getElementById('go-back');
  backBtn.addEventListener('click', function () {
    window.location.href = "dashboard.html";
  });
}

// Make star rating (out of 5)
function generateStarRating(rating) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  let starsHTML = "";

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      starsHTML += '<i class="fa fa-star"></i>';
    } else if (i === fullStars && hasHalfStar) {
      starsHTML += '<i class="fa fa-star-half-o"></i>';
    } else {
      starsHTML += '<i class="fa fa-star-o"></i>';
    }
  }

  return starsHTML;
}

// Add or remove product from cart
function addToCart(e) {
  const button = e.currentTarget;
  const productId = parseInt(button.getAttribute('data-id'));

  let product = null;
  for (let i = 0; i < products.length; i++) {
    if (products[i].id === productId) {
      product = products[i];
      break;
    }
  }

  let inCartIndex = -1;
  for (let i = 0; i < cart.length; i++) {
    if (cart[i].id === productId) {
      inCartIndex = i;
      break;
    }
  }

  if (inCartIndex !== -1) {
    // product already in cart → remove it
    cart.splice(inCartIndex, 1);
    button.innerHTML = 'Add to Cart';
    button.classList.remove('added');
    
  } else {
    // add new product to cart
    const newItem = {
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      category: product.category,
      quantity: 1
    };
    cart.push(newItem);
    button.innerHTML = 'Added to Cart';
    button.classList.add('added');
    alert('Are you sure you want to add this to cart ? ');
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
}

// Update cart count in navbar
function updateCartCount() {
  const cartCount = document.getElementById('cart-count');
  if (cartCount) {
    cartCount.textContent = cart.length;
  }
}

// Call the function
fetchProductDetails();
