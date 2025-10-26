let cart = JSON.parse(localStorage.getItem('cart')) || [];
let products = [];

// Fetch product details
const fetchProductDetails = async () => {
    const productId = localStorage.getItem('selectedProductId');
    
    if (!productId) {
        // yedi productId payena vane dashboard ma redirect huney
        window.location.href = "dashboard.html";
        return;
    }
    
    try {
        // Check if we already have products in localStorage
        const storedProducts = localStorage.getItem('allProducts');
        if (storedProducts) {
            products = JSON.parse(storedProducts); // parse vaneko chy string lai JavaScript object ma convert garney
            displayProductDetails(productId);
        } else {
            // Fetch all products if not stored
            const response = await fetch('https://fakestoreapi.com/products');
            products = await response.json();
            localStorage.setItem('allProducts', JSON.stringify(products));
            displayProductDetails(productId);
        }
    } catch (error) {
        console.log("Error fetching product details: ", error);
    }
};

// Display product details
function displayProductDetails(productId) {
    const product = products.find(p => p.id == productId);
    const container = document.getElementById('product-details');
    
    if (!product) {
        container.innerHTML = '<p>Product not found.</p>';
        return;
    }
    
    // some method- le array ma kunai euta item le condition fulfill garyo bhane true return garxa

    const isInCart = cart.some(item => item.id == productId);
    
    container.innerHTML = `
        <div class="product-detail-card">
            <div class="product-image">
                <img src="${product.image}" alt="${product.title}">
            </div>

            <div class="product-info">
                <h1>${product.title}</h1>
                <p class="category">${product.category.toUpperCase()}</p>
                <div class="rating">
                    <div class="rating-stars">
                        ${generateStarRating(product.rating.rate)}
                    </div>
                    <span class="rating-count">(${product.rating.count} reviews)</span>
                </div>
                <p class="price">$${product.price}</p>
                <p class="description">${product.description}</p>
                <div class="button-container">
                    <button class="back-btn" id="back-btn">
                        <i class="fa fa-arrow-left"></i> Back to Products
                    </button>
                    <button class="add-to-cart-btn ${isInCart ? 'added' : ''}" data-id="${product.id}">
                        <i class="fa ${isInCart ? 'fa-check' : 'fa-shopping-cart'}"></i>
                        ${isInCart ? 'Added to Cart' : 'Add to Cart'}
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Add event listener to the Add to Cart button

    // querySelector - vaneko chy kunai pni pahilo vako element match vayo vane dinxa
    // querySelectorAll - vaneko chy match vako sab element lai dinxa
    document.querySelector('.add-to-cart-btn').addEventListener('click', addToCart);
    
    // Add event listener to the Back button
    document.getElementById('back-btn').addEventListener('click', function() {
        window.location.href = "dashboard.html";
    });
}

// star rating 
function generateStarRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let starsHTML = '';
    
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

// Add product to cart
function addToCart(e) {
    const productId = parseInt(e.currentTarget.getAttribute('data-id'));
    const product = products.find(p => p.id === productId);
            
    // Check if product is already in cart
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        // If already in cart, remove it
        cart = cart.filter(item => item.id !== productId);
        e.currentTarget.innerHTML = '</i> Add to Cart';
        e.currentTarget.classList.remove('added');
    } else {
        cart.push({
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
            category: product.category,
            quantity: 1
        });
        e.currentTarget.innerHTML = '</i> Added to Cart';
        e.currentTarget.classList.add('added');
    }

    // Update cart in localStorage 
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

// Update cart count 
function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    cartCount.textContent = cart.length;
}

fetchProductDetails();
updateCartCount();