// DATA
const DATA = {
    categories: {
        smartphone: { brands: ["Apple", "Samsung", "Xiaomi", "Huawei", "Google", "Autre"] },
        tablette: { brands: ["Apple iPad", "Samsung Galaxy Tab", "Lenovo", "Autre"] },
        ordinateur: { brands: ["Apple MacBook", "Dell", "HP", "Lenovo", "Asus", "Autre"] },
        console: { brands: ["Nintendo", "Sony PlayStation", "Microsoft Xbox", "Autre"] }
    },
    brands: {
        "Apple": ["iPhone 15 Pro", "iPhone 15", "iPhone 14", "iPhone 13", "iPhone 12", "iPhone 11", "iPhone SE"],
        "Samsung": ["Galaxy S23", "Galaxy S22", "Galaxy S21", "Galaxy A54", "Galaxy Z Flip"],
        "Xiaomi": ["Redmi Note 12", "Xiaomi 13 Ultra", "Xiaomi 12T", "Poco F5"],
        "Huawei": ["P60 Pro", "Mate 50 Pro", "P40 Lite"],
        "Google": ["Pixel 8 Pro", "Pixel 7a", "Pixel 6"],
        "Apple iPad": ["iPad Pro M2", "iPad Air", "iPad Mini", "iPad 10th Gen"],
        "Samsung Galaxy Tab": ["Galaxy Tab S9", "Galaxy Tab S8", "Galaxy Tab A8"],
        "Lenovo": ["Tab P11", "Yoga Tab 13"],
        "Apple MacBook": ["MacBook Pro M3", "MacBook Air M2", "MacBook Pro 16", "iMac"],
        "Dell": ["XPS 13", "Latitude 5420", "Inspiron 15"],
        "HP": ["Spectre x360", "Pavilion", "Envy"],
        "Asus": ["ZenBook", "ROG Zephyrus", "Vivobook"],
        "Nintendo": ["Switch OLED", "Switch Lite", "Switch V2"],
        "Sony PlayStation": ["PS5", "PS4 Pro", "PS4 Slim"],
        "Microsoft Xbox": ["Xbox Series X", "Xbox Series S", "Xbox One X"]
    }
};

let currentState = {
    step: 1,
    category: '',
    brand: '',
    model: '',
    repairs: [],
    pickup: '',
    pickupFee: 0,
    date: '',
    slot: '',
    contact: { name: '', email: '', phone: '', address: '' }
};

const STEPS_TOTAL = 8;
const STEP_TITLES = [
    "", "Type d'appareil", "Marque", "Modèle",
    "Symptômes & Pannes", "Prise en charge", "Date & Créneau",
    "Vos coordonnées", "Récapitulatif"
];

document.addEventListener('DOMContentLoaded', () => {
    const step1 = document.getElementById('step-1');
    if (step1) step1.classList.add('active');
    initSlots();
    updateProgress();
    handleUrlParams();
});

function handleUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const model = params.get('model');
    if (model) {
        currentState.model = model;
        if (model.toLowerCase().includes('iphone') || model.toLowerCase().includes('ipad')) {
            currentState.brand = 'Apple';
            currentState.category = model.toLowerCase().includes('ipad') ? 'tablette' : 'smartphone';
        } else if (model.toLowerCase().includes('galaxy') || model.toLowerCase().includes('samsung')) {
            currentState.brand = 'Samsung';
            currentState.category = model.toLowerCase().includes('tab') ? 'tablette' : 'smartphone';
        } else if (model.toLowerCase().includes('macbook') || model.toLowerCase().includes('imac')) {
            currentState.brand = 'Apple MacBook';
            currentState.category = 'ordinateur';
        } else if (model.toLowerCase().includes('pixel')) {
            currentState.brand = 'Google';
            currentState.category = 'smartphone';
        } else {
            currentState.brand = 'Autre';
            currentState.category = 'smartphone';
        }
        for (let i = 1; i <= STEPS_TOTAL; i++) {
            const el = document.getElementById(`step-${i}`);
            if (el) { el.classList.remove('active'); el.classList.add('hidden'); }
        }
        currentState.step = 4;
        const step4 = document.getElementById('step-4');
        step4.classList.remove('hidden');
        step4.classList.add('active');
        updateProgress();
    }
}

function initSlots() {
    const slots = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00", "18:00"];
    const grid = document.getElementById('slot-grid');
    if (!grid) return;
    grid.innerHTML = '';
    slots.forEach(s => {
        const btn = document.createElement('button');
        btn.className = 'slot-btn';
        btn.innerText = s;
        btn.onclick = () => selectSlot(s, btn);
        grid.appendChild(btn);
    });
}

function nextStep() {
    if (!validateStep()) return;
    if (currentState.step < STEPS_TOTAL) {
        const current = document.getElementById(`step-${currentState.step}`);
        current.classList.remove('active');
        current.classList.add('hidden');
        currentState.step++;
        const next = document.getElementById(`step-${currentState.step}`);
        next.classList.remove('hidden');
        next.classList.add('active');
        updateProgress();
        if (currentState.step === 8) renderSummary();
    }
}

function prevStep() {
    if (currentState.step > 1) {
        const current = document.getElementById(`step-${currentState.step}`);
        current.classList.remove('active');
        current.classList.add('hidden');
        currentState.step--;
        const prev = document.getElementById(`step-${currentState.step}`);
        prev.classList.remove('hidden');
        prev.classList.add('active');
        updateProgress();
    }
}

function updateProgress() {
    const fill = document.getElementById('progress-fill');
    const indicator = document.getElementById('step-indicator');
    if (!fill || !indicator) return;
    const percent = (currentState.step / STEPS_TOTAL) * 100;
    fill.style.width = `${percent}%`;
    indicator.innerText = `Étape ${currentState.step} / ${STEPS_TOTAL} — ${STEP_TITLES[currentState.step]}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function validateStep() {
    if (currentState.step === 1 && !currentState.category) { alert('Veuillez sélectionner un type d\'appareil.'); return false; }
    if (currentState.step === 2 && !currentState.brand) { alert('Veuillez sélectionner une marque.'); return false; }
    if (currentState.step === 3) {
        const custom = document.getElementById('model-custom').value;
        if (custom) currentState.model = custom;
        if (!currentState.model) { alert('Veuillez sélectionner ou saisir un modèle.'); return false; }
    }
    if (currentState.step === 4) {
        const checked = document.querySelectorAll('input[name="repair"]:checked');
        if (checked.length === 0) { alert('Veuillez sélectionner au moins une panne.'); return false; }
        currentState.repairs = Array.from(checked).map(c => ({
            label: c.parentElement.querySelector('strong').innerText,
            price: parseInt(c.getAttribute('data-price'))
        }));
    }
    if (currentState.step === 6) {
        currentState.date = document.getElementById('appointment-date').value;
        if (!currentState.date || !currentState.slot) { alert('Veuillez choisir une date et un créneau.'); return false; }
    }
    if (currentState.step === 7) {
        currentState.contact.name = document.getElementById('contact-name').value;
        currentState.contact.email = document.getElementById('contact-email').value;
        currentState.contact.phone = document.getElementById('contact-phone').value;
        currentState.contact.address = document.getElementById('contact-address').value;
        if (!currentState.contact.name || !currentState.contact.email || !currentState.contact.phone) { alert('Veuillez remplir les informations de contact.'); return false; }
    }
    return true;
}

function selectCategory(cat) {
    currentState.category = cat;
    const brandGrid = document.getElementById('brand-grid');
    if (!brandGrid) return;
    brandGrid.innerHTML = '';
    const brands = DATA.categories[cat].brands;
    brands.forEach(b => {
        const btn = document.createElement('button');
        btn.className = 'wizard-option';
        btn.innerHTML = `<h3>${b}</h3>`;
        btn.onclick = () => selectBrand(b);
        brandGrid.appendChild(btn);
    });
    nextStep();
}

function selectBrand(brand) {
    currentState.brand = brand;
    const modelGrid = document.getElementById('model-grid');
    if (!modelGrid) return;
    modelGrid.innerHTML = '';
    const models = DATA.brands[brand] || ["Autre / Non listé"];
    models.forEach(m => {
        const btn = document.createElement('button');
        btn.className = 'wizard-option';
        btn.innerHTML = `<h3>${m}</h3>`;
        btn.onclick = () => {
            document.querySelectorAll('#model-grid .wizard-option').forEach(x => x.classList.remove('active'));
            btn.classList.add('active');
            currentState.model = m;
            setTimeout(() => nextStep(), 300);
        };
        modelGrid.appendChild(btn);
    });
    nextStep();
}

function selectPickup(mode, fee) {
    currentState.pickup = mode;
    currentState.pickupFee = fee;
    document.querySelectorAll('#step-5 .wizard-option').forEach((opt, idx) => {
        opt.classList.remove('active');
        if ((mode === 'boutique' && idx === 0) || (mode === 'domicile' && idx === 1) || (mode === 'postal' && idx === 2)) {
            opt.classList.add('active');
        }
    });
    setTimeout(() => nextStep(), 300);
}

function selectSlot(slot, btn) {
    currentState.slot = slot;
    document.querySelectorAll('.slot-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
}

function renderSummary() {
    const total = currentState.repairs.reduce((acc, curr) => acc + curr.price, 0) + currentState.pickupFee;
    const totalEl = document.getElementById('recap-total');
    if (totalEl) totalEl.innerText = `${total} €`;
    const details = document.getElementById('recap-details');
    if (!details) return;
    details.innerHTML = `
        <div style="display:grid; gap:0.5rem; background: #F9F9F9; padding: 1.5rem; border-radius: 12px; border: 1px solid #EEE;">
            <p><strong>Appareil :</strong> ${currentState.category.toUpperCase()} — ${currentState.brand} ${currentState.model}</p>
            <p><strong>Pannes détectées :</strong> ${currentState.repairs.map(r => r.label).join(', ')}</p>
            <p><strong>Prise en charge :</strong> ${currentState.pickup.toUpperCase()} (+${currentState.pickupFee}€)</p>
            <p><strong>Rendez-vous :</strong> le ${currentState.date} à ${currentState.slot}</p>
            <hr style="margin: 0.5rem 0; border: none; border-top: 1px solid #DDD;">
            <p><strong>Client :</strong> ${currentState.contact.name}</p>
            <p><strong>Contact :</strong> ${currentState.contact.phone} | ${currentState.contact.email}</p>
            ${currentState.contact.address ? `<p><strong>Adresse :</strong> ${currentState.contact.address}</p>` : ''}
        </div>
    `;
}

async function confirmQuote(btn) {
    if (currentState.repairs.length === 0) { alert("Veuillez sélectionner au moins une panne."); return; }
    btn.innerHTML = "Envoi en cours...";
    btn.disabled = true;

    try {
        const response = await fetch('/api/devis', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(currentState)
        });
        const result = await response.json();

        if (result.success) {
            document.getElementById('step-8').classList.remove('active');
            document.getElementById('step-8').classList.add('hidden');
            const success = document.getElementById('step-success');
            success.classList.remove('hidden');
            success.classList.add('active');
            document.getElementById('step-indicator').innerText = "Demande confirmée";
            const progressFill = document.getElementById('progress-fill');
            if (progressFill) progressFill.style.width = "100%";
        } else {
            alert("Erreur lors de l'envoi. Veuillez réessayer.");
            btn.innerHTML = "Confirmer ma demande";
            btn.disabled = false;
        }
    } catch (err) {
        alert("Erreur réseau. Veuillez réessayer.");
        btn.innerHTML = "Confirmer ma demande";
        btn.disabled = false;
    }
}
