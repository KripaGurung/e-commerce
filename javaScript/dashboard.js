const userName = localStorage.getItem("userLogIn");

if (userName) {
    const message = document.getElementById("message");
    message.textContent = `Welcome to the dashboard, ${userName}!`;
}else{
    window.location.href = "login.html";
}

// let product = fetch('https://fakestoreapi.com/products').then(response =>  response.json()
// ).then(data => {console.log("data",data) } );

// console.log("product",product)

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
        filteredProducts = [...products]; // spread operator - {products ma vako data lai filteredProducts ma copy garxa}
        showProducts(); // taneyko products display garney
    } catch (error) {
        console.log("Error fetching products: ", error);
    }
}; 

function showProducts() {
    const container = document.querySelector('.productContainer');
    container.innerHTML = ""; // innerHTML ley chy hamile j filter gareyko xa tyo matra dekhauxa
    
        filteredProducts.map(product => {
        const div = document.createElement('div');
        div.classList.add('productCard');
        
        div.innerHTML = `<img src="${product.image}" alt="${product.title}">
        <h3>${product.title}</h3>
        <p class="category">${product.category}</p> 
        <p class="price">$${product.price}</p>`;
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
}

// Filter products by category
document.getElementById('categoryFilter').addEventListener('change', function() {
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

fetchProducts();