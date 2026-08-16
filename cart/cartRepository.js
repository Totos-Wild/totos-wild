const STORAGE_KEY = 'cartState';

export function saveCartState(cartState) {
  const state = {
    selectedOffers: Array.from(cartState.selectedOffers.entries()).map(([offer, amount]) => [JSON.stringify(offer), amount]),
    selectedPositions: Array.from(cartState.selectedPositions.entries()).map(([product, positions]) => [JSON.stringify(product), Array.from(positions).map(pos => JSON.stringify(pos))]),
    selectedRequests: Array.from(cartState.selectedRequests.entries()).map(([product, request]) => [JSON.stringify(product), request])
  };
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function loadCartState() {
  const stored = sessionStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      const state = JSON.parse(stored);
      return {
        selectedOffers: new Map(state.selectedOffers.map(([offerStr, amount]) => [JSON.parse(offerStr), amount])),
        selectedPositions: new Map(state.selectedPositions.map(([productStr, positionsStr]) => [JSON.parse(productStr), new Set(positionsStr.map(posStr => JSON.parse(posStr)))])),
        selectedRequests: new Map(state.selectedRequests.map(([productStr, request]) => [JSON.parse(productStr), request]))
      };
    } catch (e) {
      console.error('Fehler beim Laden des Cart-States:', e);
      return {
        selectedOffers: new Map(),
        selectedPositions: new Map(),
        selectedRequests: new Map()
      };
    }
  }
  return {
    selectedOffers: new Map(),
    selectedPositions: new Map(),
    selectedRequests: new Map()
  };
}

export function clearCartState() {
  sessionStorage.removeItem(STORAGE_KEY);
}
