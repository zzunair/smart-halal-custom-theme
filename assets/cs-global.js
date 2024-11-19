async function fetchCartData() {
    try {
        const response = await fetch('/cart.js');
        if (!response.ok) throw new Error('Network response was not ok');
        const cartData = await response.json();
        updatePopup(cartData);
    } catch (error) {
        console.error('Error fetching cart data:', error);
    }
}

function updatePopup(cartData) {
    const product = cartData.items[cartData.items.length - 1];

    // Update product details
    document.querySelector('.atc-product-image-wrapper img').src = product.image;
    document.querySelector('.title').textContent = product.title;
    document.querySelector('.variant-option').innerHTML = `<span>Color:</span> ${product.variant_title || 'Default'}`;
    
    // Update cart details
    document.querySelector('.total-items-price p').textContent = `${cartData.item_count} items`;
    document.querySelector('.total-items-price h5').textContent = `$${(cartData.total_price / 100).toFixed(2)}`;

    // Show the popup
    document.getElementById('custom-atc-popup').classList.add('is-active');
    if (document.getElementById('image-popup')) {
        document.getElementById('image-popup').style.display = 'none';
    }
}

// Close popup when close button is clicked
document.querySelector('.js-close-popup').addEventListener('click', function() {
    document.getElementById('custom-atc-popup').classList.remove('is-active');
});

// Close popup when clicking outside the popup content
document.getElementById('custom-atc-popup').addEventListener('click', function(event) {
    if (!event.target.closest('.js-custom-popup-holder')) {
        document.getElementById('custom-atc-popup').classList.remove('is-active');
    }
});

// Add to cart global function
function addToCart(variantId) {
    if (variantId) {
        fetch('/cart/add.js', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: variantId, quantity: 1 })
        })
        .then(response => response.json())
        .then(data => {
            fetchCartData();
        })
        .catch(error => console.error('Error adding to cart:', error));
    } else {
        alert('Please select a variant first!');
    }
}