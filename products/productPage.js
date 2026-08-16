import { loadAll } from './productRepository.js';
import { buildProductCard } from './productCard.js';

function renderProductCategories(container, categories) {
  categories.forEach(category => {
    const h2 = document.createElement("h2");
    h2.textContent = category.name;
    container.appendChild(h2);

    if (category.description) {
      const infoDiv = document.createElement("div");
      infoDiv.className = "category-info";
      infoDiv.innerHTML = category.description.replace(/\\n/g, "<br>");
      container.appendChild(infoDiv);
    }

    category.products.forEach(p => {
      const productDiv = buildProductCard(p);
      container.appendChild(productDiv);
    });
  });
}

export async function initializeProductPage() {
  const loader = document.getElementById("loader");
  loader.classList.remove("hidden");
  
  try {
    const [categories, productMap] = await loadAll();
    renderProductCategories(container, categories);
  } catch (ex) {
    document.getElementById("product-container").innerHTML = "<p>Fehler beim Laden der Produkte</p>";
    console.error(ex);
  } finally {
    loader.classList.add("hidden");
  }
}