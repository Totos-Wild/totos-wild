import { loadData } from './productApi.js';
import { Product } from './dataclasses/product.js';
import { Offer } from './dataclasses/offer.js';
import { Category } from './dataclasses/category.js';
import { Position } from './dataclasses/position.js';
import { fillProducts, fillCategoriesWithProducts } from './productCombiner.js';

export async function loadCategories() {
  const categoriesRaw = await loadData("Kategorien");
  return categoriesRaw.map(d => new Category(d));
}

export async function loadProducts() {
  const productsRaw = await loadData("Produkte");
  const offersRaw = await loadData("Angebote");
  const positionsRaw = await loadData("Positionen");

  const productsEmpty = productsRaw.map(d => new Product(d));
  const offers = offersRaw.map(d => new Offer(d));
  const positions = positionsRaw
    .filter(d => d.ProduktID != null && d.ProduktID !== "" && d.Gewicht != null && d.Gewicht !== "")
    .map(d => new Position(d));

  const products = fillProducts(productsEmpty, offers, positions);

  const productMap = new Map(
    products.map(p => [p.id, p])
  );

  return productMap;
}

export async function loadAll() {
  const [categories, productMap] = await Promise.all([
    loadCategories(),
    loadProducts()
  ]);

  const categoriesWithProducts = fillCategoriesWithProducts(categories, productMap);

  return [categoriesWithProducts, productMap];
}