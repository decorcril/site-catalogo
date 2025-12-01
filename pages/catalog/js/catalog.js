// pages/catalog/js/catalog.js
document.addEventListener('DOMContentLoaded', function() {
    // Elementos do catálogo
    const filterBtns = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.catalog-card');
    const sortSelect = document.querySelector('.sort-select');
    const paginationBtns = document.querySelectorAll('.pagination-btn:not(.prev):not(.next)');
    
    // Função para aplicar filtro
    function applyFilter(filterValue) {
        // Remover active de todos os botões de filtro
        filterBtns.forEach(b => b.classList.remove('active'));
        
        // Ativar o botão correspondente ao filtro
        const targetBtn = Array.from(filterBtns).find(btn => 
            btn.dataset.filter === filterValue
        );
        
        if (targetBtn) {
            targetBtn.classList.add('active');
        } else {
            // Se não encontrar o botão específico, ativa "Todos"
            const allBtn = document.querySelector('.filter-btn[data-filter="all"]');
            if (allBtn) allBtn.classList.add('active');
            filterValue = 'all'; // Força mostrar todos
        }
        
        // Filtrar produtos
        productCards.forEach(card => {
            if (filterValue === 'all' || card.dataset.category === filterValue) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                }, 10);
            } else {
                card.style.opacity = '0';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 150);
            }
        });
        
        // Atualizar URL sem recarregar a página (apenas se não for do redirecionamento inicial)
        if (!window.location.search.includes('filter=' + filterValue)) {
            const newUrl = window.location.pathname + '?filter=' + filterValue;
            window.history.pushState({ filter: filterValue }, '', newUrl);
        }
    }
    
    // Event listeners para botões de filtro
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.dataset.filter;
            applyFilter(filter);
        });
    });
    
    // Verificar filtro da URL ao carregar a página
    function checkUrlFilter() {
        const urlParams = new URLSearchParams(window.location.search);
        const filterFromUrl = urlParams.get('filter');
        
        if (filterFromUrl) {
            // Aplicar o filtro da URL
            applyFilter(filterFromUrl);
            
            // Scroll suave para a seção do catálogo
            setTimeout(() => {
                const catalogSection = document.getElementById('catalog');
                if (catalogSection) {
                    catalogSection.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }, 300);
        }
    }
    
    // Executar verificação de filtro da URL
    checkUrlFilter();
    
    // Wishlist
    const wishlistBtns = document.querySelectorAll('.wishlist-btn');
    wishlistBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const icon = this.querySelector('i');
            this.classList.toggle('active');
            
            if (this.classList.contains('active')) {
                icon.classList.remove('far', 'fa-heart');
                icon.classList.add('fas', 'fa-heart');
                // Aqui você pode adicionar lógica para salvar no localStorage
                console.log('Produto adicionado aos favoritos');
            } else {
                icon.classList.remove('fas', 'fa-heart');
                icon.classList.add('far', 'fa-heart');
                // Aqui você pode adicionar lógica para remover do localStorage
                console.log('Produto removido dos favoritos');
            }
        });
    });
    
    // Ordenação
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            const sortValue = this.value;
            console.log('Ordenar por:', sortValue);
            
            // Aqui você pode implementar a lógica de ordenação
            // Por exemplo, ordenar por preço, popularidade, etc.
            
            // Para implementar a ordenação, você precisaria:
            // 1. Coletar todos os produtos em um array
            // 2. Ordenar o array conforme o critério selecionado
            // 3. Reorganizar os produtos no DOM
        });
    }
    
    // Paginação
    if (paginationBtns.length > 0) {
        paginationBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remover active de todos
                paginationBtns.forEach(b => b.classList.remove('active'));
                // Adicionar active no clicado
                this.classList.add('active');
                
                // Aqui você implementaria a lógica para carregar a página específica
                const pageNumber = this.textContent;
                console.log('Carregar página:', pageNumber);
            });
        });
    }
    
    // Botões de navegação (próximo/anterior)
    const prevBtn = document.querySelector('.pagination-btn.prev');
    const nextBtn = document.querySelector('.pagination-btn.next');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            if (!this.disabled) {
                const currentPage = document.querySelector('.pagination-btn.active');
                const prevPage = currentPage ? currentPage.previousElementSibling : null;
                
                if (prevPage && prevPage.classList.contains('pagination-btn')) {
                    paginationBtns.forEach(b => b.classList.remove('active'));
                    prevPage.classList.add('active');
                    console.log('Página anterior');
                }
            }
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            if (!this.disabled) {
                const currentPage = document.querySelector('.pagination-btn.active');
                const nextPage = currentPage ? currentPage.nextElementSibling : null;
                
                if (nextPage && nextPage.classList.contains('pagination-btn')) {
                    paginationBtns.forEach(b => b.classList.remove('active'));
                    nextPage.classList.add('active');
                    console.log('Próxima página');
                }
            }
        });
    }
    
    // Botões de ação dos produtos
    const quickViewBtns = document.querySelectorAll('.btn-quick-view');
    const addCartBtns = document.querySelectorAll('.btn-add-cart');
    
    quickViewBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Encontrar o produto pai
            const productCard = this.closest('.catalog-card');
            const productTitle = productCard.querySelector('.product-title').textContent;
            
            console.log('Visualização rápida:', productTitle);
            // Aqui você pode implementar um modal de visualização rápida
            // ou redirecionar para a página do produto
        });
    });
    
    addCartBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Encontrar o produto pai
            const productCard = this.closest('.catalog-card');
            const productTitle = productCard.querySelector('.product-title').textContent;
            const productPrice = productCard.querySelector('.current-price').textContent;
            
            console.log('Adicionar ao carrinho:', productTitle, '-', productPrice);
            // Aqui você pode implementar a lógica do carrinho de compras
            // Adicionar ao localStorage, mostrar notificação, etc.
            
            // Exemplo de notificação simples
            alert(`${productTitle} foi adicionado ao carrinho!`);
        });
    });
    
    // Navegação pelos cards de produto (se quiser que todo o card seja clicável)
    productCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Evitar que o clique no card dispare quando clicar em botões internos
            if (!e.target.closest('.wishlist-btn') && 
                !e.target.closest('.btn-quick-view') && 
                !e.target.closest('.btn-add-cart')) {
                
                const productTitle = this.querySelector('.product-title').textContent;
                console.log('Abrir página do produto:', productTitle);
                // Aqui você pode redirecionar para a página detalhada do produto
                // window.location.href = `./produto-detalhe.html?id=${productId}`;
            }
        });
    });
});