//open street map api, create map
const mymap = L.map("issMap").setView([0, 0], 3);
const attribution =
  "&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors";
const tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const tiles = L.tileLayer(tileUrl, { attribution });
tiles.addTo(mymap);

//custom marker icon
const issIcon = L.icon({
  iconUrl: "iss.png",
  iconSize: [60, 50],
  iconAnchor: [25, 16]
});
//add marker and icon
const marker = L.marker([0, 0], { icon: issIcon }).addTo(mymap);

//base url for iss position
const BASE_URL = "https://api.wheretheiss.at/v1/satellites";

const catchISS = async () => {
  const response = await fetch(`${BASE_URL}`);
  const data = await response.json();
  const id = data[0].id;
  return id;
};

const getIssPosition = async id => {
  const response = await fetch(`${BASE_URL}/${id}`);
  const data = await response.json();
  return data;
};

const createUI = data => {
  const alt = document.querySelector(".alt");
  const lat = document.querySelector(".lat");
  const lng = document.querySelector(".lng");
  const { altitude, latitude, longitude, units } = data;

  alt.textContent = `${altitude.toFixed(0)} ${units}`;
  lat.textContent = `${latitude.toFixed(2)}°`;
  lng.textContent = `${longitude.toFixed(2)}°`;

  marker.setLatLng([latitude, longitude]);
  mymap.setView([latitude, longitude]);
};

catchISS().then(id => {
  setInterval(() => {
    getIssPosition(id).then(data => createUI(data));
  }, 2000);
});
