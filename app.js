/* CABAÑAS • Motor de Reserva Directa Sin Comisiones */
const WA_HOST = '56956823670';

const CABINS = [
  {
    id: 'boldo',
    name: 'A-Frame El Boldo',
    tags: ['pareja', 'tinaja'],
    badge: 'Ideal Parejas • 2 pax',
    desc: 'Cabaña alpina de ventanal triangular inmersa en bosque nativo, con cama King, bosca y terraza privada.',
    specs: ['2 Huéspedes', 'Tinaja Privada', 'Bosca & Aire', 'Wi-Fi Fibra'],
    priceNight: 95000,
    extImg: 'assets/hero_cabana.jpg',
    intImg: 'assets/interior_cabana.jpg',
  },
  {
    id: 'peumo',
    name: 'Cabaña Peumo & Tinaja',
    tags: ['familia', 'tinaja'],
    badge: 'Favorita V Región • 4 pax',
    desc: 'Dos dormitorios en madera nativa, deck amplio hacia la cordillera, quincho privado y tinaja de ciprés.',
    specs: ['4 Huéspedes', 'Tinaja Incluida', 'Quincho Privado', 'Pet Friendly'],
    priceNight: 125000,
    extImg: 'assets/tinaja_bosque.jpg',
    intImg: 'assets/interior_cabana.jpg',
  },
  {
    id: 'quillay',
    name: 'Casona Quillay Familiar',
    tags: ['familia'],
    badge: 'Familiar / Amigos • 6 pax',
    desc: 'Amplia cabaña rodeada de senderos y piscina compartida, cocina full equipada y gran terraza para asados.',
    specs: ['6 Huéspedes', '3 Dormitorios', 'Acceso Piscina', 'Estacionamiento x2'],
    priceNight: 145000,
    extImg: 'assets/interior_cabana.jpg',
    intImg: 'assets/hero_cabana.jpg',
  },
];

const EXTRAS = [
  { id: 'tinaja', icon: '♨️', name: 'Sesión Tinaja de Cedro Extra', desc: 'Leña y preparación a 39 °C bajo las estrellas.', price: 25000 },
  { id: 'desayuno', icon: '🥐', name: 'Canasta Desayuno Campestre', desc: 'Pan amasado, huevos de campo, palta, queso y café.', price: 22000 },
  { id: 'vino', icon: '🍷', name: 'Carmenere Reserva Casablanca', desc: 'Botella seleccionada + tabla rústica de bienvenida.', price: 18000 },
  { id: 'late', icon: '🕒', name: 'Late Check-out hasta 16:00', desc: 'Disfruta toda la tarde antes de regresar.', price: 20000 },
];

const state = {
  cabinId: 'peumo',
  extras: new Set(['desayuno']),
  filter: 'all',
  viewMode: {},
};

const clp = (n) => '$' + Math.round(n).toLocaleString('es-CL');

function setDefaultDates() {
  const today = new Date();
  const inD = new Date(today.getTime() + 7 * 86400000);
  const outD = new Date(today.getTime() + 9 * 86400000);
  const fmt = (d) => d.toISOString().split('T')[0];
  ['qCheckin', 'fCheckin'].forEach((id) => (document.getElementById(id).value = fmt(inD)));
  ['qCheckout', 'fCheckout'].forEach((id) => (document.getElementById(id).value = fmt(outD)));
}

function getNights() {
  const d1 = new Date(document.getElementById('fCheckin').value);
  const d2 = new Date(document.getElementById('fCheckout').value);
  if (isNaN(d1) || isNaN(d2)) return 2;
  const diff = Math.round((d2 - d1) / 86400000);
  return diff > 0 ? diff : 1;
}

function renderCabins() {
  const grid = document.getElementById('cabinsGrid');
  const filtered = state.filter === 'all' ? CABINS : CABINS.filter((c) => c.tags.includes(state.filter));
  grid.innerHTML = filtered
    .map((c) => {
      const mode = state.viewMode[c.id] || 'ext';
      const img = mode === 'int' ? c.intImg : c.extImg;
      const isSelected = state.cabinId === c.id;
      return `
        <article class="cabin-card">
          <div class="cabin-media">
            <img src="${img}" alt="${c.name}">
            <span class="cabin-badge">${c.badge}</span>
            <button type="button" class="view-toggle" data-toggle-view="${c.id}">
              ${mode === 'int' ? '🏡 Ver Exterior' : '🛏️ Ver Interior'}
            </button>
          </div>
          <div class="cabin-body">
            <h3 class="cabin-title">${c.name}</h3>
            <p class="cabin-desc">${c.desc}</p>
            <div class="specs-row">${c.specs.map((s) => `<span class="spec-tag">${s}</span>`).join('')}</div>
            <div class="cabin-foot">
              <div class="price-box">
                <small>Tarifa directa / noche</small>
                <strong>${clp(c.priceNight)}</strong>
              </div>
              <button type="button" class="btn ${isSelected ? 'btn-amber' : 'btn-primary'}" data-select-cabin="${c.id}">
                ${isSelected ? '✓ Seleccionada' : 'Elegir Cabaña'}
              </button>
            </div>
          </div>
        </article>`;
    })
    .join('');

  grid.querySelectorAll('[data-toggle-view]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.toggleView;
      state.viewMode[id] = state.viewMode[id] === 'int' ? 'ext' : 'int';
      renderCabins();
    });
  });

  grid.querySelectorAll('[data-select-cabin]').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.cabinId = btn.dataset.selectCabin;
      document.getElementById('fCabin').value = state.cabinId;
      document.getElementById('qCabin').value = state.cabinId;
      renderCabins();
      updateSummary();
      document.getElementById('cotizador').scrollIntoView({ behavior: 'smooth' });
    });
  });
}

function renderExtras() {
  const grid = document.getElementById('extrasGrid');
  grid.innerHTML = EXTRAS.map((ex) => {
    const sel = state.extras.has(ex.id);
    return `
      <div class="extra-card ${sel ? 'selected' : ''}">
        <div>
          <span class="extra-icon">${ex.icon}</span>
          <h3>${ex.name}</h3>
          <p>${ex.desc}</p>
        </div>
        <div class="extra-foot">
          <span class="extra-price">${clp(ex.price)}</span>
          <button type="button" class="btn-extra" data-toggle-extra="${ex.id}">
            ${sel ? '✓ Agregado' : '+ Sumar'}
          </button>
        </div>
      </div>`;
  }).join('');

  grid.querySelectorAll('[data-toggle-extra]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.toggleExtra;
      if (state.extras.has(id)) state.extras.delete(id);
      else state.extras.add(id);
      renderExtras();
      updateSummary();
    });
  });
}

function buildMessage(cabin, nights, extrasList, total, savings) {
  const name = document.getElementById('fName').value.trim() || 'Viajero';
  const guests = document.getElementById('fGuests').value;
  const ci = document.getElementById('fCheckin').value;
  const co = document.getElementById('fCheckout').value;
  const notes = document.getElementById('fNotes').value.trim();
  const extrasTxt = extrasList.length ? extrasList.map((e) => e.name).join(', ') : 'Sin adicionales';

  return (
    `¡Hola Cabañas! 👋 Soy *${name}* y quiero consultar disponibilidad directa (sin comisión de portal):\n\n` +
    `🏡 *Cabaña:* ${cabin.name}\n` +
    `📅 *Fechas:* ${ci} al ${co} (${nights} ${nights === 1 ? 'noche' : 'noches'})\n` +
    `👥 *Huéspedes:* ${guests} personas\n` +
    `✨ *Adicionales:* ${extrasTxt}\n` +
    `💰 *Estimado directo:* ${clp(total)} (ahorro aprox. ${clp(savings)} vs portal)\n` +
    (notes ? `📝 *Notas:* ${notes}\n` : '') +
    `\n¿Tienen disponibilidad para esas fechas?`
  );
}

function updateSummary() {
  const cabin = CABINS.find((c) => c.id === state.cabinId) || CABINS[0];
  const nights = getNights();
  const lodging = cabin.priceNight * nights;
  const extrasList = EXTRAS.filter((e) => state.extras.has(e.id));
  const extrasCost = extrasList.reduce((acc, e) => acc + e.price, 0);
  const total = lodging + extrasCost;
  const savings = Math.round(total * 0.155);

  document.getElementById('sumCabinName').textContent = cabin.name;
  document.getElementById('sumNights').textContent = `${nights} ${nights === 1 ? 'noche' : 'noches'}`;
  document.getElementById('sumLodging').textContent = clp(lodging);
  document.getElementById('sumExtrasCount').textContent = String(extrasList.length);
  document.getElementById('sumExtrasCost').textContent = clp(extrasCost);
  document.getElementById('sumSavings').textContent = clp(savings);
  document.getElementById('sumTotal').textContent = clp(total);
  document.getElementById('drawerCount').textContent = String(1 + extrasList.length);
  document.getElementById('drawerTotal').textContent = clp(total);

  const msg = buildMessage(cabin, nights, extrasList, total, savings);
  document.getElementById('sendWaBtn').href = `https://wa.me/${WA_HOST}?text=${encodeURIComponent(msg)}`;
  window.__currentCabanaMsg = msg;

  // Drawer list
  document.getElementById('drawerBody').innerHTML = `
    <div style="padding:12px;border:1px solid var(--line);border-radius:12px;">
      <strong>🏡 ${cabin.name}</strong>
      <div style="font-size:0.86rem;color:var(--muted);">${nights} noches × ${clp(cabin.priceNight)} = <b>${clp(lodging)}</b></div>
    </div>
    ${extrasList
      .map(
        (e) => `<div style="padding:10px 12px;border:1px solid var(--line);border-radius:12px;display:flex;justify-content:space-between;align-items:center;">
          <span>${e.icon} ${e.name}</span>
          <strong>${clp(e.price)}</strong>
        </div>`
      )
      .join('')}
  `;
}

function init() {
  const fCabin = document.getElementById('fCabin');
  fCabin.innerHTML = CABINS.map((c) => `<option value="${c.id}">${c.name} (${clp(c.priceNight)}/noche)</option>`).join('');
  fCabin.value = state.cabinId;
  setDefaultDates();

  document.querySelectorAll('#cabinFilters .pill').forEach((p) => {
    p.addEventListener('click', () => {
      document.querySelectorAll('#cabinFilters .pill').forEach((x) => x.classList.remove('active'));
      p.classList.add('active');
      state.filter = p.dataset.filter;
      renderCabins();
    });
  });

  document.getElementById('quickSearchForm').addEventListener('submit', (e) => {
    e.preventDefault();
    document.getElementById('fCheckin').value = document.getElementById('qCheckin').value;
    document.getElementById('fCheckout').value = document.getElementById('qCheckout').value;
    document.getElementById('fGuests').value = document.getElementById('qGuests').value;
    state.cabinId = document.getElementById('qCabin').value;
    document.getElementById('fCabin').value = state.cabinId;
    renderCabins();
    updateSummary();
    document.getElementById('cotizador').scrollIntoView({ behavior: 'smooth' });
  });

  ['fName', 'fGuests', 'fCheckin', 'fCheckout', 'fCabin', 'fNotes'].forEach((id) => {
    document.getElementById(id).addEventListener('input', () => {
      if (id === 'fCabin') {
        state.cabinId = document.getElementById('fCabin').value;
        renderCabins();
      }
      updateSummary();
    });
  });

  document.getElementById('copyMsgBtn').addEventListener('click', () => {
    navigator.clipboard.writeText(window.__currentCabanaMsg || '');
    const btn = document.getElementById('copyMsgBtn');
    btn.textContent = '✓ ¡Mensaje copiado!';
    setTimeout(() => (btn.textContent = '📋 Copiar detalle del mensaje'), 2000);
  });

  const drawer = document.getElementById('drawer');
  const backdrop = document.getElementById('drawerBackdrop');
  const toggleDrawer = (open) => {
    drawer.classList.toggle('open', open);
    backdrop.classList.toggle('open', open);
  };
  document.getElementById('openDrawerBtn').addEventListener('click', () => toggleDrawer(true));
  document.getElementById('closeDrawerBtn').addEventListener('click', () => toggleDrawer(false));
  backdrop.addEventListener('click', () => toggleDrawer(false));
  document.getElementById('drawerGoQuote').addEventListener('click', () => toggleDrawer(false));

  const mToggle = document.getElementById('mobileToggle');
  const mMenu = document.getElementById('mobileMenu');
  mToggle.addEventListener('click', () => mMenu.classList.toggle('open'));
  document.querySelectorAll('.m-link').forEach((a) => a.addEventListener('click', () => mMenu.classList.remove('open')));

  renderCabins();
  renderExtras();
  updateSummary();
}

document.addEventListener('DOMContentLoaded', init);
