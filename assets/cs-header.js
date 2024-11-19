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
    this.searchInputs = document.querySelectorAll('[data-predictive-search]');
    this.resultsContainers = document.querySelectorAll('.predictive-search-results');
    this.loadingContainers = document.querySelectorAll('.predictive-search-loading');
    this.productsContainers = document.querySelectorAll('.predictive-search-products');
    this.timeout = null;
    
    this.init();
  }

  init() {
    if (!this.searchInputs.length) return;
    
    this.searchInputs.forEach((input, index) => {
      input.addEventListener('input', (event) => {
        clearTimeout(this.timeout);
        const searchTerm = event.target.value;
        
        if (searchTerm.length < 2) {
          this.hideResults(index);
          return;
        }

        this.timeout = setTimeout(() => {
          this.performSearch(searchTerm, index);
        }, 300);
      });

      // Close results when clicking outside
      document.addEventListener('click', (event) => {
        if (!input.contains(event.target) && !this.resultsContainers[index].contains(event.target)) {
          this.hideResults(index);
        }
      });
    });
  }

  async performSearch(searchTerm, index) {
    this.showLoading(index);
    
    try {
      const response = await fetch(`/search/suggest.json?q=${searchTerm}&resources[type]=product&resources[limit]=4&resources[options][unavailable_products]=hide`);
      const data = await response.json();
      
      this.renderResults(data.resources.results, index);
    } catch (error) {
      console.error('Search error:', error);
      this.hideResults(index);
    }
  }

  renderResults(results, index) {
    this.hideLoading(index);
    this.resultsContainers[index].hidden = false;
    
    const products = results.products || [];
    
    if (products.length === 0) {
      this.productsContainers[index].innerHTML = '<div class="predictive-search-item">No results found</div>';
      return;
    }

    this.productsContainers[index].innerHTML = products.map(product => `
      <a href="${product.url}" class="predictive-search-item">
        <img src="${product.featured_image.url}" alt="${product.title}">
        <div class="predictive-search-item-info">
          <div class="predictive-search-item-title">${product.title}</div>
          <div class="predictive-search-item-price">${product.price}</div>
        </div>
      </a>
    `).join('');
  }

  showLoading(index) {
    this.resultsContainers[index].hidden = false;
    this.loadingContainers[index].hidden = false;
  }

  hideLoading(index) {
    this.loadingContainers[index].hidden = true;
  }

  hideResults(index) {
    this.resultsContainers[index].hidden = true;
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
  const mainContent = document.querySelector('main');
  let lastScroll = 0;
  let announcementHeight = announcementBar ? announcementBar.offsetHeight : 0;
  let headerHeight = header ? header.offsetHeight : 0;

  // Function to update heights and margins
  const updateHeaderHeights = () => {
    headerHeight = header ? header.offsetHeight : 0;
    announcementHeight = announcementBar ? announcementBar.offsetHeight : 0;
    
    if (header) {
      header.style.top = announcementHeight + 'px';
      
      if (window.pageYOffset > 100) {
        header.style.position = 'fixed';
        header.style.top = '0';
      } else {
        header.style.position = 'absolute';
        header.style.top = announcementHeight + 'px';
      }
    }
    
    if (mainContent) {
      mainContent.style.marginTop = (headerHeight) + 'px';
    }
  };

  // Initial setup
  if (header) {
    header.style.position = 'absolute';
    header.style.width = '100%';
    header.style.zIndex = '100';
    header.style.transition = 'transform 0.3s ease-in-out';
  }
  
  if (mainContent) {
    mainContent.style.transition = 'margin 0.3s ease-in-out';
  }

  // Call initially
  updateHeaderHeights();

  // Update on resize
  window.addEventListener('resize', () => {
    updateHeaderHeights();
  });

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
      if (header) {
        header.style.position = 'fixed';
        header.style.top = '0';
        
        if (announcementBar) {
          announcementBar.style.transform = `translateY(-${announcementHeight}px)`;
          announcementBar.style.transition = 'transform 0.3s ease-in-out';
        }
      }
    } else {
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