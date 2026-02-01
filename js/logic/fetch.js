const path = location.hostname === "localhost"
  ? "http://localhost:3000"
  : "https://api.deinedomain.de";

  async function fetchTSV(url) {
  const res = await fetch(url);
  const tsvText = await res.text();
  const lines = tsvText.trim().split("\n");
  const headers = lines.shift().split("\t").map(h => h.trim());
  return lines.map(line => Object.fromEntries(headers.map((h, i) => [h, line.split("\t")[i]?.trim()])));
}

async function TestServerCall() {
  const response = await fetch(path + "/test");
  const data = await response.json();
  console.log(data);
}