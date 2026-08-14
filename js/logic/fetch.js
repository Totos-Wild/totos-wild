async function loadData(typ) {
  const piUrl = "https://www-totos-wild-und-honig-de.k2x1vmwia2xhdx8w.myfritz.net/totos-wild-server/produkte.php";
  const response = await fetch(`${piUrl}?typ=${encodeURIComponent(typ)}`);
  const daten = await response.json();
  return daten;
}