// Open the cart drawer and overlay
function openHeaderDrawer() {
  document.querySelector('.header-drawer').classList.add('is-active');
  document.querySelector('.header-overlay').classList.add('is-active');
}

// Close the cart drawer and overlay
function closeHeaderDrawer() {
  document.querySelector('.header-drawer').classList.remove('is-active');
  document.querySelector('.header-overlay').classList.remove('is-active');
}

// Event listeners for the close button and overlay
document.querySelector('.close-header-drawer').addEventListener('click', closeHeaderDrawer);
document.querySelector('.header-overlay').addEventListener('click', closeHeaderDrawer);


// Toggle to show and hide navbar menu
const navbarMenu = document.getElementById("menu");
const burgerMenu = document.getElementById("burger");

burgerMenu.addEventListener("click", () => {
  navbarMenu.classList.toggle("is-active");
  burgerMenu.classList.toggle("is-active");
});

// Toggle to show and hide dropdown menu
const dropdown = document.querySelectorAll(".dropdown");

dropdown.forEach((item) => {
  const dropdownToggle = item.querySelector(".dropdown-toggle");

  dropdownToggle.addEventListener("click", () => {
    const dropdownShow = document.querySelector(".dropdown-show");
    toggleDropdownItem(item);

    // Remove 'dropdown-show' class from other dropdown
    if (dropdownShow && dropdownShow != item) {
      toggleDropdownItem(dropdownShow);
    }
  });
});

// Function to display the dropdown menu
const toggleDropdownItem = (item) => {
  const dropdownContent = item.querySelector(".dropdown-content");

  // Remove other dropdown that have 'dropdown-show' class
  if (item.classList.contains("dropdown-show")) {
    dropdownContent.removeAttribute("style");
    item.classList.remove("dropdown-show");
  } else {
    // Added max-height on active 'dropdown-show' class
    dropdownContent.style.height = dropdownContent.scrollHeight + "px";
    item.classList.add("dropdown-show");
  }
};

// Fixed dropdown menu on window resizing
window.addEventListener("resize", () => {
  if (window.innerWidth > 992) {
    document.querySelectorAll(".dropdown-content").forEach((item) => {
      item.removeAttribute("style");
    });
    dropdown.forEach((item) => {
      item.classList.remove("dropdown-show");
    });
  }
});

// Fixed navbar menu on window resizing
window.addEventListener("resize", () => {
  if (window.innerWidth > 992) {
    if (navbarMenu.classList.contains("is-active")) {
      navbarMenu.classList.remove("is-active");
      burgerMenu.classList.remove("is-active");
    }
  }
});



class PredictiveSearch {
  constructor() {
    this.searchInput = document.querySelector('[data-predictive-search]');
    this.resultsContainer = document.querySelector('.predictive-search-results');
    this.loadingContainer = document.querySelector('.predictive-search-loading');
    this.productsContainer = document.querySelector('.predictive-search-products');
    this.timeout = null;
    
    this.init();
  }

  init() {
    if (!this.searchInput) return;
    
    this.searchInput.addEventListener('input', (event) => {
      clearTimeout(this.timeout);
      const searchTerm = event.target.value;
      
      if (searchTerm.length < 2) {
        this.hideResults();
        return;
      }

      this.timeout = setTimeout(() => {
        this.performSearch(searchTerm);
      }, 300);
    });

    // Close results when clicking outside
    document.addEventListener('click', (event) => {
      if (!this.searchInput.contains(event.target) && !this.resultsContainer.contains(event.target)) {
        this.hideResults();
      }
    });
  }

  async performSearch(searchTerm) {
    this.showLoading();
    
    try {
      const response = await fetch(`/search/suggest.json?q=${searchTerm}&resources[type]=product&resources[limit]=4&resources[options][unavailable_products]=hide`);
      const data = await response.json();
      
      this.renderResults(data.resources.results);
    } catch (error) {
      console.error('Search error:', error);
      this.hideResults();
    }
  }

  renderResults(results) {
    this.hideLoading();
    this.resultsContainer.hidden = false;
    
    const products = results.products || [];
    
    if (products.length === 0) {
      this.productsContainer.innerHTML = '<div class="predictive-search-item">No results found</div>';
      return;
    }

    this.productsContainer.innerHTML = products.map(product => `
      <a href="${product.url}" class="predictive-search-item">
        <img src="${product.featured_image.url}" alt="${product.title}">
        <div class="predictive-search-item-info">
          <div class="predictive-search-item-title">${product.title}</div>
          <div class="predictive-search-item-price">${product.price}</div>
        </div>
      </a>
    `).join('');
  }

  showLoading() {
    this.resultsContainer.hidden = false;
    this.loadingContainer.hidden = false;
  }

  hideLoading() {
    this.loadingContainer.hidden = true;
  }

  hideResults() {
    this.resultsContainer.hidden = true;
  }
}

// Initialize the predictive search
document.addEventListener('DOMContentLoaded', () => {
  new PredictiveSearch();
});

function showSubmenu(blockId) {
  document.getElementById(blockId).classList.add('active');
}

function hideSubmenu(blockId) {
  document.getElementById(blockId).classList.remove('active');
}

// Header position
document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.header');
  const announcementBar = document.querySelector('.announcement-bar-slider');
  let lastScroll = 0;
  let announcementHeight = announcementBar ? announcementBar.offsetHeight : 0;

  // Add necessary classes for transition
  if (header) {
    header.style.top = announcementHeight + 'px';
    header.style.position = 'absolute';
    header.style.width = '100%';
    header.style.zIndex = '100';
    header.style.transition = 'transform 0.3s ease-in-out';
  }

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
      // Scrolling down past threshold
      if (header) {
        header.style.position = 'fixed';
        header.style.top = '0';
        
        if (announcementBar) {
          announcementBar.style.transform = `translateY(-${announcementHeight}px)`;
          announcementBar.style.transition = 'transform 0.3s ease-in-out';
        }
      }
    } else {
      // Scrolling back to top
      if (header) {
        header.style.position = 'absolute';
        header.style.top = announcementHeight + 'px';
        
        if (announcementBar) {
          announcementBar.style.transform = 'translateY(0)';
        }
      }
    }

    lastScroll = currentScroll;
  });
});