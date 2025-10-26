const userName = localStorage.getItem("userLogIn");

if (userName) {
    const message = document.getElementById("message");
    message.textContent = `Welcome, ${userName}!`;
}else{
    window.location.href = "login.html";
}

// let product = fetch('https://fakestoreapi.com/products').then(response =>  response.json()
// ).then(data => {console.log("data",data) } );

// console.log("product",product)

let cart = JSON.parse(localStorage.getItem('cart')) || [];
// updateCartCount();

let products =[]; // to store the fetched data
let filteredProducts = [];

// fetch products
// const fetchProducts = async () => {
//     const response = await fetch('https://fakestoreapi.com/products');
//     const data = await response.json();
//     products = data;
// }; 
// fetchProducts();

// Fetch products
const fetchProducts = async () => {
    try {
        const response = await fetch('https://fakestoreapi.com/products');
        const data = await response.json();
        products = data;
        console.log('products', products)
        filteredProducts = [...products]; // spread operator - {products ma vako data lai filteredProducts ma copy garxa}
        showProducts(); // taneyko products display garney
    } catch (error) {
        console.log("Error fetching products: ", error);
    }
}; 

function showProducts() {
    const container = document.querySelector('.product-container');
    container.innerHTML = ""; // innerHTML ley chy hamile j filter gareyko xa tyo matra dekhauxa
    
        filteredProducts.map(product => {
        const div = document.createElement('div');
        div.classList.add('product-card');
        
        const isInCart = cart.some(item => item.id === product.id); // Check garxa if product is already in cart
        
        div.innerHTML = `
            <div class="product-clickable" data-id="${product.id}">
                <img src="${product.image}" alt="${product.title}">
                <h3>${product.title}</h3>
                <p class="category">${product.category}</p> 
                <p class="price">$${product.price}</p>
            </div>
            <button class="add-to-cart-btn ${isInCart ? 'added' : ''}" data-id="${product.id}">
                <i class="fa ${isInCart}"></i>
                ${isInCart ? 'Added to Cart' : 'Add to Cart'}
            </button>
        `;
        container.appendChild(div); // yo chy product card lai main container ma rakhdinxa
    });

    // filteredProducts.forEach(product => {
    //     const div = document.createElement('div');
    //     div.classList.add('productCard');
        
    //     div.innerHTML = `<img src="${product.image}" alt="${product.title}">
    //     <h3>${product.title}</h3>
    //     <p class="category">${product.category}</p> 
    //     <p class="price">$${product.price}</p>`;
    //     container.appendChild(div);
    // });

    // Add event listeners to all Add to Cart buttons
    document.querySelectorAll('.product-clickable').forEach(button => {
        button.addEventListener('click', navigateToProductDetails);
    });

}

// Navigate to product details page
function navigateToProductDetails(e) {
    // Don't navigate if the click was on the button
    if (e.target.closest('.add-to-cart-btn')) {
        return;
    }
    
    const productId = e.currentTarget.getAttribute('data-id');
    // Store the product ID in localStorage to retrieve on the product page
    localStorage.setItem('selectedProductId', productId);
    // Navigate to product details page
    window.location.href = "product.html";
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
        e.currentTarget.innerHTML = 'Add to Cart';
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
        e.currentTarget.innerHTML = '<i class="fa fa-check"></i> Added to Cart';
        e.currentTarget.classList.add('added');
    }

    // Update cart in localStorage 
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();

    // Update cart count 
    function updateCartCount() {
        const cartCount = document.getElementById('cart-count');
        cartCount.textContent = cart.length;
        }
}

// Filter products by category
document.getElementById('category-filter').addEventListener('change', function() {
    const category = this.value;
    
    if (category === 'all') {
        filteredProducts = [...products];
    } else {
        filteredProducts = products.filter(product => 
            product.category === category
        );
    }
    
    showProducts();
});

// Search functionality
document.getElementById('search-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    if (searchTerm) {
        filteredProducts = products.filter(product => 
            product.title.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm)
        );
    } else {
        filteredProducts = [...products];
    }
    
    showProducts();
});

fetchProducts();