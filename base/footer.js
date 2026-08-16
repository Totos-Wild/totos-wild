const getBasePath = () => {
  const currentPath = window.location.pathname;
  if (currentPath.includes('/impressum/') || 
      currentPath.includes('/datenschutz/') || 
      currentPath.includes('/warenkorb/')) {
    return '../';
  }
  return '';
};

const footerHTML = showLegend => `
  <footer>
    ${showLegend ? `
    <div class="product-legend">
      <div>Auf Lager<span class="legend-color in-stock"></span></div>
      <div>Wenig auf Lager<span class="legend-color low-stock"></span></div>
      <div>Vorbestellung<span class="legend-color no-stock"></span></div>
    </div>
    ` : ''}
    <div class="footer-links">
      <a href="${getBasePath()}impressum/" class="button-default footer-btn footer-link-btn">Impressum</a>
      <a href="${getBasePath()}datenschutz/" class="button-default footer-btn footer-link-btn">Datenschutz</a>
    </div>
    <a href="${getBasePath()}" class="button-default footer-btn" id="home-btn">
      <img src="${getBasePath()}images/haus.png" class="footer-icon">
      <span class="footer-text">Startseite</span>
    </a>
    <a href="${getBasePath()}warenkorb/" class="button-default footer-btn" id="cart-btn">
      <img src="${getBasePath()}images/cart-icon.png" class="footer-icon">
      <span class="footer-text">Warenkorb</span>
    </a>
  </footer>
`;

function insertFooter(showLegend = false) {
  document.body.insertAdjacentHTML('beforeend', footerHTML(showLegend));
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { insertFooter };
}
