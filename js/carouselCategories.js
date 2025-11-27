// Carousel Finito - VERSÃO CORRIGIDA (ÚLTIMO CARD NÃO SOZINHO)
document.addEventListener('DOMContentLoaded', function() {
    const track = document.querySelector('.categories__track');
    const prevBtn = document.querySelector('.carousel__btn--prev');
    const nextBtn = document.querySelector('.carousel__btn--next');
    const cards = document.querySelectorAll('.category__card');
    
    let currentPosition = 0;
    let cardWidth = 0;
    let gap = 0;
    let visibleCards = 0;
    let maxPosition = 0;
    let isMobile = window.innerWidth <= 768;

    function calculateDimensions() {
        if (cards.length === 0) return;
        
        // Pega dimensões reais do primeiro card
        const firstCard = cards[0];
        const cardStyle = window.getComputedStyle(firstCard);
        cardWidth = firstCard.offsetWidth;
        
        // Pega o gap real
        const trackStyle = window.getComputedStyle(track);
        gap = parseInt(trackStyle.gap) || 25;
        
        // Calcula quantos cards são visíveis
        const containerWidth = track.parentElement.offsetWidth;
        const totalCardWidth = cardWidth + gap;
        visibleCards = Math.floor(containerWidth / totalCardWidth);
        
        // CORREÇÃO: Garante que o último card nunca fique sozinho
        // Se temos espaço para X cards, paramos na posição (total - X)
        // Isso faz com que na última posição ainda tenhamos X cards visíveis
        maxPosition = Math.max(0, cards.length - visibleCards);
        
        // DEBUG
        console.log('Dimensões calculadas:', { 
            cardWidth, 
            gap, 
            containerWidth, 
            visibleCards, 
            maxPosition,
            totalCards: cards.length 
        });
    }

    function updateCarousel() {
        if (cards.length === 0) return;
        
        const moveDistance = currentPosition * (cardWidth + gap);
        track.style.transform = `translateX(-${moveDistance}px)`;
        
        // Desabilita botões quando chega nos extremos
        const isAtStart = currentPosition === 0;
        const isAtEnd = currentPosition >= maxPosition;
        
        prevBtn.style.opacity = isAtStart ? '0.4' : '1';
        prevBtn.style.cursor = isAtStart ? 'not-allowed' : 'pointer';
        prevBtn.disabled = isAtStart;
        
        nextBtn.style.opacity = isAtEnd ? '0.4' : '1';
        nextBtn.style.cursor = isAtEnd ? 'not-allowed' : 'pointer';
        nextBtn.disabled = isAtEnd;

        // Esconde botões completamente se não forem necessários
        if (maxPosition === 0) {
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'none';
        } else {
            prevBtn.style.display = 'flex';
            nextBtn.style.display = 'flex';
        }
        
        console.log('Posição atual:', currentPosition, 'de', maxPosition);
    }

    function handleResize() {
        isMobile = window.innerWidth <= 768;
        
        // Pequeno delay para garantir que o CSS foi aplicado
        setTimeout(() => {
            calculateDimensions();
            
            // Reset mais inteligente da posição
            if (currentPosition > maxPosition) {
                currentPosition = Math.max(0, maxPosition);
            }
            
            // Se todos os cards cabem na tela, reseta para início
            if (maxPosition === 0) {
                currentPosition = 0;
            }
            
            updateCarousel();
        }, 150);
    }

    // Event Listeners
    nextBtn.addEventListener('click', function() {
        if (currentPosition < maxPosition) {
            currentPosition++;
            updateCarousel();
        }
    });

    prevBtn.addEventListener('click', function() {
        if (currentPosition > 0) {
            currentPosition--;
            updateCarousel();
        }
    });

    // Swipe para mobile - MELHORADO
    let startX = 0;
    let isDragging = false;
    
    track.addEventListener('touchstart', function(e) {
        if (maxPosition === 0) return; // Não faz swipe se não precisa
        startX = e.touches[0].clientX;
        isDragging = true;
        track.style.cursor = 'grabbing';
    });

    track.addEventListener('touchmove', function(e) {
        if (!isDragging || maxPosition === 0) return;
        e.preventDefault();
    });

    track.addEventListener('touchend', function(e) {
        if (!isDragging || maxPosition === 0) return;
        
        const endX = e.changedTouches[0].clientX;
        const diff = startX - endX;
        const swipeThreshold = 50;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0 && currentPosition < maxPosition) {
                currentPosition++; // Swipe para esquerda
            } else if (diff < 0 && currentPosition > 0) {
                currentPosition--; // Swipe para direita
            }
            updateCarousel();
        }
        isDragging = false;
        track.style.cursor = 'grab';
    });

    // Mouse drag para desktop
    track.addEventListener('mousedown', function(e) {
        if (maxPosition === 0) return;
        startX = e.clientX;
        isDragging = true;
        track.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', function(e) {
        if (!isDragging || maxPosition === 0) return;
        e.preventDefault();
    });

    document.addEventListener('mouseup', function(e) {
        if (!isDragging || maxPosition === 0) return;
        
        const endX = e.clientX;
        const diff = startX - endX;
        const swipeThreshold = 50;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0 && currentPosition < maxPosition) {
                currentPosition++; // Drag para esquerda
            } else if (diff < 0 && currentPosition > 0) {
                currentPosition--; // Drag para direita
            }
            updateCarousel();
        }
        
        isDragging = false;
        track.style.cursor = 'grab';
    });

    // Inicialização
    calculateDimensions();
    updateCarousel();
    
    // Recalcula em redimensionamento - OTIMIZADO
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(handleResize, 250);
    });

    // Recalcula quando as imagens carregarem (evita problemas com loading)
    window.addEventListener('load', handleResize);
});