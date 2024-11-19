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

function popupAddToCart() {
    if (selectedVariantId) {
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