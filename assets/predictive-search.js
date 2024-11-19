// Check if PredictiveSearch already exists before declaring
if (typeof window.PredictiveSearch === 'undefined') {
  window.PredictiveSearch = class {
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

      document.addEventListener('click', (event) => {
        if (!this.searchInput.contains(event.target) && !this.resultsContainer.contains(event.target)) {
          this.hideResults();
        }
      });
    }

    // ... rest of the methods ...
  }

  // Initialize only if not already initialized
  if (!window.predictiveSearchInstance) {
    document.addEventListener('DOMContentLoaded', () => {
      window.predictiveSearchInstance = new PredictiveSearch();
    });
  }
}
