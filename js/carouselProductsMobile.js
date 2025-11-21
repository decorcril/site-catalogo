document.addEventListener('DOMContentLoaded', function() {
    // Apenas para mobile
    if (window.innerWidth > 768) return;
    
    // Adiciona badges de desconto
    document.querySelectorAll('.product__card').forEach((card, index) => {
        const currentPriceEl = card.querySelector('.price__current');
        const originalPriceEl = card.querySelector('.price__original');
        
        if (currentPriceEl && originalPriceEl) {
            const currentPrice = parseFloat(currentPriceEl.textContent.replace('R$ ', '').replace(',', '.'));
            const originalPrice = parseFloat(originalPriceEl.textContent.replace('R$ ', '').replace(',', '.'));
            
            if (originalPrice > currentPrice) {
                const discount = Math.round((1 - currentPrice / originalPrice) * 100);
                card.setAttribute('data-discount', `-${discount}%`);
            }
        }
        
        // Animação escalonada
        card.style.animationDelay = `${index * 0.1}s`;
    });
    
    // Click nos botões
    document.querySelectorAll('.product__btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const productName = this.closest('.product__card').querySelector('.product__name').textContent;
            console.log('Comprar produto:', productName);
            // window.open(`https://wa.me/SEUNUMERO?text=Olá! Gostaria de comprar: ${productName}`, '_blank');
        });
    });
});