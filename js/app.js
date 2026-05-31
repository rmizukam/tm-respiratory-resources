document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('searchInput');
  const toolCards = document.querySelectorAll('.tool-card');
  const cardCountDisplay = document.getElementById('cardCount');
  const calcModal = document.getElementById('calcModal');
  const openCalcBtn = document.getElementById('openCalcBtn');
  const closeCalcBtn = document.getElementById('closeCalcBtn');

  // Mobile Drawer Selector Tree Elements
  const sidebarNode = document.getElementById('sidebar');
  const sidebarToggle = document.getElementById('sidebarToggleBtn');
  const sidebarClose = document.getElementById('sidebarCloseBtn');

  // Trigger Sidebar Sliding Drawer Handlers
  if (sidebarToggle && sidebarClose && sidebarNode) {
    sidebarToggle.addEventListener('click', () => sidebarNode.classList.remove('-translate-x-full'));
    sidebarClose.addEventListener('click', () => sidebarNode.classList.add('-translate-x-full'));
  }

  // Global Engine Module Injection Setup
  if (typeof initVentCalculator === 'function') {
    initVentCalculator('vent-calc-container');
  }

  // Hub Global Search Filter Logic
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

  // Global Keyboard Shortcuts
  window.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'SELECT') {
      e.preventDefault();
      searchInput.focus();
    }
  });

  // Hub Modal Control Logic (Calculator)
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


  // ================= PDF MODAL CONTROL PIPELINE =================
  const pdfModal = document.getElementById('pdfModal');
  const openPdfBtn = document.getElementById('openPdfBtn');
  const closePdfBtn = document.getElementById('closePdfBtn');
  const pdfViewerFrame = document.getElementById('pdfViewerFrame');
  const pdfUrl = "https://www.idsmed.co.th/filesdirectserver/itp1/z_itp_17082021d2m1/02z-z912388070468.pdf";

  if (openPdfBtn && pdfModal && pdfViewerFrame) {
    openPdfBtn.addEventListener('click', () => {
      // Set frame source dynamically when opened to avoid unnecessary network load on initial hub start
      pdfViewerFrame.src = pdfUrl;
      pdfModal.classList.remove('hidden');
    });
  }

  const closePdfViewer = () => {
    if (pdfModal && pdfViewerFrame) {
      pdfModal.classList.add('hidden');
      pdfViewerFrame.src = ""; // Clear active buffer allocation instantly
    }
  };

  if (closePdfBtn) closePdfBtn.addEventListener('click', closePdfViewer);
  if (pdfModal) {
    pdfModal.addEventListener('click', (e) => { if (e.target === pdfModal) closePdfViewer(); });
  }
});