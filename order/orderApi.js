import { SERVER_URL } from '../base/config.js';

export async function sendOrder(name, date, selectedOffers, selectedPositions, requests) {
  const orderPfad = "create-order.php";
  
  const response = await fetch(`${SERVER_URL}${orderPfad}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
      date,
      selectedOffers,
      selectedPositions,
      requests
    })
  });

  if (!response.ok) {
    console.error(await response.text());
    throw new Error("Server Fehler");
  }
}
