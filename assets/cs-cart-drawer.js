

function openCartDrawer() {
    const cartDrawer = document.querySelector(".js-cart-drawer");
    const cartOverlay = document.querySelector(".js-cart-overlay");

    cartDrawer.classList.add("is-active");
    cartOverlay.classList.add("is-active");
    document.body.classList.add("no-scroll");
    updateCartDrawer();
}

// Close the cart drawer and overlay, enable body scroll
function closeCartDrawer() {
    const cartDrawer = document.querySelector(".js-cart-drawer");
    const cartOverlay = document.querySelector(".js-cart-overlay");

    cartDrawer.classList.remove("is-active");
    cartOverlay.classList.remove("is-active");
    document.body.classList.remove("no-scroll");
    document.querySelector(".empty-cart-message").style.display = "none";

}

// Function to update the cart drawer content
async function updateCartDrawer() {
    try {
        const response = await fetch("/cart.js");
        const cartData = await response.json();

        const lineItemsContainer = document.querySelector(".drawer-line-items-wrap");
        const subtotalElement = document.querySelector(".subtotal-text");
        const checkoutSubtotalElement = document.querySelector("#cart-amount");
        const emptyCartMessage = document.querySelector(".empty-cart-message");
        const cartContent = document.querySelector(".cart-drawer__content");
        const cartFooter = document.querySelector(".cart-drawer__footer");

        if (!lineItemsContainer || !subtotalElement || !checkoutSubtotalElement || !emptyCartMessage || !cartContent || !cartFooter) {
            console.warn("Some elements were not found.");
            return;
        }

        if (cartData.items.length === 0) {
            // Show empty cart message
            emptyCartMessage.style.display = "flex";
            cartContent.style.display = "none";
            cartFooter.style.display = "none";
        } else {
            // Show cart content
            emptyCartMessage.style.display = "none";
            cartContent.style.display = "block";
            cartFooter.style.display = "block";

            lineItemsContainer.innerHTML = ""; // Clear existing items
            let subtotal = 0;

            cartData.items.forEach((item) => {
                const itemTotalPrice = (item.final_price / 100) * item.quantity;
                subtotal += itemTotalPrice;

                let lineItemHTML = `
                    <div class="line-item shadow-1" data-id="${item.id}">
                        <img src="${item.image}" alt="${item.title}" class="line-item__image">
                        <div class="line-item__details">
                            <h4 class="line-item__title">${item.title}</h4>
                            <p class="line-item__variant">Color: <span class="line-item__variant-option">${item.variant_title || ""}</span></p>
                            <div class="priceNquantity">
                                <p class="line-item__price">$<span class="line-item__price-value">${itemTotalPrice.toFixed(2)}</span></p>
                                <div class="line-item__quantity">
                                    <button class="line-item__quantity-decrease">−</button>
                                    <span class="line-item__quantity-value">${item.quantity}</span>
                                    <button class="line-item__quantity-increase">+</button>
                                </div>
                            </div>
                        </div>
                        <button class="line-item__remove">✕</button>
                    </div>`;

                const parser = new DOMParser();
                const doc = parser.parseFromString(lineItemHTML, "text/html");
                const lineItemElement = doc.body.firstChild;

                lineItemsContainer.appendChild(lineItemElement);
            });

            // Update subtotal
            const subtotalPrice = (cartData.items_subtotal_price / 100).toFixed(2);
            subtotalElement.textContent = `$${subtotalPrice}`;
            checkoutSubtotalElement.textContent = `$${subtotalPrice}`;
        }
    } catch (error) {
        console.error("Error fetching cart data:", error);
    }
}

// Function to update the cart item quantity or remove it
async function updateCartItem(line, quantity) {
    try {
        const response = await fetch('/cart/change.js', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: line,
                quantity: quantity
            }),
        });
        const updatedCart = await response.json();

        // Refresh the cart drawer with updated data, including updated subtotal
        updateCartDrawer();
    } catch (error) {
        console.error('Error updating cart item:', error);
    }
}

// Function to handle quantity increase
function handleQuantityIncrease(button) {
    const lineItem = button.closest('.line-item');
    const lineItemId = lineItem.dataset.id;
    const quantityElement = lineItem.querySelector('.line-item__quantity-value');
    let quantity = parseInt(quantityElement.textContent, 10);

    quantity++;
    quantityElement.textContent = quantity; // Update the displayed quantity immediately
    updateCartItem(lineItemId, quantity);
}

// Function to handle quantity decrease
function handleQuantityDecrease(button) {
    const lineItem = button.closest('.line-item');
    const lineItemId = lineItem.dataset.id;
    const quantityElement = lineItem.querySelector('.line-item__quantity-value');
    let quantity = parseInt(quantityElement.textContent, 10);

    if (quantity > 1) {
        quantity--;
        quantityElement.textContent = quantity; // Update the displayed quantity immediately
        updateCartItem(lineItemId, quantity);
    } else {
        updateCartItem(lineItemId, 0); // Remove item if quantity is 1
    }
}

// Function to handle item removal on cross click
function handleRemoveItem(button) {
    const lineItem = button.closest('.line-item');
    const lineItemId = lineItem.dataset.id;
    updateCartItem(lineItemId, 0);
}

// Event listeners for quantity and remove buttons
document.addEventListener('click', (event) => {
    if (event.target.classList.contains('line-item__quantity-increase')) {
        handleQuantityIncrease(event.target);
    }
    if (event.target.classList.contains('line-item__quantity-decrease')) {
        handleQuantityDecrease(event.target);
    }
    if (event.target.classList.contains('line-item__remove')) {
        handleRemoveItem(event.target);
    }
});

// Event listeners for the close button and overlay click
document.addEventListener('DOMContentLoaded', function() {
    document.querySelector(".js-close-cart-drawer").addEventListener("click", closeCartDrawer);
    document.querySelector(".js-cart-overlay").addEventListener("click", closeCartDrawer);

    // Example event to open cart drawer for testing (assuming a button with class 'cart-icon')
    document.querySelector(".cart-icon-image").addEventListener("click", openCartDrawer);
});
