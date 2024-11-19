let currentProductVariants = []; // Store variants of the currently selected product
let selectedVariantId = null; // Store the selected variant ID

function openPopup(mainImage, secondImage, title, price, url, variants) {
    // Populate popup details
    document.getElementById('popup-main-image').src = mainImage;
    document.getElementById('popup-small-image').src = secondImage;
    document.getElementById('popup-title').textContent = title;
    document.getElementById('popup-price').textContent = price;
    document.getElementById('popup-url').href = url;

    // Store the variants in a global variable for easy access
    currentProductVariants = JSON.parse(variants);

    // Populate the variant dropdown
    const variantSelect = document.getElementById('variant-select');
    variantSelect.innerHTML = ""; // Clear previous options
    currentProductVariants.forEach((variant) => {
        const option = document.createElement('option');
        option.value = variant.id;
        option.text = variant.title;
        option.setAttribute("data-price", variant.price);
        option.setAttribute("data-image", variant.featured_image ? variant.featured_image.src : "");
        variantSelect.appendChild(option);
    });

    // Set the initial selected variant ID
    selectedVariantId = variantSelect.value;

    // Display the popup
    document.getElementById('image-popup').style.display = 'flex';
}

function updateVariantDetails(selectElement) {
    // Get the selected variant's price and image from the data attributes
    const selectedOption = selectElement.options[selectElement.selectedIndex];
    selectedVariantId = selectedOption.value; // Update selected variant ID
    const newPrice = selectedOption.getAttribute("data-price");
    const newImage = selectedOption.getAttribute("data-image");

    // Update the price
    document.getElementById('popup-price').textContent = formatPrice(newPrice);

    // Update the secondary image if it exists for this variant
    if (newImage) {
        document.getElementById('popup-small-image').src = newImage;
    }
}

// Helper function to format the price
function formatPrice(priceInCents) {
    const price = (priceInCents / 100).toFixed(2); 
    return `€${price}`;
}

function customPopup() {
    document.getElementById('image-popup').style.display = 'none';
    const $popup = $('.js-custom-popup');
    $popup.addClass('is-active');
}
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
    document.getElementById('image-popup').style.display = 'none';
    const product = cartData.items[cartData.items.length - 1];

    // Update product details
    document.querySelector('.atc-product-image-wrapper img').src = product.image;
    document.querySelector('.title').textContent = product.title;
    document.querySelector('.variant-option').innerHTML = `<span>Color:</span> ${product.variant_title || 'Default'}`;
    
    // Update cart details
    document.querySelector('.total-items-price p').textContent = `${cartData.item_count} items`;
    document.querySelector('.total-items-price h5').textContent = `$${(cartData.total_price / 100).toFixed(2)}`;

    // Show the popup
    document.getElementById('custom-popup').classList.add('is-active');
}
function addToCart() {
    if (selectedVariantId) {
        // Create a form dynamically
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = '/cart/add';

        // Add the variant ID input to the form
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = 'id';
        input.value = selectedVariantId;

        form.appendChild(input);

        // Use Fetch API to submit form data via AJAX
        fetch('/cart/add.js', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: selectedVariantId, quantity: 1 })
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

function closePopup() {
    document.getElementById('image-popup').style.display = 'none';
}

// Close popup when close button is clicked
document.querySelector('.js-close-popup').addEventListener('click', function() {
    document.getElementById('custom-popup').classList.remove('is-active');
});

// Close popup when clicking outside the popup content
document.getElementById('custom-popup').addEventListener('click', function(event) {
    if (!event.target.closest('.js-custom-popup-holder')) {
        document.getElementById('custom-popup').classList.remove('is-active');
    }
});