import { loadData } from './fetch.js';
import { Product } from './dataclasses/product.js';
import { Offer } from './dataclasses/offer.js';
import { Category } from './dataclasses/category.js';
import { Position } from './dataclasses/position.js';
import { fillProducts, fillCategoriesWithProducts } from './dataBuilder.js';

export async function loadCategories() {
  const productsRaw = await loadData("Produkte");
  const offersRaw = await loadData("Angebote");
  const positionsRaw = await loadData("Positionen");
  const categoriesRaw = await loadData("Kategorien");

  const productsEmpty = productsRaw.map(d => new Product(d));
  const offers = offersRaw.map(d => new Offer(d));
  const categoriesEmpty = categoriesRaw.map(d => new Category(d));
  const positions = positionsRaw
    .filter(d => d.ProduktID != null && d.ProduktID !== "" && d.Gewicht != null && d.Gewicht !== "")
    .map(d => new Position(d));


  const products = fillProducts(productsEmpty, offers, positions);
  const categories = fillCategoriesWithProducts(categoriesEmpty, products);

  const productMap = new Map(
    products.map(p => [p.id, p])
  );

  return [categories, productMap];
}