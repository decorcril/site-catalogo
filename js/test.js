// js/home.js
document.addEventListener('DOMContentLoaded', function() {
    // Event listeners para cards de categoria (na página inicial)
    const categoryCards = document.querySelectorAll('.category__card');
    
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            const category = this.dataset.category;
            
            // Redirecionar para a página do catálogo com o filtro aplicado
            window.location.href = './pages/catalog/index.html?filter=' + category;
        });
    });
    
    // Adicionar cursor pointer nas categorias
    categoryCards.forEach(card => {
        card.style.cursor = 'pointer';
        card.style.transition = 'transform 0.3s ease';
        
        // Efeito hover simples
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});