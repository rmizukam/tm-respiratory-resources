import { initVentCalculator } from './modules/ventCalculator.js';

document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('searchInput');
  const toolCards = document.querySelectorAll('.tool-card');
  const cardCountDisplay = document.getElementById('cardCount');
  const calcModal = document.getElementById('calcModal');
  const openCalcBtn = document.getElementById('openCalcBtn');
  const closeCalcBtn = document.getElementById('closeCalcBtn');

  // Initialize the calculator module by passing it the container ID
  initVentCalculator('vent-calc-container');

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

  // Hub Modal Control Logic
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
});