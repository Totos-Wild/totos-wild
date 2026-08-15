export function sendTemplateMail(body) {
  const subject = encodeURIComponent("Bestellung bei Toto's Wild & Honig");
  const mailto = `mailto:totos-wild@web.de?subject=${subject}&body=${body}`;

  window.location.href = mailto;
}

export function createMailBody(name, dateInput, productList, requestList) {
  const date = new Date(dateInput);
  const formattedDate = new Intl.DateTimeFormat('de-DE').format(date);
  
  const mailBody = 
`Hallo Herr Jahn,

ich möchte folgende Produkte bestellen:
Abholungsdatum: ${formattedDate}

${productList || '-'}

ich möchte folgende Produkte anfragen:
${requestList || '-'}

Bitte bestätigen sie die Bestellung.

Viele Grüße,
${name}`;
  
  return encodeURIComponent(mailBody);
}