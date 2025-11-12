const nav = document.querySelector(".nav"),
  searchIcon = document.querySelector("#searchIcon"),
  navOpenBtn = document.querySelector(".navOpenBtn"),
  navCloseBtn = document.querySelector(".navCloseBtn"),
  searchInput = document.querySelector("#searchInput"),
  searchResults = document.querySelector("#searchResults");

// Alternar busca
searchIcon.addEventListener("click", () => {
  nav.classList.toggle("openSearch");
  nav.classList.remove("openNav");
  if (nav.classList.contains("openSearch")) {
    searchIcon.classList.replace("uil-search", "uil-times");
    searchInput.focus();
  } else {
    searchIcon.classList.replace("uil-times", "uil-search");
    searchResults.classList.remove("active");
  }
});

// Menu mobile
navOpenBtn.addEventListener("click", () => {
  nav.classList.add("openNav");
  nav.classList.remove("openSearch");
  searchIcon.classList.replace("uil-times", "uil-search");
});

navCloseBtn.addEventListener("click", () => {
  nav.classList.remove("openNav");
});

// Busca em tempo real
searchInput.addEventListener("input", function() {
  const searchTerm = this.value.toLowerCase();
  
  if (searchTerm.length > 0) {
    searchResults.classList.add("active");
    
    // Exemplo de resultados - depois você substitui pela busca real
    searchResults.innerHTML = `
      <div class="search-result-item">Mesa Redonda Acrílico</div>
      <div class="search-result-item">Placa Personalizada</div>
      <div class="search-result-item">Porta-retratos Coração</div>
    `;
  } else {
    searchResults.classList.remove("active");
  }
});

// Fechar resultados ao clicar fora
document.addEventListener("click", function(event) {
  if (!event.target.closest('.search-box') && !event.target.closest('#searchIcon')) {
    searchResults.classList.remove("active");
  }
});