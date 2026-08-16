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
            <div>Gewicht: ${formatNumber(pos.weight)}kg, Preis: ${formatNumber(pos.price)}€</div>
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