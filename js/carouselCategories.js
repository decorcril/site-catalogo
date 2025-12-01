document.addEventListener('DOMContentLoaded', function() {
    const track = document.querySelector('.categories__track');
    const prevBtn = document.querySelector('.carousel__btn--prev');
    const nextBtn = document.querySelector('.carousel__btn--next');
    const cards = document.querySelectorAll('.category__card');
    const indicatorDots = document.querySelectorAll('.indicator-dot');
    
    let currentPosition = 0;
    let cardWidth = 0;
    let gap = 0;
    let visibleCards = 0;
    let maxPosition = 0;
    let isMobile = window.innerWidth <= 768;
    let totalSlides = 0;

    function calculateDimensions() {
        if (cards.length === 0) return;
        
        const firstCard = cards[0];
        const cardStyle = window.getComputedStyle(firstCard);
        cardWidth = firstCard.offsetWidth;
        
        const trackStyle = window.getComputedStyle(track);
        gap = parseInt(trackStyle.gap) || 25;
        
        const containerWidth = track.parentElement.offsetWidth;
        const totalCardWidth = cardWidth + gap;
        visibleCards = Math.floor(containerWidth / totalCardWidth);
        
        maxPosition = Math.max(0, cards.length - visibleCards);
        
        totalSlides = maxPosition + 1;
        
        updateIndicatorsCount();
    }

    function updateIndicatorsCount() {
        const dotsContainer = document.querySelector('.indicator-dots');
        if (!dotsContainer) return;
        
        dotsContainer.innerHTML = '';
        
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('span');
            dot.className = 'indicator-dot risk';
            dot.dataset.slide = i;
            if (i === 0) dot.classList.add('active');
            
            dot.addEventListener('click', function() {
                const slideIndex = parseInt(this.dataset.slide);
                currentPosition = slideIndex;
                updateCarousel();
            });
            
            dotsContainer.appendChild(dot);
        }
    }

    function updateIndicators() {
        const dots = document.querySelectorAll('.indicator-dot');
        if (dots.length === 0) return;
        
        const activeSlide = currentPosition;
        
        dots.forEach((dot, index) => {
            dot.classList.remove('active');
            if (index === activeSlide) {
                dot.classList.add('active');
            }
        });
    }

    function updateCarousel() {
        if (cards.length === 0) return;
        
        const moveDistance = currentPosition * (cardWidth + gap);
        track.style.transform = `translateX(-${moveDistance}px)`;
        
        const isAtStart = currentPosition === 0;
        const isAtEnd = currentPosition >= maxPosition;
        
        if (!isMobile) {
            prevBtn.style.opacity = isAtStart ? '0.4' : '1';
            prevBtn.style.cursor = isAtStart ? 'not-allowed' : 'pointer';
            prevBtn.disabled = isAtStart;
            
            nextBtn.style.opacity = isAtEnd ? '0.4' : '1';
            nextBtn.style.cursor = isAtEnd ? 'not-allowed' : 'pointer';
            nextBtn.disabled = isAtEnd;

            if (maxPosition === 0) {
                prevBtn.style.display = 'none';
                nextBtn.style.display = 'none';
            } else {
                prevBtn.style.display = 'flex';
                nextBtn.style.display = 'flex';
            }
        } else {

            prevBtn.style.display = 'none';
            nextBtn.style.display = 'none';
        }
        

        updateIndicators();
    }

    function handleResize() {
        isMobile = window.innerWidth <= 768;
        
        setTimeout(() => {
            calculateDimensions();
            
            if (currentPosition > maxPosition) {
                currentPosition = Math.max(0, maxPosition);
            }
            
            if (maxPosition === 0) {
                currentPosition = 0;
            }
            
            updateCarousel();
        }, 150);
    }

    if (!isMobile) {
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
    }

    indicatorDots.forEach(dot => {
        dot.addEventListener('click', function() {
            const slideIndex = parseInt(this.dataset.slide);
            currentPosition = slideIndex;
            updateCarousel();
        });
    });

    let startX = 0;
    let isDragging = false;
    
    track.addEventListener('touchstart', function(e) {
        if (maxPosition === 0) return;
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
                currentPosition++;
            } else if (diff < 0 && currentPosition > 0) {
                currentPosition--;
            }
            updateCarousel();
        }
        isDragging = false;
        track.style.cursor = 'grab';
    });

    if (!isMobile) {
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
                    currentPosition++;
                } else if (diff < 0 && currentPosition > 0) {
                    currentPosition--;
                }
                updateCarousel();
            }
            
            isDragging = false;
            track.style.cursor = 'grab';
        });
    }

    // Inicialização
    calculateDimensions();
    updateCarousel();
    
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(handleResize, 250);
    });

    window.addEventListener('load', handleResize);
});