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
        "Apple iPad": ["iPad Pro M2", "iPad Air", "iPad Mini", "iPad 10th Gen"],
        "Apple MacBook": ["MacBook Pro M3", "MacBook Air M2", "MacBook Pro 16", "iMac"],
        "Nintendo": ["Switch OLED", "Switch Lite", "Switch V2"],
        "Sony PlayStation": ["PS5", "PS4 Pro", "PS4 Slim"]
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
    contact: {
        name: '',
        email: '',
        phone: '',
        address: ''
    }
};

const STEPS_TOTAL = 8;
const STEP_TITLES = [
    "",
    "Type d'appareil",
    "Marque",
    "Modèle",
    "Symptômes & Pannes",
    "Prise en charge",
    "Date & Créneau",
    "Vos coordonnées",
    "Récapitulatif"
];

// INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
    initSlots();
    updateProgress();
});

function initSlots() {
    const slots = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00", "18:00"];
    const grid = document.getElementById('slot-grid');
    slots.forEach(s => {
        const btn = document.createElement('button');
        btn.className = 'slot-btn';
        btn.innerText = s;
        btn.onclick = () => selectSlot(s, btn);
        grid.appendChild(btn);
    });
}

// NAVIGATION
function nextStep() {
    if (!validateStep()) return;
    if (currentState.step < STEPS_TOTAL) {
        document.getElementById(`step-${currentState.step}`).classList.add('hidden');
        currentState.step++;
        document.getElementById(`step-${currentState.step}`).classList.remove('hidden');
        updateProgress();
        if (currentState.step === 8) renderSummary();
    }
}

function prevStep() {
    if (currentState.step > 1) {
        document.getElementById(`step-${currentState.step}`).classList.add('hidden');
        currentState.step--;
        document.getElementById(`step-${currentState.step}`).classList.remove('hidden');
        updateProgress();
    }
}

function updateProgress() {
    const fill = document.getElementById('progress-fill');
    const indicator = document.getElementById('step-indicator');
    const percent = (currentState.step / STEPS_TOTAL) * 100;
    fill.style.width = `${percent}%`;
    indicator.innerText = `Étape ${currentState.step} / ${STEPS_TOTAL} — ${STEP_TITLES[currentState.step]}`;
    window.scrollTo(0, 0);
}

function validateStep() {
    if (currentState.step === 3) {
        const custom = document.getElementById('model-custom').value;
        if (custom) currentState.model = custom;
        if (!currentState.model) {
            alert('Veuillez sélectionner ou saisir un modèle.');
            return false;
        }
    }
    if (currentState.step === 4) {
        const checked = document.querySelectorAll('input[name="repair"]:checked');
        if (checked.length === 0) {
            alert('Veuillez sélectionner au moins une panne.');
            return false;
        }
        currentState.repairs = Array.from(checked).map(c => ({
            label: c.parentElement.querySelector('strong').innerText,
            price: parseInt(c.getAttribute('data-price'))
        }));
    }
    if (currentState.step === 6) {
        currentState.date = document.getElementById('appointment-date').value;
        if (!currentState.date || !currentState.slot) {
            alert('Veuillez choisir une date et un créneau.');
            return false;
        }
    }
    if (currentState.step === 7) {
        currentState.contact.name = document.getElementById('contact-name').value;
        currentState.contact.email = document.getElementById('contact-email').value;
        currentState.contact.phone = document.getElementById('contact-phone').value;
        currentState.contact.address = document.getElementById('contact-address').value;
        if (!currentState.contact.name || !currentState.contact.email || !currentState.contact.phone) {
            alert('Veuillez remplir les informations de contact.');
            return false;
        }
    }
    return true;
}

// SELECTION LOGIC
function selectCategory(cat) {
    currentState.category = cat;
    const brandGrid = document.getElementById('brand-grid');
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
    modelGrid.innerHTML = '';
    
    const models = DATA.brands[brand] || ["Non listé"];
    models.forEach(m => {
        const btn = document.createElement('button');
        btn.className = 'wizard-option';
        btn.innerHTML = `<h3>${m}</h3>`;
        btn.onclick = () => {
            document.querySelectorAll('#model-grid .wizard-option').forEach(x => x.classList.remove('active'));
            btn.classList.add('active');
            currentState.model = m;
        };
        modelGrid.appendChild(btn);
    });
    
    nextStep();
}

function selectPickup(mode, fee) {
    currentState.pickup = mode;
    currentState.pickupFee = fee;
    
    // Highlight UI
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

// SUMMARY
function renderSummary() {
    const total = currentState.repairs.reduce((acc, curr) => acc + curr.price, 0) + currentState.pickupFee;
    document.getElementById('recap-total').innerText = `${total} €`;
    
    const details = document.getElementById('recap-details');
    details.innerHTML = `
        <p><strong>Appareil :</strong> ${currentState.category.toUpperCase()} — ${currentState.brand} ${currentState.model}</p>
        <p><strong>Pannes détectées :</strong> ${currentState.repairs.map(r => r.label).join(', ')}</p>
        <p><strong>Prise en charge :</strong> ${currentState.pickup.toUpperCase()} (+${currentState.pickupFee}€)</p>
        <p><strong>Rendez-vous :</strong> le ${currentState.date} à ${currentState.slot}</p>
        <hr style="margin: 1rem 0; border: none; border-top: 1px solid #EEE;">
        <p><strong>Client :</strong> ${currentState.contact.name}</p>
        <p><strong>Contact :</strong> ${currentState.contact.phone} | ${currentState.contact.email}</p>
        ${currentState.contact.address ? `<p><strong>Adresse :</strong> ${currentState.contact.address}</p>` : ''}
    `;
}

function confirmQuote() {
    // Simuler l'envoi
    const btn = event.target;
    btn.innerText = "Envoi en cours...";
    btn.disabled = true;
    
    setTimeout(() => {
        document.getElementById('step-8').classList.add('hidden');
        document.getElementById('step-success').classList.remove('hidden');
        document.getElementById('step-indicator').innerText = "Demande confirmée";
        document.getElementById('progress-fill').style.width = "100%";
    }, 1500);
}
