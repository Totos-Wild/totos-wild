import { SERVER_URL } from '../base/config.js';

export async function sendOrder(name, date, productList, requestList) {
  const orderPfad = "create-order.php";
  
  const response = await fetch(`${SERVER_URL}${orderPfad}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
      date,
      productList,
      requestList
    })
  });

  if (!response.ok) {
    const responseText = await response.text();
    console.error('Server error response:', responseText);
    let errorData;
    try {
      errorData = JSON.parse(responseText);
    } catch (e) {
      throw new Error('Server returned non-JSON error: ' + responseText);
    }
    throw new Error(errorData.error || 'Fehler beim Senden der Bestellung');
  }

  const responseText = await response.text();
  try {
    return JSON.parse(responseText);
  } catch (e) {
    throw new Error('Server returned non-JSON response: ' + responseText);
  }
}
