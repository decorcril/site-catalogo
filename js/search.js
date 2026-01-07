// Mapeamento de palavras-chave para filtros
const searchKeywords = {
    'mesa': 'mesas',
    'mesas': 'mesas',
    'tampo': 'tampos',
    'tampos': 'tampos',
    'bandeja': 'bandejas',
    'bandejas': 'bandejas',
    'boleira': 'boleiras',
    'boleiras': 'boleiras',
    'carrinho': 'carrinhos',
    'carrinhos': 'carrinhos',
    'base': 'bases-mesa',
    'bases': 'bases-mesa',
    'coluna': 'colunas',
    'colunas': 'colunas',
    'pulpito': 'pulpitos',
    'pulpitos': 'pulpitos',
    'placa': 'placas',
    'placas': 'placas',
    'escada': 'escadas',
    'escadas': 'escadas',
    'cubo': 'cubos',
    'cubos': 'cubos',
    'cilindro': 'cilindros',
    'cilindros': 'cilindros',
    'caixa': 'caixas',
    'caixas': 'caixas',
    'trio': 'trio-banquinhos',
    'banquinho': 'trio-banquinhos',
    'banquinhos': 'trio-banquinhos',
    'porta buque': 'porta-buque',
    'porta-buque': 'porta-buque',
    'buque': 'porta-buque',
    'led': 'leds',
    'leds': 'leds',
    'luz': 'leds',
    'iluminacao': 'leds',
    'iluminação': 'leds',
    'personalizado': 'personalizados',
    'personalizados': 'personalizados',
    'centro': 'centro-mesa-flores',
    'flores': 'centro-mesa-flores',
    'painel': 'paineis',
    'paineis': 'paineis',
    'suporte': 'suportes-utilidade',
    'suportes': 'suportes-utilidade',
    'expositor': 'expositores',
    'expositores': 'expositores',
    'medidor': 'medidor-balao',
    'balao': 'medidor-balao',
    'balão': 'medidor-balao'
};


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

// Função de busca simples
function setupSearchFunctionality() {
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    
    if (!searchInput || !searchResults) return;
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();
        
        if (searchTerm.length === 0) {
            searchResults.classList.remove('active');
            searchResults.innerHTML = '';
            return;
        }
        
        // Buscar categoria correspondente
        const matchingCategories = findMatchingCategories(searchTerm);
        
        if (matchingCategories.length > 0) {
            showSearchSuggestions(matchingCategories);
        } else {
            searchResults.innerHTML = `
                <div class="search-no-results">
                    Nenhuma categoria encontrada para "${searchTerm}"
                </div>
            `;
            searchResults.classList.add('active');
        }
    });
    
    // Fechar ao clicar fora
    document.addEventListener('click', function(e) {
        if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
            searchResults.classList.remove('active');
        }
    });
    
    // Fechar dropdown de filtros mobile ao abrir busca (se existir)
    searchInput.addEventListener('focus', function() {
        const mobileDropdown = document.getElementById('mobileFilterDropdown');
        if (mobileDropdown && mobileDropdown.classList.contains('active')) {
            mobileDropdown.classList.remove('active');
        }
    });
    
    // Enter para buscar primeira sugestão
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const firstSuggestion = document.querySelector('.search-result-item');
            if (firstSuggestion) {
                firstSuggestion.click();
            }
        }
    });
}

// Encontrar categorias que correspondem ao termo
function findMatchingCategories(searchTerm) {
    const matches = [];
    const seen = new Set();
    
    // Buscar correspondências exatas ou parciais
    for (const [keyword, category] of Object.entries(searchKeywords)) {
        if (keyword.includes(searchTerm) || searchTerm.includes(keyword)) {
            if (!seen.has(category)) {
                matches.push({
                    category: category,
                    name: getCategoryName(category)
                });
                seen.add(category);
            }
        }
    }
    
    return matches;
}

// Mostrar sugestões de busca
function showSearchSuggestions(categories) {
    const searchResults = document.getElementById('searchResults');
    
    searchResults.innerHTML = categories.map(cat => `
        <div class="search-result-item" data-filter="${cat.category}">
            <i class="fas fa-search"></i>
            <span>${cat.name}</span>
        </div>
    `).join('');
    
    searchResults.classList.add('active');
    
    // Adicionar eventos de clique
    document.querySelectorAll('.search-result-item').forEach(item => {
        item.addEventListener('click', function() {
            const filter = this.dataset.filter;
            
            // Aplicar filtro
            applyFilter(filter);
            
            // Atualizar botões ativos
            updateActiveFilterButtons(filter);
            updateMobileFilterButton(filter);
            
            // Fechar busca e limpar input
            searchResults.classList.remove('active');
            document.getElementById('searchInput').value = '';
            
            // Scroll suave até os produtos
            const catalogContainer = document.getElementById('productsContainer');
            if (catalogContainer) {
                catalogContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// Função para redirecionar para o catálogo em outras páginas
function setupSearchRedirect() {
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    
    if (!searchInput || !searchResults) return;
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();
        
        if (searchTerm.length === 0) {
            searchResults.classList.remove('active');
            searchResults.innerHTML = '';
            return;
        }
        
        // Buscar categoria correspondente
        const matchingCategories = findMatchingCategories(searchTerm);
        
        if (matchingCategories.length > 0) {
            showSearchSuggestionsWithRedirect(matchingCategories);
        } else {
            searchResults.innerHTML = `
                <div class="search-no-results">
                    Nenhuma categoria encontrada para "${searchTerm}"
                </div>
            `;
            searchResults.classList.add('active');
        }
    });
    
    // Fechar ao clicar fora
    document.addEventListener('click', function(e) {
        if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
            searchResults.classList.remove('active');
        }
    });
    
    // Enter para buscar primeira sugestão
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const firstSuggestion = document.querySelector('.search-result-item');
            if (firstSuggestion) {
                firstSuggestion.click();
            }
        }
    });
}

// Mostrar sugestões com redirecionamento
function showSearchSuggestionsWithRedirect(categories) {
    const searchResults = document.getElementById('searchResults');
    
    searchResults.innerHTML = categories.map(cat => `
        <div class="search-result-item" data-filter="${cat.category}">
            <i class="fas fa-search"></i>
            <span>${cat.name}</span>
        </div>
    `).join('');
    
    searchResults.classList.add('active');
    
    // Adicionar eventos de clique para redirecionar
    document.querySelectorAll('.search-result-item').forEach(item => {
        item.addEventListener('click', function() {
            const filter = this.dataset.filter;
            
            // Redirecionar para página do catálogo com filtro
            window.location.href = `/pages/catalog/index.html?filter=${filter}`;
        });
    });
}

// Inicializar busca quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    // Só inicializa se estiver na página do catálogo
    if (isOnCatalogPage()) {
        setupSearchFunctionality();
    } else {
        // Em outras páginas, redireciona para o catálogo
        setupSearchRedirect();
    }
});

// Converter código de categoria em nome legível
function getCategoryName(category) {
    const categoryNames = {
        'mesas': 'Mesas',
        'tampos': 'Tampos',
        'bandejas': 'Bandejas',
        'boleiras': 'Boleiras',
        'carrinhos': 'Carrinhos',
        'bases-mesa': 'Bases',
        'colunas': 'Colunas',
        'pulpitos': 'Púlpitos',
        'placas': 'Placas',
        'escadas': 'Escadas',
        'cubos': 'Cubos',
        'cilindros': 'Cilindros',
        'caixas': 'Caixas',
        'trio-banquinhos': 'Trio Banquinhos',
        'porta-buque': 'Porta Buquês',
        'leds': 'LEDs',
        'personalizados': 'Personalizados',
        'centro-mesa-flores': 'Centro de Mesa para Flores',
        'paineis': 'Painéis',
        'suportes-utilidade': 'Suportes',
        'expositores': 'Expositores',
        'medidor-balao': 'Medidor de Balões'
    };
    
    return categoryNames[category] || category;
}

// Verificar se estamos na página do catálogo
function isOnCatalogPage() {
    return document.getElementById('productsContainer') !== null;
}

// Inicializar busca quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    // Só inicializa se estiver na página do catálogo
    if (isOnCatalogPage()) {
        setupSearchFunctionality();
    } else {
        // Em outras páginas, redireciona para o catálogo
        setupSearchRedirect();
    }
});

// Fechar resultados ao clicar fora
document.addEventListener("click", function(event) {
  if (!event.target.closest('.search-box') && !event.target.closest('#searchIcon')) {
    searchResults.classList.remove("active");
  }
});