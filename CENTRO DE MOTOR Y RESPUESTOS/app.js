/* ==========================================================================
   APP LOGIC - CENTRO MOTOR REPUESTOS
   ========================================================================== */

// Default Seed Products
const defaultProducts = [
    {
        id: 1,
        title: "Subconjunto de Pistones y Aros",
        category: "pistones",
        price: "$185.000",
        stockStatus: "in",
        description: "Subconjunto de pistón y perno para motor multimarca (naftero y diésel). Fabricado bajo normas ISO para alta compresión y durabilidad extrema bajo exigencias máximas.",
        image: "assets/piston_set.png",
        compatBrand: "Toyota",
        compatModel: "Hilux",
        compatYear: 2015,
        specs: {
            "Marca": "Persan Premium",
            "Medida": "Estándar / 0.50 / 1.00",
            "Material": "Aluminio Aleado con Silicio",
            "Origen": "Argentina"
        }
    },
    {
        id: 2,
        title: "Juego de Juntas de Motor Completo",
        category: "juntas",
        price: "$95.000",
        stockStatus: "in",
        description: "Juego de juntas completo de motor de alta performance. Incluye junta de tapa de cilindros multilámina (MLS) de alta tecnología, juntas de colector y retén de distribución.",
        image: "assets/juego_juntas.jpg",
        compatBrand: "Fiat",
        compatModel: "Uno",
        compatYear: 2010,
        specs: {
            "Marca": "Taranto MLS",
            "Tipo": "Juntas de Motor Completa",
            "Espesor Junta Tapa": "1.2 mm - Multilámina",
            "Resistencia Térmica": "Hasta 350°C"
        }
    },
    {
        id: 3,
        title: "Árbol de Levas de Competición",
        category: "valvulas",
        price: "$140.000",
        stockStatus: "in",
        description: "Leva de competición para mejorar potencia de motor 110cc o multimarca. Perfil optimizado y tratamiento térmico para alta resistencia y alzada superior.",
        image: "assets/arbol_levas.jpg",
        compatBrand: "Chevrolet",
        compatModel: "Corsa",
        compatYear: 2012,
        specs: {
            "Marca": "Cabalin Racing",
            "Material": "Acero Forjado 8620",
            "Alzada": "Competición / Especial",
            "Tratamiento": "Templado de levas"
        }
    },
    {
        id: 4,
        title: "Bielas Forjadas I-Beam FTX AP 144x20",
        category: "pistones",
        price: "$220.000",
        stockStatus: "low",
        description: "Set de bielas con diseño I-Beam en acero forjado cromo-molibdeno para alta gama y competición. Diseñado para soportar presiones y potencias extremas sin deformarse.",
        image: "assets/bielas_forjadas.jpg",
        compatBrand: "Volkswagen",
        compatModel: "Gol",
        compatYear: 2008,
        specs: {
            "Marca": "FTX Rojas Competicion",
            "Medida": "144x20 mm",
            "Diseño": "I-Beam Forjado",
            "Potencia Max": "650 HP"
        }
    },
    {
        id: 5,
        title: "Tapa de Cilindros Fiat Uno Fire 1.3 8v",
        category: "tapas",
        price: "$450.000",
        stockStatus: "in",
        description: "Tapa de cilindros nueva de aluminio aleado para Fiat Uno Fire. Viene totalmente armada con válvulas de admisión y escape, resortes y retenes de alta fidelidad.",
        image: "assets/tapa_cilindros.jpg",
        compatBrand: "Fiat",
        compatModel: "Uno Fire",
        compatYear: 2011,
        specs: {
            "Marca": "Original / R-Engine",
            "Material": "Aluminio Silicio Inyectado",
            "Estado": "Lista para colocar",
            "Válvulas": "8v - Armado Completo"
        }
    },
    {
        id: 6,
        title: "Bomba de Aceite de Alto Flujo Pin Drive",
        category: "bombas",
        price: "$82.000",
        stockStatus: "in",
        description: "Bomba de aceite reforzada Pin Drive de alto flujo para garantizar la presión de lubricación ideal en todo rango de revoluciones y temperaturas extremas.",
        image: "assets/bomba_aceite.jpg",
        compatBrand: "Toyota",
        compatModel: "Hilux",
        compatYear: 2012,
        specs: {
            "Marca": "Miniparts Std",
            "Presión Relieve": "65 PSI",
            "Caudal": "+25% sobre original",
            "Garantía": "1 Año"
        }
    }
];

// Initialize Database in LocalStorage
let productsCatalog = [];
function initDatabase() {
    const savedCatalog = localStorage.getItem("centro_motor_catalog");
    const dbVersion = localStorage.getItem("centro_motor_db_version");
    const currentVersion = "2.1"; // Updated version to trigger reset to new images

    if (savedCatalog && dbVersion === currentVersion) {
        try {
            productsCatalog = JSON.parse(savedCatalog);
        } catch (e) {
            console.error("Error parsing localstorage catalog, resetting...", e);
            productsCatalog = [...defaultProducts];
            saveCatalog();
        }
    } else {
        // First load or new database version: load default products with new assets
        productsCatalog = [...defaultProducts];
        localStorage.setItem("centro_motor_db_version", currentVersion);
        saveCatalog();
    }
}

function saveCatalog() {
    localStorage.setItem("centro_motor_catalog", JSON.stringify(productsCatalog));
}

// Local State
let searchQuery = "";
let selectedCategory = "all";
let filterBrand = "";
let filterModel = "";
let filterYear = "";
const phoneRaw = "5493857485143";

// DOM Elements
const productsGrid = document.getElementById("products-grid");
const searchInput = document.getElementById("product-search");
const filterButtons = document.querySelectorAll(".filter-btn");
const emptyResults = document.getElementById("empty-results");

const searchBrandSelect = document.getElementById("search-brand");
const searchModelInput = document.getElementById("search-model");
const searchYearInput = document.getElementById("search-year");
const clearVehicleFiltersBtn = document.getElementById("btn-clear-vehicle-filters");

const menuToggleBtn = document.getElementById("menu-toggle-btn");
const mobileMenu = document.getElementById("mobile-menu");
const closeMenuBtn = document.getElementById("close-menu-btn");
const mobileNavLinks = document.querySelectorAll(".mobile-nav-link");

const productModal = document.getElementById("product-modal");
const modalCloseBtn = document.getElementById("modal-close-btn");
const modalBodyContent = document.getElementById("modal-body-content");

const statusIndicator = document.getElementById("status-indicator");
const statusText = document.getElementById("status-text");

// Admin Panel DOM
const adminPanelTrigger = document.getElementById("admin-panel-trigger");
const mobileAdminPanelTrigger = document.getElementById("mobile-admin-panel-trigger");
const adminModal = document.getElementById("admin-modal");
const adminModalCloseBtn = document.getElementById("admin-modal-close-btn");
const adminProductsList = document.getElementById("admin-products-list");
const productForm = document.getElementById("product-form");
const editProductId = document.getElementById("edit-product-id");
const formActionTitle = document.getElementById("form-action-title");
const btnCancelEdit = document.getElementById("btn-cancel-edit");

// Theme Switch DOM
const themeToggleBtn = document.getElementById("theme-toggle-btn");

// Initialize Theme
function initTheme() {
    const savedTheme = localStorage.getItem("centro_motor_theme") || "dark";
    document.documentElement.setAttribute("data-theme", savedTheme);
}

themeToggleBtn.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("centro_motor_theme", newTheme);
});

// Render Products Catalog
function renderProducts() {
    const filteredProducts = productsCatalog.filter(product => {
        // Text Search
        const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              product.description.toLowerCase().includes(searchQuery.toLowerCase());
        
        // Category Filter
        const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
        
        // Vehicle Brand Filter
        const matchesBrand = !filterBrand || (product.compatBrand && product.compatBrand.toLowerCase() === filterBrand.toLowerCase());
        
        // Vehicle Model Filter
        const matchesModel = !filterModel || (product.compatModel && product.compatModel.toLowerCase().includes(filterModel.toLowerCase()));
        
        // Vehicle Year Filter
        const matchesYear = !filterYear || (product.compatYear && parseInt(product.compatYear) === parseInt(filterYear));

        return matchesSearch && matchesCategory && matchesBrand && matchesModel && matchesYear;
    });

    productsGrid.innerHTML = "";

    if (filteredProducts.length === 0) {
        emptyResults.classList.remove("d-none");
        productsGrid.classList.add("d-none");
    } else {
        emptyResults.classList.add("d-none");
        productsGrid.classList.remove("d-none");

        filteredProducts.forEach(product => {
            const card = document.createElement("div");
            card.className = "product-card";
            
            let stockHtml = "";
            if (product.stockStatus === "in") {
                stockHtml = `<span class="product-stock stock-in">En Stock</span>`;
            } else if (product.stockStatus === "low") {
                stockHtml = `<span class="product-stock stock-low">Últimas</span>`;
            } else {
                stockHtml = `<span class="product-stock stock-out">Sin Stock</span>`;
            }

            // Compatibility label
            const compatText = product.compatBrand ? `${product.compatBrand} ${product.compatModel || ''}` : 'Multimarca';

            card.innerHTML = `
                <span class="product-badge">${capitalizeFirstLetter(product.category)}</span>
                ${stockHtml}
                <div class="product-img-wrapper">
                    <img src="${product.image || 'https://images.unsplash.com/photo-1507136566006-cfc505b114fc?auto=format&fit=crop&q=80&w=400'}" alt="${product.title}" class="product-img" loading="lazy">
                </div>
                <button class="quick-view-btn" data-id="${product.id}">Vista rápida <i class="fas fa-eye"></i></button>
                <div class="product-info">
                    <h3 class="product-title">${product.title}</h3>
                    <p class="product-desc">${product.description}</p>
                    <div class="product-meta">
                        <div class="product-price">
                            <span class="price-label">Compatibilidad: ${compatText}</span>
                            <span class="price-val">${product.price}</span>
                        </div>
                        <a href="https://wa.me/${phoneRaw}?text=${encodeURIComponent(`Hola Centro Motor, quiero el repuesto: *${product.title}* (${product.price}) para *${compatText}*. Solicito delivery (Pago en efectivo).`)}" target="_blank" class="btn-card-whatsapp" aria-label="Consultar por WhatsApp">
                            <i class="fab fa-whatsapp"></i>
                        </a>
                    </div>
                </div>
            `;
            productsGrid.appendChild(card);
        });

        // Event listener for quick views
        document.querySelectorAll(".quick-view-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const productId = parseInt(e.currentTarget.getAttribute("data-id"));
                openQuickView(productId);
            });
        });
    }
}

// Helpers
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Navigation Menu
menuToggleBtn.addEventListener("click", () => {
    mobileMenu.classList.add("open");
});

closeMenuBtn.addEventListener("click", () => {
    mobileMenu.classList.remove("open");
});

mobileNavLinks.forEach(link => {
    link.addEventListener("click", () => {
        mobileMenu.classList.remove("open");
    });
});

// Search & Filter Listeners
searchInput.addEventListener("input", (e) => {
    searchQuery = e.target.value;
    renderProducts();
});

filterButtons.forEach(btn => {
    btn.addEventListener("click", (e) => {
        filterButtons.forEach(b => b.classList.remove("active"));
        e.currentTarget.classList.add("active");
        selectedCategory = e.currentTarget.getAttribute("data-category");
        renderProducts();
    });
});

// Vehicle Filters Listeners
searchBrandSelect.addEventListener("change", (e) => {
    filterBrand = e.target.value;
    renderProducts();
});

searchModelInput.addEventListener("input", (e) => {
    filterModel = e.target.value;
    renderProducts();
});

searchYearInput.addEventListener("input", (e) => {
    filterYear = e.target.value;
    renderProducts();
});

clearVehicleFiltersBtn.addEventListener("click", () => {
    searchBrandSelect.value = "";
    searchModelInput.value = "";
    searchYearInput.value = "";
    filterBrand = "";
    filterModel = "";
    filterYear = "";
    renderProducts();
});

// Quick View Modal
function openQuickView(id) {
    const product = productsCatalog.find(p => p.id === id);
    if (!product) return;

    let specsHtml = "";
    const specs = product.specs || {
        "Compatibilidad": product.compatBrand ? `${product.compatBrand} ${product.compatModel || ''} (${product.compatYear || 'Todos'})` : 'Universal',
        "Categoría": capitalizeFirstLetter(product.category),
        "Envío": "Delivery Disponible",
        "Método de Pago": "Solo Efectivo",
        "Stock": product.stockStatus === 'in' ? 'Disponible' : (product.stockStatus === 'low' ? 'Últimas unidades' : 'Sin Stock')
    };

    for (const [key, val] of Object.entries(specs)) {
        specsHtml += `
            <li>
                <span class="spec-label">${key}</span>
                <span class="spec-val">${val}</span>
            </li>
        `;
    }

    const compatText = product.compatBrand ? `${product.compatBrand} ${product.compatModel || ''}` : 'Multimarca';
    const whatsappMessage = `Hola Centro Motor, quiero el repuesto: *${product.title}* (${product.price}) para *${compatText}*. Solicito delivery (Pago en efectivo).`;

    modalBodyContent.innerHTML = `
        <div class="modal-grid">
            <div class="modal-img-container">
                <img src="${product.image || 'https://images.unsplash.com/photo-1507136566006-cfc505b114fc?auto=format&fit=crop&q=80&w=400'}" alt="${product.title}" class="modal-img">
            </div>
            <div class="modal-info">
                <span class="modal-category">${product.category}</span>
                <h3 class="modal-title">${product.title}</h3>
                <p class="modal-description">${product.description}</p>
                
                <h4 style="font-size:0.95rem; margin-bottom:10px; font-weight:600;"><i class="fas fa-list-ul"></i> Ficha Técnica</h4>
                <ul class="modal-specs">
                    ${specsHtml}
                </ul>

                <div class="modal-footer">
                    <div class="modal-price-box">
                        <span class="modal-price-label">Precio Referencial</span>
                        <span class="modal-price-val">${product.price}</span>
                    </div>
                    <a href="https://wa.me/${phoneRaw}?text=${encodeURIComponent(whatsappMessage)}" target="_blank" class="btn-modal-whatsapp">
                        Consultar Stock <i class="fab fa-whatsapp"></i>
                    </a>
                </div>
            </div>
        </div>
    `;

    productModal.classList.add("open");
}

function closeModal() {
    productModal.classList.remove("open");
}

modalCloseBtn.addEventListener("click", closeModal);
productModal.addEventListener("click", (e) => {
    if (e.target === productModal) {
        closeModal();
    }
});

// Admin Panel Dashboard CRUD Actions
function renderAdminProductsList() {
    adminProductsList.innerHTML = "";
    productsCatalog.forEach(product => {
        const item = document.createElement("div");
        item.className = "admin-item-card";
        item.innerHTML = `
            <div class="admin-item-info">
                <h5>${product.title}</h5>
                <span>${product.price} | ${capitalizeFirstLetter(product.category)}</span>
            </div>
            <div class="admin-item-actions">
                <button class="btn-admin-action edit" data-id="${product.id}" title="Editar"><i class="fas fa-edit"></i></button>
                <button class="btn-admin-action delete" data-id="${product.id}" title="Eliminar"><i class="fas fa-trash-alt"></i></button>
            </div>
        `;
        adminProductsList.appendChild(item);
    });

    // Attach actions
    document.querySelectorAll(".btn-admin-action.edit").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const id = parseInt(e.currentTarget.getAttribute("data-id"));
            loadProductToForm(id);
        });
    });

    document.querySelectorAll(".btn-admin-action.delete").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const id = parseInt(e.currentTarget.getAttribute("data-id"));
            deleteProduct(id);
        });
    });
}

function loadProductToForm(id) {
    const product = productsCatalog.find(p => p.id === id);
    if (!product) return;

    editProductId.value = product.id;
    document.getElementById("form-title").value = product.title;
    document.getElementById("form-category").value = product.category;
    document.getElementById("form-price").value = product.price;
    document.getElementById("form-stock").value = product.stockStatus;
    document.getElementById("form-image").value = product.isImageFile ? "" : product.image;
    document.getElementById("form-compat-brand").value = product.compatBrand || "";
    document.getElementById("form-compat-model").value = product.compatModel || "";
    document.getElementById("form-description").value = product.description;

    formActionTitle.innerHTML = `<i class="fas fa-edit"></i> Editar Producto #${product.id}`;
    btnCancelEdit.classList.remove("d-none");
}

function resetProductForm() {
    editProductId.value = "";
    productForm.reset();
    formActionTitle.innerHTML = `<i class="fas fa-plus"></i> Agregar Nuevo Producto`;
    btnCancelEdit.classList.add("d-none");
}

btnCancelEdit.addEventListener("click", resetProductForm);

productForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const idVal = editProductId.value;
    const title = document.getElementById("form-title").value;
    const category = document.getElementById("form-category").value;
    const price = document.getElementById("form-price").value;
    const stockStatus = document.getElementById("form-stock").value;
    let image = document.getElementById("form-image").value;
    const compatBrand = document.getElementById("form-compat-brand").value;
    const compatModel = document.getElementById("form-compat-model").value;
    const description = document.getElementById("form-description").value;

    if (!image) {
        // Fallback default image for visual completeness
        image = "https://images.unsplash.com/photo-1507136566006-cfc505b114fc?auto=format&fit=crop&q=80&w=400";
    }

    if (idVal) {
        // Update product
        const index = productsCatalog.findIndex(p => p.id === parseInt(idVal));
        if (index !== -1) {
            productsCatalog[index] = {
                ...productsCatalog[index],
                title,
                category,
                price,
                stockStatus,
                image,
                compatBrand,
                compatModel,
                description
            };
        }
    } else {
        // Create product
        const newId = productsCatalog.length > 0 ? Math.max(...productsCatalog.map(p => p.id)) + 1 : 1;
        productsCatalog.push({
            id: newId,
            title,
            category,
            price,
            stockStatus,
            image,
            compatBrand,
            compatModel,
            compatYear: 2026, // default
            description
        });
    }

    saveCatalog();
    renderProducts();
    renderAdminProductsList();
    resetProductForm();
});

function deleteProduct(id) {
    if (confirm("¿Estás seguro de que deseas eliminar este repuesto de la base de datos?")) {
        productsCatalog = productsCatalog.filter(p => p.id !== id);
        saveCatalog();
        renderProducts();
        renderAdminProductsList();
        resetProductForm();
    }
}

// Open/Close Admin modal
function openAdminPanel() {
    mobileMenu.classList.remove("open");
    renderAdminProductsList();
    resetProductForm();
    adminModal.classList.add("open");
}

adminPanelTrigger.addEventListener("click", openAdminPanel);
mobileAdminPanelTrigger.addEventListener("click", openAdminPanel);

adminModalCloseBtn.addEventListener("click", () => {
    adminModal.classList.remove("open");
});

adminModal.addEventListener("click", (e) => {
    if (e.target === adminModal) {
        adminModal.classList.remove("open");
    }
});

// Shop Status Checker
function checkShopStatus() {
    const now = new Date();
    const day = now.getDay(); 
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const currentTime = hours * 100 + minutes; 

    let isOpen = false;

    if (day >= 1 && day <= 5) {
        const morningOpen = 800;
        const morningClose = 1300;
        const eveningOpen = 1600;
        const eveningClose = 2000;

        if ((currentTime >= morningOpen && currentTime <= morningClose) || 
            (currentTime >= eveningOpen && currentTime <= eveningClose)) {
            isOpen = true;
        }
    } else if (day === 6) {
        const satOpen = 800;
        const satClose = 1300;
        if (currentTime >= satOpen && currentTime <= satClose) {
            isOpen = true;
        }
    } 

    if (isOpen) {
        statusIndicator.className = "status-indicator open";
        statusText.innerText = "Abierto Ahora";
    } else {
        statusIndicator.className = "status-indicator closed";
        statusText.innerText = "Cerrado Ahora";
    }
}

// Scroll Intersection Observer for smooth animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("appear");
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll(".animate-on-scroll").forEach(el => {
        observer.observe(el);
    });
}

// Initial Run
initTheme();
initDatabase();
renderProducts();
checkShopStatus();
initScrollAnimations();
setInterval(checkShopStatus, 60000); 
