 // Accordion functionality
        const faqItems = document.querySelectorAll('.faq-item');

        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');

            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');

                // Fechar todos os itens
                faqItems.forEach(faq => {
                    faq.classList.remove('active');
                });

                // Abrir o item clicado se não estava ativo
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        });