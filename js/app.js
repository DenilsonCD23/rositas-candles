const WHATSAPP_NUMBER = '59178365055';

const grid = document.querySelector('#product-grid');
const countLabel = document.querySelector('#product-count');
const searchInput = document.querySelector('#product-search');
const emptyState = document.querySelector('#empty-state');
const clearSearchButton = document.querySelector('#clear-search');
const modal = document.querySelector('#image-modal');
const modalImage = document.querySelector('#modal-image');
const modalTitle = document.querySelector('#modal-title');
const modalDescription = document.querySelector('#modal-description');
const modalPrice = document.querySelector('#modal-price');
const modalWhatsapp = document.querySelector('#modal-whatsapp');
const modalClose = document.querySelector('#modal-close');
const categoryFilters = document.querySelector('#category-filters');

let products = [];
let activeCategory = 'todas';

function normalizeText(value) {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function priceText(product) {
  return `${product.precio} Bs`;
}

function whatsappUrl(product) {
  const message = `Hola, me interesa la vela ${product.nombre} de ${priceText(product)}. Adjunto una captura del modelo que quiero. El aroma que quiero es: `;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function validateProducts(value) {
  if (!Array.isArray(value)) return [];
  return value.filter(product => product && product.id && product.nombre && product.precio !== '' && product.imagen);
}

async function loadProducts() {
  const response = await fetch(`data/products.json?v=${Date.now()}`, {
    cache: 'no-store'
  });

  if (!response.ok) {
    throw new Error('No se pudo cargar data/products.json');
  }

  return validateProducts(await response.json());
}

function productCard(product, index) {
  const name = escapeHtml(product.nombre);
  const image = escapeHtml(product.imagen);
  const price = escapeHtml(priceText(product));
  const description = escapeHtml(product.descripcion || '');
  const whatsapp = escapeHtml(whatsappUrl(product));

  return `
    <article class="product-card" style="animation-delay:${Math.min(index * 30, 300)}ms">
      <button class="product-image-button" type="button" data-action="view" data-id="${escapeHtml(product.id)}" aria-label="Ver imagen ampliada de ${name}">
        <img src="${image}" alt="${name}" loading="lazy" decoding="async">
        <span class="zoom-hint" aria-hidden="true">
          <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.3 4.3M11 8v6M8 11h6"/></svg>
        </span>
      </button>
      <div class="product-content">
        <h3>${name}</h3>
        <p class="product-description">${description}</p>
        <p class="product-price">${price}</p>
        <div class="product-actions">
          <button class="button button-soft" type="button" data-action="view" data-id="${escapeHtml(product.id)}">Ver imagen</button>
          <a class="button whatsapp-button" href="${whatsapp}" target="_blank" rel="noopener">Pedir por WhatsApp</a>
        </div>
      </div>
    </article>`;
}

function renderProducts(list) {
  const available = list.filter(product => product.disponible !== false);
  grid.innerHTML = available.map(productCard).join('');
  grid.setAttribute('aria-busy', 'false');
  countLabel.textContent = `${available.length} ${available.length === 1 ? 'diseño disponible' : 'diseños disponibles'}`;
  emptyState.hidden = available.length !== 0;
  grid.hidden = available.length === 0;

  grid.querySelectorAll('img').forEach(image => {
    image.addEventListener('error', () => {
      image.alt = 'Imagen no disponible';
      image.closest('.product-image-button')?.classList.add('image-error');
    }, { once: true });
  });
}

function filterProducts() {
  const query = normalizeText(searchInput.value);
  const filtered = products.filter(product => {
    const matchesSearch = normalizeText(product.nombre).includes(query);
    const categories = Array.isArray(product.categorias) ? product.categorias : [];
    const matchesCategory = activeCategory === 'todas' || categories.includes(activeCategory);
    return matchesSearch && matchesCategory;
  });
  renderProducts(filtered);
}

function selectCategory(button) {
  activeCategory = button.dataset.category;
  categoryFilters.querySelectorAll('.category-filter').forEach(filter => {
    const isActive = filter === button;
    filter.classList.toggle('is-active', isActive);
    filter.setAttribute('aria-pressed', String(isActive));
  });
  filterProducts();
}

function openProduct(product) {
  modalImage.src = product.imagen;
  modalImage.alt = product.nombre;
  modalTitle.textContent = product.nombre;
  modalDescription.textContent = product.descripcion || '';
  modalPrice.textContent = priceText(product);
  modalWhatsapp.href = whatsappUrl(product);
  document.body.classList.add('modal-open');
  modal.showModal();
}

function closeModal() {
  modal.close();
  modalImage.src = '';
  document.body.classList.remove('modal-open');
}

grid.addEventListener('click', event => {
  const trigger = event.target.closest('[data-action="view"]');
  if (!trigger) return;
  const product = products.find(item => item.id === trigger.dataset.id);
  if (product) openProduct(product);
});

searchInput.addEventListener('input', filterProducts);
categoryFilters.addEventListener('click', event => {
  const button = event.target.closest('.category-filter');
  if (button) selectCategory(button);
});
clearSearchButton.addEventListener('click', () => {
  searchInput.value = '';
  selectCategory(categoryFilters.querySelector('[data-category="todas"]'));
  searchInput.focus();
});
modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', event => {
  if (event.target === modal) closeModal();
});
modal.addEventListener('cancel', () => document.body.classList.remove('modal-open'));

document.querySelector('#current-year').textContent = new Date().getFullYear();

loadProducts()
  .then(data => {
    products = data;
    renderProducts(products);
  })
  .catch(error => {
    console.error(error);
    grid.setAttribute('aria-busy', 'false');
    grid.innerHTML = '<div class="empty-state"><h3>No pudimos cargar el catálogo</h3><p>Abre la página mediante un servidor local. Consulta el README para ver las instrucciones.</p></div>';
    countLabel.textContent = 'Catálogo no disponible';
  });
