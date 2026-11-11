
// BiteBox - Food Ordering Application

// 1. Food Menu
const foodItems = [
    {
        id: 1,
        name: "Classic Beef Burger",
        category: "Burger",
        price: 650,
        emoji: "🍔",
        description: "Juicy beef patty with fresh lettuce and cheese."
    },
    {
        id: 2,
        name: "Cheese Burger",
        category: "Burger",
        price: 750,
        emoji: "🍔",
        description: "Loaded with melted cheese and special sauce."
    },
    {
        id: 3,
        name: "Pepperoni Pizza",
        category: "Pizza",
        price: 1200,
        emoji: "🍕",
        description: "Classic pizza topped with cheese and pepperoni."
    },
    {
        id: 4,
        name: "Chicken Fajita Pizza",
        category: "Pizza",
        price: 1350,
        emoji: "🍕",
        description: "Delicious chicken with peppers and mozzarella."
    },
    {
        id: 5,
        name: "Crispy Fried Chicken",
        category: "Chicken",
        price: 550,
        emoji: "🍗",
        description: "Golden crispy chicken with a special seasoning."
    },
    {
        id: 6,
        name: "Chicken Wings",
        category: "Chicken",
        price: 480,
        emoji: "🍗",
        description: "Tender chicken wings with a spicy flavour."
    },
    {
        id: 7,
        name: "Cold Drink",
        category: "Drinks",
        price: 150,
        emoji: "🥤",
        description: "Refreshing chilled soft drink."
    },
    {
        id: 8,
        name: "Fresh Orange Juice",
        category: "Drinks",
        price: 250,
        emoji: "🍊",
        description: "Fresh and refreshing orange juice."
    }
];

// 2. Shopping Cart
// Load previously saved cart from browser storage.
let cart = JSON.parse(localStorage.getItem("bitebox-cart")) || [];

let currentCategory = "All";

// 3. Display Food Items
function displayFood(items) {

    const foodGrid = document.getElementById("food-grid");

    foodGrid.innerHTML = "";

    if (items.length === 0) {
        foodGrid.innerHTML =
            '<p class="no-results">No food items found. Try another search.</p>';
        return;
    }

    items.forEach(function(food) {

        const card = document.createElement("div");

        card.className = "food-card";

        card.innerHTML = `
            <div class="food-image">${food.emoji}</div>

            <div class="food-info">
                <h3>${food.name}</h3>

                <p>${food.description}</p>

                <div class="food-bottom">
                    <span class="food-price">
                        Rs. ${food.price.toLocaleString("en-PK")}
                    </span>

                    <button class="add-btn"
                        onclick="addToCart(${food.id})">
                        + Add
                    </button>
                </div>
            </div>
        `;

        foodGrid.appendChild(card);
    });
}

// 4. Filter Food by Category
function filterFood(category, button) {

    currentCategory = category;

    const buttons = document.querySelectorAll(".category-btn");

    buttons.forEach(function(btn) {
        btn.classList.remove("active");
    });

    button.classList.add("active");

    searchFood();
}

// 5. Search Food
function searchFood() {

    const searchValue = document
        .getElementById("search-input")
        .value.toLowerCase();

    const filteredItems = foodItems.filter(function(food) {

        const matchesCategory =
            currentCategory === "All" ||
            food.category === currentCategory;

        const matchesSearch =
            food.name.toLowerCase().includes(searchValue);

        return matchesCategory && matchesSearch;
    });

    displayFood(filteredItems);
}

// Search input event
document.getElementById("search-input")
    .addEventListener("input", searchFood);

// 6. Save Cart in Browser
function saveCart() {

    localStorage.setItem("bitebox-cart", JSON.stringify(cart));

}

// 7. Add Food to Cart
function addToCart(foodId) {

    const selectedFood = foodItems.find(function(food) {
        return food.id === foodId;
    });

    const existingItem = cart.find(function(item) {
        return item.id === foodId;
    });

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            ...selectedFood,
            quantity: 1
        });
    }

    saveCart();
    updateCart();

    alert(selectedFood.name + " added to your cart!");
}

// 8. Increase or Decrease Quantity
function changeQuantity(foodId, amount) {

    const item = cart.find(function(food) {
        return food.id === foodId;
    });

    if (!item) return;

    item.quantity += amount;

    if (item.quantity <= 0) {
        cart = cart.filter(function(food) {
            return food.id !== foodId;
        });
    }

    saveCart();
    updateCart();
}

// 9. Remove Food from Cart
function removeItem(foodId) {

    cart = cart.filter(function(food) {
        return food.id !== foodId;
    });

    saveCart();
    updateCart();
}

// 10. Update Shopping Cart
function updateCart() {

    const cartItems = document.getElementById("cart-items");

    const cartCount = document.getElementById("cart-count");

    const cartTotal = document.getElementById("cart-total");

    let total = 0;
    let totalQuantity = 0;

    cartItems.innerHTML = "";

    if (cart.length === 0) {

        cartItems.innerHTML = `
            <div class="empty-cart">
                <h3>Your cart is empty!</h3>
                <p>Add some delicious food to get started.</p>
            </div>
        `;

    }

    cart.forEach(function(item) {

        total += item.price * item.quantity;

        totalQuantity += item.quantity;

        const cartItem = document.createElement("div");

        cartItem.className = "cart-item";

        cartItem.innerHTML = `
            <div>
                <h4>${item.emoji} ${item.name}</h4>

                <small>Rs. ${item.price * item.quantity}</small>

                <div class="quantity-controls">
                    <button onclick="changeQuantity(${item.id}, -1)">-</button>

                    <span>${item.quantity}</span>

                    <button onclick="changeQuantity(${item.id}, 1)">+</button>
                </div>

                <button class="remove-btn"
                    onclick="removeItem(${item.id})">
                    Remove
                </button>
            </div>
        `;

        cartItems.appendChild(cartItem);

    });

    cartCount.textContent = totalQuantity;

    cartTotal.textContent = "Rs. " +
        total.toLocaleString("en-PK");

}

// 11. Open and Close Cart
function toggleCart() {

    document.getElementById("cart-panel")
        .classList.toggle("open");

    document.getElementById("cart-overlay")
        .classList.toggle("show");

}

function closeCart() {

    document.getElementById("cart-panel")
        .classList.remove("open");

    document.getElementById("cart-overlay")
        .classList.remove("show");

}

// 12. Checkout
function openCheckout() {

    if (cart.length === 0) {
        alert("Your cart is empty! Please add some food first.");
        return;
    }

    closeCart();

    document.getElementById("checkout-modal")
        .classList.add("show");

}

function closeCheckout() {

    document.getElementById("checkout-modal")
        .classList.remove("show");

}

// 13. Place Order
document.getElementById("checkout-form")
    .addEventListener("submit", function(event) {

        event.preventDefault();

        if (cart.length === 0) {
            alert("Your cart is empty!");
            closeCheckout();
            return;
        }

        const customerName =
            document.getElementById("customer-name").value;

        const customerPhone =
            document.getElementById("customer-phone").value;

        const customerAddress =
            document.getElementById("customer-address").value;

        const paymentMethod =
            document.getElementById("payment-method").value;

        const orderTotal = cart.reduce(function(sum, item) {
            return sum + item.price * item.quantity;
        }, 0);

        const orderId = "BB" + Date.now().toString().slice(-6);

        const order = {
            orderId: orderId,
            customer: customerName,
            phone: customerPhone,
            address: customerAddress,
            payment: paymentMethod,
            total: orderTotal,
            items: cart.map(function(item) {
                return {
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price
                };
            }),
            date: new Date().toLocaleString()
        };

        // Save the demo order in browser storage
        let previousOrders = JSON.parse(
            localStorage.getItem("bitebox-orders")
        ) || [];

        previousOrders.push(order);

        localStorage.setItem(
            "bitebox-orders",
            JSON.stringify(previousOrders)
        );

        // Show confirmation
        document.getElementById("order-message").innerHTML =
            "Thank you, " + customerName +
            "! Your demo order <strong>" + orderId +
            "</strong> has been placed successfully.<br><br>" +
            "Order Total: <strong>Rs. " +
            orderTotal.toLocaleString("en-PK") +
            "</strong><br>" +
            "Payment: " + paymentMethod;

        // Clear cart
        cart = [];

        saveCart();
        updateCart();

        // Reset checkout form
        document.getElementById("checkout-form").reset();

        closeCheckout();

        document.getElementById("success-modal")
            .classList.add("show");

    });

// 14. Close Confirmation
function closeSuccess() {

    document.getElementById("success-modal")
        .classList.remove("show");

}

// 15. Start Application
displayFood(foodItems);

updateCart();
