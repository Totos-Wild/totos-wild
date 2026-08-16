import { cartState } from './cartLogic.js';
import { parseNumber, formatNumber, truncate } from '../base/utils/parse.js';
import { createMailBody, sendTemplateMail } from '../mail/mail.js';
import { loadProducts } from '../products/productRepository.js';

function updateSubmitButtonState() {
  const submitBtn = document.getElementById("submit-order-btn");
  submitBtn.disabled = cartState.isSelectionEmpty();
}

function renderCartItems(productMap) {
  const container = document.getElementById("cart-items");
  const totalDiv = document.getElementById("cart-total");

  container.innerHTML = "";
  let total = 0;

  for (const [offer, amount] of cartState.selectedOffers.entries()) {
    const product = productMap.get(offer.productId);
    const price = parseNumber(offer.price) * amount;
    total += price;

    container.appendChild(
      createCartRow(
        `${product.name} (${offer.variant})`,
        `${amount} × ${offer.price}€`,
        `${formatNumber(price)}€`,
        () => {
          cartState.selectedOffers.delete(offer);
          renderCartItems(productMap);
          cartState.saveToStorage();
        }
      )
    );
  }

  for (const [product, positions] of cartState.selectedPositions.entries()) {
    for (const pos of positions) {
      total += parseNumber(pos.price);

      container.appendChild(
        createCartRow(
          `${product.name}`,
          `${pos.weight} kg`,
          `${pos.price}€`,
          () => {
            positions.delete(pos);
            if (positions.size === 0) cartState.selectedPositions.delete(product);
            renderCartItems(productMap);
          }
        )
      );
    }
  }

  let requestSeparatorAdded = false;

  for (const [product, requestText] of cartState.selectedRequests.entries()) {
    if (!requestSeparatorAdded) {
      container.appendChild(createRequestSeparator());
      requestSeparatorAdded = true;
    }

    container.appendChild(
      createRequestEntry(
        product.name,
        `Anfrage: ${truncate(requestText)}`,
        () => {
          cartState.selectedRequests.delete(product);
          renderCartItems(productMap);
          cartState.saveToStorage();
        }
      )
    );
  }

  updateSubmitButtonState();
  totalDiv.textContent = container.children.length === 0
    ? "Keine Produkte ausgewählt."
    : `Gesamtpreis: ${formatNumber(total)}€`;
}

function createCartRow(name, info, price, onRemove) {
  const row = document.createElement("div");
  row.className = "cart-row";

  row.innerHTML = `
    <div class="cart-name">${name}</div>
    <div class="cart-info">${info}</div>
    <div class="cart-price">${price}</div>
    <button class="cart-remove">✕</button>
  `;

  row.querySelector(".cart-remove")
    .addEventListener("click", onRemove);

  return row;
}

function createRequestEntry(name, requestText, onRemove) {
  const entry = document.createElement("div");
  entry.className = "request-entry";

  entry.innerHTML = `
    <div class="request-entry-text">
      <div class="request-entry-name">${name}</div>
      <div class="request-entry-info">${requestText}</div>
    </div>
    <button class="cart-remove">✕</button>
  `;

  entry.querySelector(".cart-remove")
    .addEventListener("click", onRemove);

  return entry;
}

function createRequestSeparator() {
  const sep = document.createElement("div");
  sep.className = "cart-separator";
  sep.textContent = "Anfragen";
  return sep;
}

function createEmailClick(productMap) {
  const name = document.getElementById("customer-name").value;
  const date = document.getElementById("pickup-date").value;
  const productList = cartState.createProductList(productMap);
  const RequestList = cartState.createRequestList();

  const body = createMailBody(name, date, productList, RequestList);
  sendTemplateMail(body);
}

export async function initializeCartPage() {
  const loader = document.getElementById("loader");
  if (loader) loader.classList.remove("hidden");
  
  try {
    const productMap = await loadProducts();
    updateSubmitButtonState();
    renderCartItems(productMap);

    document.getElementById("cart-form").addEventListener("submit", (e) => {
      e.preventDefault();
      createEmailClick(productMap);
    });
  } catch (ex) {
    document.getElementById("cart-items").innerHTML = "<p>Fehler beim Laden der Produkte</p>";
    console.error(ex);
  } finally {
    if (loader) loader.classList.add("hidden");
  }
}

initializeCartPage();
