document.addEventListener('DOMContentLoaded', async () => {
  const searchInput = document.getElementById('searchInput');
  const toolCards = document.querySelectorAll('.tool-card');
  const cardCountDisplay = document.getElementById('cardCount');
  const calcModal = document.getElementById('calcModal');
  const openCalcBtn = document.getElementById('openCalcBtn');
  const closeCalcBtn = document.getElementById('closeCalcBtn');

  // Load Component Layout from Root Context
  const sidebarContainer = document.getElementById('sidebar');
  if (sidebarContainer) {
    try {
      const response = await fetch('components/sidebar.html');
      sidebarContainer.innerHTML = await response.text();
      
      // Fix paths for subpage targets because we are on the root level
      document.querySelectorAll('#sidebar nav a').forEach(link => {
        const type = link.getAttribute('data-path');
        const href = link.getAttribute('href');
        if (type === 'page' && href) {
          link.setAttribute('href', 'pages/' + href);
        } else if (type === 'root') {
          link.setAttribute('href', '#'); // Already on home dashboard
          link.classList.add('bg-slate-800/40', 'text-cyan-500');
        }
      });
    } catch (err) {
      console.error("Failed to load root sidebar component:", err);
    }
  }

  // Sidebar Open/Close Layout Mobile Drawer Handlers
  const sidebarNode = document.getElementById('sidebar');
  const sidebarToggle = document.getElementById('sidebarToggleBtn');
  // Delayed binding to catch dynamic close button element
  document.body.addEventListener('click', (e) => {
    const closeBtn = e.target.closest('#sidebarCloseBtn');
    if (closeBtn && sidebarNode) sidebarNode.classList.add('-translate-x-full');
  });
  if (sidebarToggle && sidebarNode) {
    sidebarToggle.addEventListener('click', () => sidebarNode.classList.remove('-translate-x-full'));
  }

  if (typeof initVentCalculator === 'function') {
    initVentCalculator('vent-calc-container');
  }

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const query = searchInput.value.toLowerCase().trim();
      let visibleToolsCount = 0;
      toolCards.forEach(card => {
        if (card.getAttribute('data-title').includes(query)) {
          card.style.display = 'flex';
          visibleToolsCount++;
        } else {
          card.style.display = 'none';
        }
      });
      if (cardCountDisplay) cardCountDisplay.textContent = `Showing ${visibleToolsCount} items`;

      document.querySelectorAll('.resource-card').forEach(card => {
        card.style.setProperty('display', card.getAttribute('data-title').includes(query) ? 'flex' : 'none', 'important');
      });
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'SELECT') {
      e.preventDefault();
      searchInput.focus();
    }
  });

  const openModal = () => {
    calcModal.classList.remove('hidden');
    setTimeout(() => calcModal.classList.add('active'), 10);
  };
  const closeModal = () => {
    calcModal.classList.remove('active');
    setTimeout(() => calcModal.classList.add('hidden'), 200);
  };

  if (openCalcBtn) openCalcBtn.addEventListener('click', openModal);
  if (closeCalcBtn) closeCalcBtn.addEventListener('click', closeModal);
  calcModal.addEventListener('click', (e) => { if (e.target === calcModal) closeModal(); });

  // Embedded PDF Viewer Control Logic
  const pdfModal = document.getElementById('pdfModal');
  const openPdfBtn = document.getElementById('openPdfBtn');
  const closePdfBtn = document.getElementById('closePdfBtn');
  const pdfViewerFrame = document.getElementById('pdfViewerFrame');
  const pdfUrl = "https://www.idsmed.co.th/filesdirectserver/itp1/z_itp_17082021d2m1/02z-z912388070468.pdf";

  if (openPdfBtn && pdfModal && pdfViewerFrame) {
    openPdfBtn.addEventListener('click', () => {
      pdfViewerFrame.src = pdfUrl;
      pdfModal.classList.remove('hidden');
    });
  }

  const closePdfViewer = () => {
    if (pdfModal && pdfViewerFrame) {
      pdfModal.classList.add('hidden');
      pdfViewerFrame.src = "";
    }
  };

  if (closePdfBtn) closePdfBtn.addEventListener('click', closePdfViewer);
  if (pdfModal) {
    pdfModal.addEventListener('click', (e) => { if (e.target === pdfModal) closePdfViewer(); });
  }
});