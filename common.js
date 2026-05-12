document.addEventListener('DOMContentLoaded', () => {
    // ========================
    // 1. Mobile Menu Toggle
    // ========================
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('.header-nav');
    
    if (hamburger && nav) {
        hamburger.addEventListener('click', () => {
            nav.classList.toggle('active');
            hamburger.innerText = nav.classList.contains('active') ? 'close' : 'menu';
        });
    }

    // ========================
    // 2. Dynamic Copyright Year
    // ========================
    const footerP = document.querySelector('.footer-bottom p');
    if (footerP) {
        const year = new Date().getFullYear();
        footerP.innerHTML = footerP.innerHTML.replace(/2025/g, year);
    }

    // ========================
    // 3. Search Bar (crash-safe)
    // ========================
    const searchInput = document.querySelector('.search-bar input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            const cards = document.querySelectorAll('.product-card, .logiciel-card');
            if (cards.length === 0) return; // no cards on this page, do nothing
            cards.forEach(card => {
                const titleEl = card.querySelector('.product-title, .logiciel-title');
                if (!titleEl) return;
                const title = titleEl.innerText.toLowerCase();
                card.style.display = title.includes(query) ? '' : 'none';
            });
            updateProductCount();
        });
    }

    // ========================
    // 4. Catalog Filtering Logic
    // ========================
    const filterInputs = document.querySelectorAll('.sidebar-filters input[type="checkbox"]');
    const priceFilter = document.getElementById('price-filter');
    const priceVal = document.getElementById('price-val');

    function applyFilters() {
        const selectedBrands = getCheckedValues('brand');
        const selectedEtats = getCheckedValues('etat');
        const selectedCaps = getCheckedValues('cap');
        const maxPrice = priceFilter ? parseInt(priceFilter.value) : 99999;
        
        if (priceVal) priceVal.innerText = `${maxPrice}€`;

        const cards = document.querySelectorAll('.product-card[data-brand]');
        cards.forEach(card => {
            const b = card.getAttribute('data-brand');
            const e = card.getAttribute('data-etat');
            const c = card.getAttribute('data-cap');
            const p = parseInt(card.getAttribute('data-price') || '0');

            const brandMatch = selectedBrands.length === 0 || selectedBrands.includes(b);
            const etatMatch = selectedEtats.length === 0 || selectedEtats.includes(e);
            const capMatch = selectedCaps.length === 0 || selectedCaps.includes(c);
            const priceMatch = p <= maxPrice;

            card.style.display = (brandMatch && etatMatch && capMatch && priceMatch) ? '' : 'none';
        });
        updateProductCount();
    }

    function getCheckedValues(name) {
        return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`)).map(i => i.value);
    }

    function updateProductCount() {
        const countEl = document.getElementById('product-count');
        if (!countEl) return;
        const visible = document.querySelectorAll('.product-card:not([style*="display: none"])');
        countEl.innerText = visible.length;
    }

    if (filterInputs.length > 0) {
        filterInputs.forEach(input => input.addEventListener('change', applyFilters));
    }
    if (priceFilter) {
        priceFilter.addEventListener('input', applyFilters);
    }

    // ========================
    // 5. Sort Select
    // ========================
    const sortSelect = document.getElementById('sort-filter');
    if (sortSelect) {
        sortSelect.addEventListener('change', () => {
            const grid = document.getElementById('products-grid');
            if (!grid) return;
            const cards = Array.from(grid.querySelectorAll('.product-card'));
            const val = sortSelect.value;

            if (val === 'price-asc') {
                cards.sort((a, b) => parseInt(a.getAttribute('data-price') || '0') - parseInt(b.getAttribute('data-price') || '0'));
            } else if (val === 'price-desc') {
                cards.sort((a, b) => parseInt(b.getAttribute('data-price') || '0') - parseInt(a.getAttribute('data-price') || '0'));
            }
            cards.forEach(c => grid.appendChild(c));
        });
    }

    // ========================
    // 6. Contact Form Handler
    // ========================
    const contactBtn = document.getElementById('contact-send-btn');
    if (contactBtn) {
        contactBtn.addEventListener('click', () => {
            const name = document.getElementById('contact-form-name');
            const email = document.getElementById('contact-form-email');
            const phone = document.getElementById('contact-form-phone');
            const subject = document.getElementById('contact-form-subject');
            const message = document.getElementById('contact-form-message');

            if (!name?.value || !email?.value || !message?.value) {
                alert('Veuillez remplir les champs obligatoires (Nom, Email, Message).');
                return;
            }

            contactBtn.innerHTML = '<span class="material-symbols-outlined icon-small">hourglass_top</span> Envoi en cours...';
            contactBtn.disabled = true;

            setTimeout(() => {
                const recap = `✅ Message envoyé avec succès !\n\nNom : ${name.value}\nEmail : ${email.value}\nTéléphone : ${phone?.value || 'Non renseigné'}\nSujet : ${subject?.value || 'Général'}\n\nNotre équipe vous répondra sous 24h.`;
                alert(recap);
                contactBtn.innerHTML = '<span class="material-symbols-outlined icon-small">check_circle</span> Message envoyé !';
                contactBtn.style.background = '#4CAF50';
                contactBtn.style.color = 'white';
            }, 1500);
        });
    }

    // ========================
    // 7. Product Option Buttons
    // ========================
    document.querySelectorAll('.options-list').forEach(group => {
        group.querySelectorAll('.option-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                group.querySelectorAll('.option-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    });

    // ========================
    // 8. Product Thumbnail Switcher
    // ========================
    document.querySelectorAll('.thumbnail').forEach(thumb => {
        thumb.addEventListener('click', () => {
            const mainImg = document.querySelector('.main-img-container img');
            if (!mainImg) return;
            mainImg.src = thumb.src.replace('w=200', 'w=600');
            document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');
        });
    });

    // ========================
    // 9. Header Scroll Effect
    // ========================
    window.addEventListener('scroll', () => {
        const header = document.getElementById('main-header');
        if (!header) return;
        if (window.scrollY > 50) header.classList.add('scrolled');
        else header.classList.remove('scrolled');
    });

    // ========================
    // 10. Fade-in Observer
    // ========================
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
    }, { threshold: 0.1 });
    document.querySelectorAll('.fade-in-up').forEach(el => observer.observe(el));

    // ========================
    // 11. Active Nav Highlight
    // ========================
    const currentUrl = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('href') === currentUrl) link.style.color = 'var(--color-primary)';
    });

    // ========================
    // 12. Logiciel "Acheter" buttons
    // ========================
    document.querySelectorAll('.logiciel-card .btn-primary').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const card = btn.closest('.logiciel-card');
            const title = card?.querySelector('.logiciel-title')?.innerText || 'Produit';
            const price = card?.querySelector('.logiciel-price')?.innerText || '';
            
            btn.innerHTML = '⏳ Traitement...';
            btn.style.pointerEvents = 'none';

            setTimeout(() => {
                alert(`✅ Commande "${title}" (${price}) enregistrée !\n\nVous recevrez votre clé d'activation par email sous 15 minutes.\nPour toute question : 07 56 91 65 93`);
                btn.innerHTML = '✅ Commandé';
                btn.style.background = '#4CAF50';
                btn.style.color = 'white';
            }, 1500);
        });
    });
});
