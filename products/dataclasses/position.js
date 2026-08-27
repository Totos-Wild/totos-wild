export const PositionStatus = {
  AVAILABLE: 'AVAILABLE',
  ORDERED: 'ORDERED'
};

export class Position {
  /** @type {number} */
  Id;
  /** @type {number} */
  productId;
  /** @type {string} */
  weight;
  /** @type {string} */
  price;
  /** @type {string} */
  status;

  constructor(data) {
    this.Id = data.ID;
    this.productId = data.ProduktID;
    this.weight = data.Gewicht;
    this.price = data.Preis;
    this.status = data.Status === 'vorhanden' ? PositionStatus.AVAILABLE : PositionStatus.ORDERED;
  }
}