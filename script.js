// 1. DATA: a list of properties. Each one is an "object" inside { }
const listings = [
  { title: "Spacious 6-room flat", type: "Apartment flat", area: "Lalitpur", stay: "Permanent", rooms: 6, washroom: "1 private", balconies: 3, rent: 35000 },
  { title: "Ground floor shutter room", type: "Shop / shutter", area: "Lalitpur", stay: "Permanent", rooms: 1, washroom: "1 private", balconies: 0, rent: 20000 },
  { title: "Single room, shared washroom", type: "Single room", area: "Bhaktapur", stay: "Both", rooms: 1, washroom: "Shared", balconies: 0, rent: 5000 },
  // The two below are SAMPLE data. Change them to real ones later.
  { title: "Student room near college", type: "Single room", area: "Bhaktapur", stay: "Temporary", rooms: 1, washroom: "Shared", balconies: 1, rent: 4500 },
  { title: "Family bungalow with garden", type: "Entire house", area: "Kathmandu", stay: "Permanent", rooms: 5, washroom: "3 private", balconies: 2, rent: 60000 }
];

// 2. DISPLAY: a function that draws cards on the page
function showListings(list) {
  const grid = document.getElementById("card-grid");
  const count = document.getElementById("result-count");

  grid.innerHTML = "";
  count.textContent = list.length + (list.length === 1 ? " property found" : " properties found");

  if (list.length === 0) {
    grid.innerHTML = "<p>No properties match your search. Try a wider budget or a different area.</p>";
    return;
  }

  list.forEach(function (item) {
    const stayLabel = item.stay === "Both" ? "Short or long stay" : item.stay;
    const balconyItem = item.balconies > 0
      ? `<li>${item.balconies} balcon${item.balconies === 1 ? "y" : "ies"}</li>`
      : "";

    grid.innerHTML += `
      <article class="card">
        <div class="card-top">
          <span class="tag">${item.type}</span>
          <span class="stay">${stayLabel}</span>
        </div>
        <h3>${item.title}</h3>
        <p class="location">${item.area}</p>
        <ul class="facts">
          <li>${item.rooms} ${item.rooms === 1 ? "room" : "rooms"}</li>
          <li>${item.washroom} washroom</li>
          ${balconyItem}
        </ul>
        <div class="card-bottom">
          <p class="price">Rs ${item.rent.toLocaleString("en-IN")} <small>/ month</small></p>
          <p class="bills">+ electricity and water, by your usage</p>
        </div>
      </article>
    `;
  });
}
// 3. FILTER: runs when the Search button is clicked
document.getElementById("search-form").addEventListener("submit", function (event) {
  event.preventDefault(); // stops the page from reloading

  const area = document.getElementById("area").value;
  const type = document.getElementById("type").value;
  const stay = document.getElementById("stay").value;
  const min = Number(document.getElementById("min").value) || 0;
  const max = Number(document.getElementById("max").value) || Infinity;

  const results = listings.filter(function (item) {
    return (area === "" || item.area === area) &&
           (type === "" || item.type === type) &&
           (stay === "" || item.stay === stay || item.stay === "Both") &&
           item.rent >= min && item.rent <= max;
  });

  showListings(results);
});

// 4. START: show everything when the page first opens
showListings(listings);

// 5. BILL CALCULATOR
const calcProperty = document.getElementById("calc-property");
const calcRent = document.getElementById("calc-rent");
const calcMessage = document.getElementById("calc-message");

// Turn a number into text like "Rs 5,530"
function rs(amount) {
  return "Rs " + Math.round(amount).toLocaleString("en-IN");
}

// Fill the property dropdown from the same listings list
listings.forEach(function (item, index) {
  calcProperty.innerHTML += `<option value="${index}">${item.title} (${item.area})</option>`;
});
calcRent.value = listings[0].rent;

// When another property is picked, fill in its rent automatically
calcProperty.addEventListener("change", function () {
  calcRent.value = listings[calcProperty.value].rent;
});

function updateBill() {
  const rent = Number(calcRent.value) || 0;

  const elecPrev = Number(document.getElementById("elec-prev").value) || 0;
  const elecCurr = Number(document.getElementById("elec-curr").value) || 0;
  const elecRate = Number(document.getElementById("elec-rate").value) || 0;

  const waterPrev = Number(document.getElementById("water-prev").value) || 0;
  const waterCurr = Number(document.getElementById("water-curr").value) || 0;
  const waterRate = Number(document.getElementById("water-rate").value) || 0;

  // A meter only counts upward, so a lower reading must be a typing mistake
  if (elecCurr < elecPrev || waterCurr < waterPrev) {
    calcMessage.textContent = "The current reading can't be lower than the previous one.";
    return;
  }
  calcMessage.textContent = "";

  const elecUnits = Math.round((elecCurr - elecPrev) * 100) / 100;
  const waterUnits = Math.round((waterCurr - waterPrev) * 100) / 100;
  const elecCost = elecUnits * elecRate;
  const waterCost = waterUnits * waterRate;

  document.getElementById("res-rent").textContent = rs(rent);
  document.getElementById("res-elec-units").textContent = elecUnits + " units x Rs " + elecRate;
  document.getElementById("res-elec").textContent = rs(elecCost);
  document.getElementById("res-water-units").textContent = waterUnits + " units x Rs " + waterRate;
  document.getElementById("res-water").textContent = rs(waterCost);
  document.getElementById("res-total").textContent = rs(rent + elecCost + waterCost);
}

document.getElementById("calc-form").addEventListener("submit", function (event) {
  event.preventDefault();
  updateBill();
});

updateBill(); // show the rent on first load