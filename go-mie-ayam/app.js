/* ==========================================
   GO Mie Ayam - Premium JS Logic & Simulator
   ========================================== */

// 1. Data Menu Produk
const MENU_DATA = [
    {
        id: "mie-biasa",
        name: "Mie Ayam Biasa",
        category: "mie",
        description: "Mie kenyal buatan sendiri dengan potongan ayam bumbu kecap manis gurih, caisim segar, daun bawang, dan kuah kaldu terpisah.",
        price: 18000,
        image: "assets/mie-biasa.jpg",
        tag: "Terlaris",
        customizations: {
            noodles: ["Mie Biasa", "Mie Lebar", "Mie Karet"],
            spicy: ["Tidak Pedas", "Sedang (Lvl 1)", "Pedas (Lvl 2)", "Super Pedas (Lvl 3)"]
        }
    },
    {
        id: "mie-bakso",
        name: "Mie Ayam Bakso",
        category: "mie",
        description: "Mie Ayam Biasa disajikan lengkap dengan 3 buah bakso sapi premium yang empuk, kenyal, dan berkuah gurih.",
        price: 23000,
        image: "assets/mie-bakso.jpg",
        tag: "Rekomendasi",
        customizations: {
            noodles: ["Mie Biasa", "Mie Lebar", "Mie Karet"],
            spicy: ["Tidak Pedas", "Sedang (Lvl 1)", "Pedas (Lvl 2)", "Super Pedas (Lvl 3)"]
        }
    },
    {
        id: "mie-ceker",
        name: "Mie Ayam Ceker",
        category: "mie",
        description: "Mie Ayam dengan tambahan toping 3 ceker ayam empuk berbumbu rempah kecap meresap hingga ke tulang.",
        price: 21000,
        image: "assets/mie-biasa.jpg", // reuse image or fallback
        tag: "Favorit",
        customizations: {
            noodles: ["Mie Biasa", "Mie Lebar", "Mie Karet"],
            spicy: ["Tidak Pedas", "Sedang (Lvl 1)", "Pedas (Lvl 2)", "Super Pedas (Lvl 3)"]
        }
    },
    {
        id: "pangsit-goreng",
        name: "Pangsit Goreng Crispy",
        category: "side",
        description: "5 Pcs pangsit goreng renyah dengan isian ayam giling gurih, disajikan dengan saus asam manis khas GO Mie Ayam.",
        price: 15000,
        image: "assets/pangsit.jpg",
        tag: "Camilan",
        customizations: {
            spicy: ["Saus Asam Manis", "Saus Sambal Pedas"]
        }
    },
    {
        id: "bakso-kuah",
        name: "Bakso Kuah (5 Pcs)",
        category: "side",
        description: "5 Buah bakso sapi premium yang disajikan dalam semangkuk kuah kaldu ayam gurih bertabur seledri dan bawang goreng.",
        price: 15000,
        image: "assets/mie-bakso.jpg", // fallback
        tag: "Tambahan",
        customizations: {
            spicy: ["Tidak Pedas", "Pedas (Pakai Sambal)"]
        }
    },
    {
        id: "es-teh",
        name: "Es Teh Manis",
        category: "drink",
        description: "Es teh manis segar beraroma melati khas, pelepas dahaga terbaik setelah menyantap mie ayam panas pedas.",
        price: 5000,
        image: "assets/esteh.jpg",
        tag: "Segar",
        customizations: {
            sugar: ["Manis Normal", "Kurang Manis", "Tawar (Tanpa Gula)"]
        }
    },
    {
        id: "es-jeruk",
        name: "Es Jeruk Peras",
        category: "drink",
        description: "Es jeruk peras dari jeruk manis segar berkualitas dengan gula cair murni, kaya akan vitamin C.",
        price: 8000,
        image: "assets/esteh.jpg", // fallback
        tag: "Segar",
        customizations: {
            sugar: ["Manis Normal", "Kurang Manis", "Tawar (Tanpa Gula)"]
        }
    }
];

// 2. State Aplikasi
let cart = [];
let selectedProduct = null;
let currentCategory = "all";
let trackingTimer = null;

// 3. DOM Elements
const menuGrid = document.getElementById("menu-grid");
const categoryTabs = document.querySelectorAll(".category-tab");
const cartSidebar = document.getElementById("cart-sidebar");
const sidebarOverlay = document.getElementById("sidebar-overlay");
const openCartBtn = document.getElementById("open-cart-btn");
const closeCartBtn = document.getElementById("close-cart-btn");
const cartItemsContainer = document.getElementById("cart-items-container");
const cartCountBadge = document.getElementById("cart-count");
const cartSubtotalEl = document.getElementById("cart-subtotal");
const cartShippingEl = document.getElementById("cart-shipping");
const cartTotalEl = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");

const customizeModal = document.getElementById("customize-modal");
const closeModalBtn = document.getElementById("close-modal-btn");
const modalDetails = document.getElementById("modal-details");

const checkoutModal = document.getElementById("checkout-modal");
const closeCheckoutBtn = document.getElementById("close-checkout-btn");
const checkoutForm = document.getElementById("checkout-form");
const checkoutSummaryItems = document.getElementById("checkout-summary-items");
const checkoutFinalAmount = document.getElementById("checkout-final-amount");
const deliveryDistanceSelect = document.getElementById("delivery-distance");

// Tracker Elements
const trackerSection = document.getElementById("tracker-section");
const navTrackOrder = document.getElementById("nav-track-order");
const trackOrderId = document.getElementById("track-order-id");
const trackOrderTime = document.getElementById("track-order-time");
const trackPaymentMethod = document.getElementById("track-payment-method");
const scooterCourier = document.getElementById("scooter-courier");
const logList = document.getElementById("log-list");
const orderAgainBtn = document.getElementById("order-again-btn");

// Steps Tracker Elements
const stepReceived = document.getElementById("step-received");
const stepCooking = document.getElementById("step-cooking");
const stepDelivery = document.getElementById("step-delivery");
const stepCompleted = document.getElementById("step-completed");

// ==========================================
// A. Rendering Menu
// ==========================================
function renderMenu() {
    menuGrid.innerHTML = "";
    const filteredMenu = currentCategory === "all" 
        ? MENU_DATA 
        : MENU_DATA.filter(item => item.category === currentCategory);

    filteredMenu.forEach(product => {
        const card = document.createElement("div");
        card.className = "menu-card glass";
        card.innerHTML = `
            <div class="menu-img-container">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
                <span class="menu-tag">${product.tag}</span>
            </div>
            <div class="menu-info">
                <h3>${product.name}</h3>
                <p class="menu-desc">${product.description}</p>
                <div class="menu-footer">
                    <span class="menu-price">${formatRupiah(product.price)}</span>
                    <button class="add-btn" onclick="openCustomizeModal('${product.id}')">
                        <i class="fa-solid fa-plus"></i>
                    </button>
                </div>
            </div>
        `;
        menuGrid.appendChild(card);
    });
}

// Category Filtering
categoryTabs.forEach(tab => {
    tab.addEventListener("click", () => {
        categoryTabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
        currentCategory = tab.dataset.category;
        renderMenu();
    });
});

// ==========================================
// B. Customization Modal Logic
// ==========================================
window.openCustomizeModal = function(productId) {
    selectedProduct = MENU_DATA.find(p => p.id === productId);
    if (!selectedProduct) return;

    let customizationsHTML = "";
    
    // Check if there are noodle types to customize
    if (selectedProduct.customizations.noodles) {
        customizationsHTML += `
            <div class="customization-section">
                <h4>Pilihan Jenis Mie <span style="font-size: 0.8rem; color: var(--color-primary);">* Wajib</span></h4>
                <div class="custom-options">
                    ${selectedProduct.customizations.noodles.map((noodle, idx) => `
                        <input type="radio" id="noodle-${idx}" name="noodle-type" value="${noodle}" ${idx === 0 ? 'checked' : ''} class="option-input">
                        <label for="noodle-${idx}" class="option-label">${noodle}</label>
                    `).join('')}
                </div>
            </div>
        `;
    }

    // Check if there are spice levels
    if (selectedProduct.customizations.spicy) {
        customizationsHTML += `
            <div class="customization-section">
                <h4>Tingkat Pedas / Saus <span style="font-size: 0.8rem; color: var(--color-primary);">* Wajib</span></h4>
                <div class="custom-options">
                    ${selectedProduct.customizations.spicy.map((spicy, idx) => `
                        <input type="radio" id="spicy-${idx}" name="spicy-level" value="${spicy}" ${idx === 0 ? 'checked' : ''} class="option-input">
                        <label for="spicy-${idx}" class="option-label">${spicy}</label>
                    `).join('')}
                </div>
            </div>
        `;
    }

    // Check sugar options (for drinks)
    if (selectedProduct.customizations.sugar) {
        customizationsHTML += `
            <div class="customization-section">
                <h4>Tingkat Kemanisan <span style="font-size: 0.8rem; color: var(--color-primary);">* Wajib</span></h4>
                <div class="custom-options">
                    ${selectedProduct.customizations.sugar.map((sugar, idx) => `
                        <input type="radio" id="sugar-${idx}" name="sugar-level" value="${sugar}" ${idx === 0 ? 'checked' : ''} class="option-input">
                        <label for="sugar-${idx}" class="option-label">${sugar}</label>
                    `).join('')}
                </div>
            </div>
        `;
    }

    modalDetails.innerHTML = `
        <div class="modal-product-header">
            <img class="modal-product-img" src="${selectedProduct.image}" alt="${selectedProduct.name}">
            <div class="modal-product-info">
                <h2>${selectedProduct.name}</h2>
                <p>${selectedProduct.description}</p>
                <div class="menu-price">${formatRupiah(selectedProduct.price)}</div>
            </div>
        </div>
        
        ${customizationsHTML}

        <div class="qty-selection-row">
            <h4>Jumlah Porsi</h4>
            <div class="qty-selector">
                <button class="qty-btn" onclick="updateModalQty(-1)"><i class="fa-solid fa-minus"></i></button>
                <span class="qty-value" id="modal-qty-val">1</span>
                <button class="qty-btn" onclick="updateModalQty(1)"><i class="fa-solid fa-plus"></i></button>
            </div>
        </div>

        <button class="btn btn-primary btn-block" onclick="addProductToCart()">Tambah ke Keranjang</button>
    `;

    customizeModal.classList.add("open");
};

window.updateModalQty = function(change) {
    const qtyVal = document.getElementById("modal-qty-val");
    let currentQty = parseInt(qtyVal.textContent);
    currentQty += change;
    if (currentQty < 1) currentQty = 1;
    qtyVal.textContent = currentQty;
};

closeModalBtn.addEventListener("click", () => {
    customizeModal.classList.remove("open");
});

// Close modal when clicking outside
customizeModal.addEventListener("click", (e) => {
    if (e.target === customizeModal) {
        customizeModal.classList.remove("open");
    }
});

// ==========================================
// C. Cart Management
// ==========================================
window.addProductToCart = function() {
    const qty = parseInt(document.getElementById("modal-qty-val").textContent);
    
    // Extract selected customizations
    const selectedNoodle = document.querySelector('input[name="noodle-type"]:checked')?.value || null;
    const selectedSpicy = document.querySelector('input[name="spicy-level"]:checked')?.value || null;
    const selectedSugar = document.querySelector('input[name="sugar-level"]:checked')?.value || null;

    // Create unique key based on customizations
    const customOptions = [];
    if (selectedNoodle) customOptions.push(selectedNoodle);
    if (selectedSpicy) customOptions.push(selectedSpicy);
    if (selectedSugar) customOptions.push(selectedSugar);

    const customLabel = customOptions.join(" - ");
    const cartItemId = `${selectedProduct.id}_${customOptions.join('_').replace(/\s+/g, '')}`;

    // Check if item already exists with exact same customizations
    const existingIndex = cart.findIndex(item => item.cartItemId === cartItemId);
    
    if (existingIndex > -1) {
        cart[existingIndex].quantity += qty;
    } else {
        cart.push({
            cartItemId: cartItemId,
            id: selectedProduct.id,
            name: selectedProduct.name,
            price: selectedProduct.price,
            image: selectedProduct.image,
            customLabel: customLabel,
            quantity: qty
        });
    }

    customizeModal.classList.remove("open");
    updateCartUI();
    showToast(`Berhasil menambahkan ${qty}x ${selectedProduct.name} ke keranjang!`);
    openCartSidebar();
};

function updateCartUI() {
    // 1. Update Cart Count Badge
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountBadge.textContent = totalItems;

    // 2. Render Cart Items
    cartItemsContainer.innerHTML = "";
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="cart-empty">
                <i class="fa-solid fa-basket-shopping"></i>
                <p>Keranjang belanja Anda kosong.</p>
                <p style="font-size: 0.8rem; margin-top: 5px;">Ayo pilih menu lezat kami!</p>
            </div>
        `;
        checkoutBtn.disabled = true;
    } else {
        cart.forEach(item => {
            const itemEl = document.createElement("div");
            itemEl.className = "cart-item";
            itemEl.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                <div class="cart-item-details">
                    <h5>${item.name}</h5>
                    ${item.customLabel ? `<div class="cart-item-opts">${item.customLabel}</div>` : ''}
                    <div class="cart-item-row">
                        <div class="cart-item-qty">
                            <button class="qty-btn" onclick="updateCartItemQty('${item.cartItemId}', -1)"><i class="fa-solid fa-minus" style="font-size: 0.7rem;"></i></button>
                            <span class="qty-value" style="font-size: 0.9rem;">${item.quantity}</span>
                            <button class="qty-btn" onclick="updateCartItemQty('${item.cartItemId}', 1)"><i class="fa-solid fa-plus" style="font-size: 0.7rem;"></i></button>
                        </div>
                        <div class="cart-item-price">${formatRupiah(item.price * item.quantity)}</div>
                        <button class="remove-item-btn" onclick="removeCartItem('${item.cartItemId}')"><i class="fa-solid fa-trash-can"></i></button>
                    </div>
                </div>
            `;
            cartItemsContainer.appendChild(itemEl);
        });
        checkoutBtn.disabled = false;
    }

    // 3. Subtotal & Total
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartSubtotalEl.textContent = formatRupiah(subtotal);

    // Calculate shipping based on chosen select distance or default 5000 if empty
    const distanceVal = parseInt(deliveryDistanceSelect.value) || 1;
    const shipping = getShippingCost(distanceVal);
    
    cartShippingEl.textContent = cart.length > 0 ? formatRupiah(shipping) : "Rp 0";
    cartTotalEl.textContent = cart.length > 0 ? formatRupiah(subtotal + shipping) : "Rp 0";
}

window.updateCartItemQty = function(cartItemId, change) {
    const item = cart.find(item => item.cartItemId === cartItemId);
    if (!item) return;

    item.quantity += change;
    if (item.quantity <= 0) {
        removeCartItem(cartItemId);
    } else {
        updateCartUI();
    }
};

window.removeCartItem = function(cartItemId) {
    cart = cart.filter(item => item.cartItemId !== cartItemId);
    updateCartUI();
};

function getShippingCost(distance) {
    if (distance <= 1) return 5000;
    if (distance <= 3) return 9000;
    if (distance <= 5) return 14000;
    return 22000;
}

// Sidebars control
function openCartSidebar() {
    cartSidebar.classList.add("open");
    sidebarOverlay.classList.add("open");
}

function closeCartSidebar() {
    cartSidebar.classList.remove("open");
    sidebarOverlay.classList.remove("open");
}

openCartBtn.addEventListener("click", openCartSidebar);
closeCartBtn.addEventListener("click", closeCartSidebar);
sidebarOverlay.addEventListener("click", closeCartSidebar);

// ==========================================
// D. Checkout Form Flow
// ==========================================
checkoutBtn.addEventListener("click", () => {
    closeCartSidebar();
    
    // Prepare checkout details
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = getShippingCost(parseInt(deliveryDistanceSelect.value));
    const total = subtotal + shipping;

    checkoutSummaryItems.innerHTML = cart.map(item => `
        <div class="checkout-summary-item">
            <span>${item.quantity}x ${item.name} (${item.customLabel || 'Normal'})</span>
            <span>${formatRupiah(item.price * item.quantity)}</span>
        </div>
    `).join("") + `
        <div class="checkout-summary-item" style="border-top: 1px dashed rgba(255,255,255,0.05); padding-top: 8px;">
            <span>Subtotal</span>
            <span>${formatRupiah(subtotal)}</span>
        </div>
        <div class="checkout-summary-item">
            <span>Ongkos Kirim</span>
            <span>${formatRupiah(shipping)}</span>
        </div>
    `;

    checkoutFinalAmount.textContent = formatRupiah(total);
    checkoutModal.classList.add("open");
});

closeCheckoutBtn.addEventListener("click", () => {
    checkoutModal.classList.remove("open");
});

// Update final checkout totals when user changes shipping distance
deliveryDistanceSelect.addEventListener("change", () => {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = getShippingCost(parseInt(deliveryDistanceSelect.value));
    const total = subtotal + shipping;
    
    // Update summary text
    updateCartUI(); // Synced with cart
    checkoutSummaryItems.querySelector(".checkout-summary-item:last-child").innerHTML = `
        <span>Ongkos Kirim</span>
        <span>${formatRupiah(shipping)}</span>
    `;
    checkoutFinalAmount.textContent = formatRupiah(total);
});

// Handle checkout submission & simulate tracking
checkoutForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("customer-name").value;
    const phone = document.getElementById("customer-phone").value;
    const distance = parseInt(deliveryDistanceSelect.value);
    const payment = document.getElementById("payment-method").value;
    const address = document.getElementById("customer-address").value;

    checkoutModal.classList.remove("open");

    // Initiate Order Tracking
    startOrderTracking(name, phone, distance, payment, address);
});

// ==========================================
// E. Order Tracking Simulator
// ==========================================
function startOrderTracking(name, phone, distance, payment, address) {
    // Generate Random Order ID
    const orderId = `#GMA-${Math.floor(10000 + Math.random() * 90000)}`;
    const orderTime = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + " WIB";
    
    // Display tracker page
    trackerSection.style.display = "block";
    navTrackOrder.style.display = "inline-block";
    trackerSection.scrollIntoView({ behavior: 'smooth' });

    // Populate metadata
    trackOrderId.textContent = orderId;
    trackOrderTime.textContent = orderTime;
    trackPaymentMethod.textContent = payment === "COD" ? "Bayar di Tempat (COD)" : (payment === "GOPAY" ? "E-Wallet (GO-Pay)" : "Transfer Bank");

    // Reset simulator graphics
    scooterCourier.classList.remove("active");
    scooterCourier.style.left = "0%";
    
    // Clear previous logs
    logList.innerHTML = "";
    
    // Reset Stepper
    resetStepper();

    // Clear previous tracking timers if any
    if (trackingTimer) clearInterval(trackingTimer);

    // Sequence timelines
    // 0s: Received
    logEvent("Pesanan Diterima", "Pesanan Anda berhasil dikonfirmasi oleh GO Mie Ayam dan sedang diteruskan ke dapur.");
    setStepActive("step-received");

    // 4s: Cooking
    setTimeout(() => {
        logEvent("Sedang Dimasak", "Koki sedang merebus mie segar dan menyiapkan bumbu rempah kecap ayam hangat.");
        setStepCompleted("step-received");
        setStepActive("step-cooking");
    }, 4000);

    // 10s: Out for Delivery
    setTimeout(() => {
        logEvent("Kurir Mengantar", "Mie Ayam hangat telah dikemas rapi. Kurir kami, Mas Budi, sedang memacu motor ke alamat Anda.");
        setStepCompleted("step-cooking");
        setStepActive("step-delivery");
        
        // Start scooter animation
        scooterCourier.classList.add("active");
        
        let progress = 0;
        const intervalTime = 100; // ms
        const totalDuration = 10000; // 10 seconds of delivery simulation
        const stepSize = (intervalTime / totalDuration) * 100;

        const scooterMover = setInterval(() => {
            progress += stepSize;
            if (progress >= 100) {
                progress = 100;
                clearInterval(scooterMover);
            }
            scooterCourier.style.left = `${progress}%`;
        }, intervalTime);
    }, 10000);

    // 20s: Delivered
    setTimeout(() => {
        logEvent("Tiba di Tujuan", `Pesanan atas nama <strong>${name}</strong> telah tiba di alamat tujuan. Selamat menikmati GO Mie Ayam!`);
        setStepCompleted("step-delivery");
        setStepActive("step-completed");
        
        // Final Toast
        showToast("Pesanan Anda telah tiba! Selamat menikmati!", "success");
        
        // Clear cart
        cart = [];
        updateCartUI();
    }, 20000);
}

function resetStepper() {
    const steps = [stepReceived, stepCooking, stepDelivery, stepCompleted];
    steps.forEach(step => {
        step.className = "step";
    });
}

function setStepActive(stepId) {
    const el = document.getElementById(stepId);
    if (el) el.classList.add("active");
}

function setStepCompleted(stepId) {
    const el = document.getElementById(stepId);
    if (el) {
        el.classList.remove("active");
        el.classList.add("completed");
    }
}

function logEvent(title, desc) {
    const time = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + " WIB";
    const li = document.createElement("li");
    li.innerHTML = `<span class="log-time">${time}</span> <strong>${title}</strong> - ${desc}`;
    logList.appendChild(li);
}

orderAgainBtn.addEventListener("click", () => {
    document.getElementById("menu").scrollIntoView({ behavior: 'smooth' });
});

// ==========================================
// F. Helpers
// ==========================================
function formatRupiah(number) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0
    }).format(number);
}

function showToast(message, type = "default") {
    const container = document.getElementById("toast-container");
    const toast = document.createElement("div");
    toast.className = `toast ${type === "success" ? "toast-success" : ""}`;
    toast.innerHTML = `
        <i class="fa-solid ${type === "success" ? "fa-circle-check" : "fa-cart-plus"}"></i>
        <span>${message}</span>
    `;
    container.appendChild(toast);
    
    // Auto remove after 3s
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Initial Menu Render
renderMenu();
updateCartUI();
