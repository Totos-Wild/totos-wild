import { cartState } from '../cart/cartLogic.js';
import { parseNumber, formatNumber, truncate } from '../base/utils/parse.js';
import { createMailBody, sendTemplateMail } from '../mail/mail.js';

let escHandler;

export function showImageOverlay(src) {
  const overlay = document.createElement("div");
  overlay.id = "image-overlay";
  overlay.className = "popup-overlay";

  overlay.innerHTML = `
    <img src="${src}">
  `;

  document.body.appendChild(overlay);
  const closeEvent = createCloseHandler(overlay);
  bindCloseEvents(overlay, closeEvent);
}

function bindCloseEvents(overlay, onCloseEvent, button = null) {
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      onCloseEvent();
    }
  });

  if (button !== null) {
    button.addEventListener("click", onCloseEvent);
  }

  escHandler = createEscHandler(onCloseEvent);
  document.addEventListener("keydown", escHandler);
}

function createEscHandler(onCloseEvent) {
  return (e) => {
    if (e.key === "Escape") {
      onCloseEvent();
    }
  };
}

function createCloseHandler(overlay, onCloseEvent = null) {
  return () => {
    if (onCloseEvent) onCloseEvent();
    overlay.remove();
    document.removeEventListener("keydown", escHandler);
  };
}

export function showPositionSelection(product) {
  const overlay = document.createElement("div");
  overlay.classList.add("popup-overlay");

  overlay.innerHTML = `
    <div class="overlay-content">
      <h2>${product.name}</h2>
      <p>Verfügbare Auswahl:</p>

      <div class="position-list">
        ${product.positions.map((pos, index) => `
          <div class="position-item">
            <div>Gewicht: ${pos.weight}kg, Preis: ${pos.price}€</div>
            <button
              class="select-position-btn"
              data-index="${index}">
              Auswählen
            </button>
          </div>
        `).join("")}
      </div>

      <div style="margin-top:15px; text-align:right;">
        <button class="button-default" id="close-position-btn">
          Schließen
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  const closeEvent = createCloseHandler(overlay);
  const closeButton = overlay.querySelector("#close-position-btn");
  bindCloseEvents(overlay, closeEvent, closeButton);

  overlay.querySelectorAll(".select-position-btn")
    .forEach(button => {
      const index = Number(button.dataset.index);
      const position = product.positions[index];

      updateSelectionButton(button, product, position);

      button.addEventListener("click", () => {
        cartState.togglePositionSelection(product, position);
        updateSelectionButton(button, product, position);
      });
    });
}

function updateSelectionButton(button, product, position) {
  const isSelected =
    cartState.selectedPositions.has(product) &&
    cartState.selectedPositions.get(product).has(position);

  if (isSelected) {
    button.textContent = "-";
    button.classList.add("minus-btn");
    button.classList.remove("plus-btn");
    button.style.backgroundColor = "red";
  } else {
    button.textContent = "+";
    button.classList.add("plus-btn");
    button.classList.remove("minus-btn");
    button.style.backgroundColor = "green";
  }
}

export function showRequestForm(product) {
  const overlay = document.createElement("div");
  overlay.id = "request-form-overlay";
  overlay.className = "popup-overlay";
  overlay.innerHTML = `
    <div class="overlay-content">
    <h2>Anfrage</h2>
    <label>Bemerkung:</label>
    <textarea id="request-textarea" placeholder="Anzahl, Gewicht, Wünsche, Anmerkungen, etc." required>${cartState.selectedRequests.get(product) ?? ""}</textarea>
    <button class="button-default" id="close-request-form-overlay">Schließen</button>
    </div>
  `;

  document.body.appendChild(overlay);
  const closeEvent = createCloseHandler(overlay, () => cartState.saveRequestText(overlay.querySelector("#request-textarea").value, product))
  const closeButton = overlay.querySelector("#close-request-form-overlay");
  bindCloseEvents(overlay, closeEvent, closeButton);
}

export function showCartForm(productMap) {
  const overlay = document.createElement("div");
  overlay.id = "cart-overlay";
  overlay.className = "popup-overlay";

  overlay.innerHTML = `
    <div class="overlay-content">
      <h2>Bestellung aufgeben</h2>
      <form id="cart-form">
        <label>Abholungsdatum:</label>
        <input type="date" id="pickup-date" required>

        <label>Name:</label>
        <input type="text" id="customer-name" placeholder="Dein Name" required>

        <label>Produkte:</label>
        <div id="cart-items" class="cart-items"></div>

        <div id="cart-total" class="cart-total"></div>

        <div style="margin-top:15px; display:flex; gap:10px; justify-content:flex-end;">
          <button type="submit" id="submit-order-btn" class="button-default">Email erstellen</button>
          <button type="button" class="button-default" id="close-cart-btn">Abbrechen</button>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(overlay);
  const closeEvent = createCloseHandler(overlay);
  const closeButton = overlay.querySelector("#close-cart-btn");
  bindCloseEvents(overlay, closeEvent, closeButton);
  updateSubmitButtonState();
  renderCartItems(productMap);

  document.getElementById("cart-form")
    .addEventListener("submit", (e) => {
      e.preventDefault();
      createEmailClick(overlay, productMap);
      closeEvent();
    });
}

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

function createEmailClick(overlay, productMap) {
  const name = document.getElementById("customer-name").value;
  const date = document.getElementById("pickup-date").value;
  const productList = cartState.createProductList(productMap);
  const RequestList = cartState.createRequestList()

  const body = createMailBody(name, date, productList, RequestList);
  sendTemplateMail(body);

  overlay.remove();
}