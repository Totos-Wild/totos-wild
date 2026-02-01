const path = location.hostname === "localhost"
  ? "http://localhost:3000"
  : "https://api.deinedomain.de";

async function TestCall() {
  const response = await fetch(path + "/test");
  const data = await response.json();
  console.log(data);
}