const getBasePath = () => {
  const currentPath = window.location.pathname;
  const isInSubfolder = currentPath.includes('/impressum/') || 
                       currentPath.includes('/datenschutz/') || 
                       currentPath.includes('/warenkorb/');
  return isInSubfolder ? '../' : '';
};

const footerHTML = (showLegend = false) => {
  const basePath = getBasePath();
  
  return `
  <footer>
    ${showLegend ? `
    <div class="product-legend">
      <div>Auf Lager<span class="legend-color in-stock"></span></div>
      <div>Wenig auf Lager<span class="legend-color low-stock"></span></div>
      <div>Vorbestellung<span class="legend-color no-stock"></span></div>
    </div>
    ` : ''}
    
    <div class="footer-links">
      <a href="${basePath}impressum/" class="button-default footer-btn footer-link-btn">Impressum</a>
      <a href="${basePath}datenschutz/" class="button-default footer-btn footer-link-btn">Datenschutz</a>
    </div>
    
    <a href="${basePath}" class="button-default footer-btn" id="home-btn">
      <img src="${basePath}images/haus.png" class="footer-icon">
      <span class="footer-text">Startseite</span>
    </a>
    
    <a href="${basePath}warenkorb/" class="button-default footer-btn" id="cart-btn">
      <img src="${basePath}images/cart-icon.png" class="footer-icon">
      <span class="footer-text">Warenkorb</span>
    </a>
  </footer>
  `;
};

function insertFooter(showLegend = false) {
  document.body.insertAdjacentHTML('beforeend', footerHTML(showLegend));
}
