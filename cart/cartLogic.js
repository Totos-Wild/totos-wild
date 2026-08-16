import { parseNumber, formatNumber } from '../base/utils/parse.js';
import { Offer } from '../products/dataclasses/offer.js';
import { Product } from '../products/dataclasses/product.js';
import { Position } from '../products/dataclasses/position.js';
import { saveCartState, loadCartState } from './cartRepository.js';

class CartState {
  /** @type {Map<Offer, number>} */
  selectedOffers = new Map();
  /** @type {Map<Product, Set<Position>>} */
  selectedPositions = new Map();
  /** @type {Map<Product, string>} */
  selectedRequests = new Map();

  constructor() {
    const loadedCardState = loadCartState();
    this.selectedOffers = loadedCardState.selectedOffers;
    this.selectedPositions = loadedCardState.selectedPositions;
    this.selectedRequests = loadedCardState.selectedRequests;
  }

  saveToStorage() {
    saveCartState(this);
  }

  getOfferAmount(offer) {
    for (const [storedOffer, amount] of this.selectedOffers.entries()) {
      if (storedOffer.productId === offer.productId && storedOffer.variant === offer.variant) {
        return amount;
      }
    }
    return 0;
  }

  setOfferAmount(offer, amount) {
    for (const [storedOffer] of this.selectedOffers.entries()) {
      if (storedOffer.productId === offer.productId && storedOffer.variant === offer.variant) {
        if (amount > 0) {
          this.selectedOffers.set(storedOffer, amount);
        } else {
          this.selectedOffers.delete(storedOffer);
        }
        return;
      }
    }
    if (amount > 0) {
      this.selectedOffers.set({
        productId: offer.productId,
        variant: offer.variant,
        price: offer.price
      }, amount);
    }
  }

  removeOffer(offer) {
    for (const [storedOffer] of this.selectedOffers.entries()) {
      if (storedOffer.productId === offer.productId && storedOffer.variant === offer.variant) {
        this.selectedOffers.delete(storedOffer);
        return;
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
