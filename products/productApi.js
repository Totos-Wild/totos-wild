import { SERVER_URL } from '../base/config.js';

export async function loadData(typ) {
  const produktePfad = "produkte.php";
  const response = await fetch(`${SERVER_URL}${produktePfad}?typ=${encodeURIComponent(typ)}`);
  const daten = await response.json();
  return daten;
}