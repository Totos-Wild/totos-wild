import { parseNumber, formatNumber } from '../base/utils/parse.js';
import { Offer } from '../products/dataclasses/offer.js';
import { Product } from '../products/dataclasses/product.js';
import { Position } from '../products/dataclasses/position.js';

class CartState {
  /** @type {Map<Offer, number>} */
  selectedOffers = new Map();
  /** @type {Map<Product, Set<Position>>} */
  selectedPositions = new Map();
  /** @type {Map<Product, string>} */
  selectedRequests = new Map();

  constructor() {
    this.loadFromStorage();
  }

  saveToStorage() {
    const state = {
      selectedOffers: Array.from(this.selectedOffers.entries()).map(([offer, amount]) => [JSON.stringify(offer), amount]),
      selectedPositions: Array.from(this.selectedPositions.entries()).map(([product, positions]) => [JSON.stringify(product), Array.from(positions).map(pos => JSON.stringify(pos))]),
      selectedRequests: Array.from(this.selectedRequests.entries()).map(([product, request]) => [JSON.stringify(product), request])
    };
    sessionStorage.setItem('cartState', JSON.stringify(state));
  }

  loadFromStorage() {
    const stored = sessionStorage.getItem('cartState');
    if (stored) {
      try {
        const state = JSON.parse(stored);
        this.selectedOffers = new Map(state.selectedOffers.map(([offerStr, amount]) => [JSON.parse(offerStr), amount]));
        this.selectedPositions = new Map(state.selectedPositions.map(([productStr, positionsStr]) => [JSON.parse(productStr), new Set(positionsStr.map(posStr => JSON.parse(posStr)))]));
        this.selectedRequests = new Map(state.selectedRequests.map(([productStr, request]) => [JSON.parse(productStr), request]));
      } catch (e) {
        console.error('Fehler beim Laden des Cart-States:', e);
        this.selectedOffers = new Map();
        this.selectedPositions = new Map();
        this.selectedRequests = new Map();
      }
    }
  }

  createProductList(productMap) {
    let totalOrderPrice = 0;

    const offerLines = Array.from(this.selectedOffers.entries())
      .map(([offer, amount]) => {
        const totalPrice = parseNumber(offer.price) * amount;
        totalOrderPrice += totalPrice;

        return `${productMap.get(offer.productId).name} (${offer.variant}): ${amount}x${offer.price}€ = ${formatNumber(totalPrice)}€`;
      });

    const positionLines = Array.from(this.selectedPositions.entries())
      .flatMap(([product, positions]) => Array.from(positions).map(pos => {
        totalOrderPrice += parseNumber(pos.price);

        return `${product.name} (${pos.weight}kg): ${pos.price}€`;
      }));

    let productList = [...offerLines, ...positionLines]
      .join("\n")
      .trim();

    const noProducts = productList === "";

    if (noProducts) {
      productList = "Keine Produkte ausgewählt.";
    } else {
      productList += `\n\nGesamtpreis: ${formatNumber(totalOrderPrice)}€`;
    }

    return productList;
  }

  createRequestList() {
    return Array.from(this.selectedRequests.entries())
      .map(([product, request]) => {
        return `${product.name}: ${request}`;
      });
  }

  saveRequestText(requestText, product) {
    if (requestText !== "") {
      this.selectedRequests.set(product, requestText);
    }
    else {
      if (this.selectedRequests.has(product)) {
        this.selectedRequests.delete(product);
      }
    }
    this.saveToStorage();
  }

  isSelectionEmpty() {
    return this.selectedOffers.size === 0 &&
      this.selectedPositions.size === 0 &&
      this.selectedRequests.size === 0;
  }

  togglePositionSelection(product, position) {
    if (!this.selectedPositions.has(product)) {
      this.selectedPositions.set(product, new Set());
    }

    const set = this.selectedPositions.get(product);

    if (set.has(position)) {
      set.delete(position);

      if (set.size === 0) {
        this.selectedPositions.delete(product);
      }
    } else {
      set.add(position);
    }
    this.saveToStorage();
  }
}

export const cartState = new CartState();
