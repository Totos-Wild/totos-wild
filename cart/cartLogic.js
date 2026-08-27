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
    for (const [storedOffer, amountSelected] of this.selectedOffers.entries()) {
      if (storedOffer.productId === offer.productId && storedOffer.posId === offer.posId) {
        return amountSelected;
      }
    }
    return 0;
  }

  setOfferAmount(offer, amountSelected) {
    for (const [storedOffer] of this.selectedOffers.entries()) {
      if (storedOffer.productId === offer.productId && storedOffer.posId === offer.posId) {
        if (amountSelected > 0) {
          this.selectedOffers.set(storedOffer, amountSelected);
        } else {
          this.selectedOffers.delete(storedOffer);
        }
        return;
      }
    }
    if (amountSelected > 0) {
      this.selectedOffers.set(offer, amountSelected);
    }
  }

  removeOffer(offer) {
    for (const [storedOffer] of this.selectedOffers.entries()) {
      if (storedOffer.productId === offer.productId && storedOffer.posId === offer.posId) {
        this.selectedOffers.delete(storedOffer);
        return;
      }
    }
  }

  createOfferData(productMap) {
    const offers = [];

    for (const [offer, amountSelected] of this.selectedOffers.entries()) {
      offers.push({
        productId: offer.productId,
        posId: offer.posId,
        amount: amountSelected,
        price: offer.price,
        name: productMap.get(offer.productId).name,
      });
    }

    return offers;
  }

  createPositionData() {
    const positions = [];

    for (const [product, positionSet] of this.selectedPositions.entries()) {
      for (const position of positionSet) {
        positions.push({
          positionId: position.Id,
          productId: position.productId,
          name: product.name,
          price: position.price,
          weight: position.weight,
        });
      }
    }

    return positions;
  }

  createRequestData() {
    const requests = [];

    for (const [product, request] of this.selectedRequests.entries()) {
      requests.push({
        name: product.name,
        text: request,
      });
    }

    return requests;
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

  clear() {
    this.selectedOffers.clear();
    this.selectedPositions.clear();
    this.selectedRequests.clear();
    this.saveToStorage();
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
