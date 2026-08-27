export class Offer {
  /** @type {number} */
  productId;
  /** @type {string} */
  variant;
  /** @type {string} */
  price;
  /** @type {number} */
  amount;
  /** @type {number} */
  amountThreshold;
  /** @type {number} */
  amountOrdered;
  /** @type {number} */
  amountAvailable;

  constructor(data) {
    this.productId = data.ProduktID;
    this.variant = data.Variante;
    this.price = data.Preis;
    this.amount = data.Anzahl;
    this.amountThreshold = data.Schwellwert;
    this.amountOrdered = data.Bestellt;
    this.amountAvailable = this.amount - this.amountOrdered;
  }
}