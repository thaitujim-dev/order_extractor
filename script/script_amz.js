window.addEventListener("load", init());

function init() {
  console.log("on init amz");
  var table = buildTable();
  $(table).insertAfter(".a-row.a-spacing-base:first");
}

function buildTable() {
  var orderDate = getOrderDate();
  var orderId = getOrderId();

  var result = "";
  var comma = ",";
  $(".a-fixed-left-grid").each(function (index) {
    var colRight = $(this).find(".a-fixed-left-grid-col.a-col-right");
    var colLeft = $(this).find(".a-fixed-left-grid-col.a-col-left");
    var quantityRaw = colLeft.find(".item-view-qty");
    var arrayRow = $(colRight).children(".a-row");
    var nameRaw = $(arrayRow[0]).text().trim();
    var name = parseName(nameRaw);
    var brand = parseBrand(arrayRow);
    var merchant = "amz";
    var quantity = parseQuantity(quantityRaw);
    var price = parsePrice(arrayRow);

    //var line = "<div>" + orderDate + comma + name + comma + brand + comma + merchant + comma + quantity + comma + price + comma + orderId + comma + "</div>";
    var line =
      "<div>" +
      joinVariable(orderDate, name, brand, merchant, quantity, price, orderId) +
      "</div>";
    result = result.concat(line);
  });
  return result;
}

function getOrderDate() {
  var raw = $("span.order-date-invoice-item").first().text();
  var date = parseDate(raw);
  return date;
}

function getOrderId() {
  var rawId = $($("span.order-date-invoice-item")[1]).text();
  var id = parseId(rawId);
  return id;
}

function exportData() {
  console.log("on exportData");
  chrome.runtime.sendMessage({ cmd: "cmd" }, function (response) {
    console.log(`message from background: ${JSON.stringify(response)}`);
  });

  // var exportDataUrl = chrome.extension.getURL("export_data.html");
  // chrome.tabs.create({ url: exportDataUrl, active: true });
}

function sendDataToAnalytics(tab) {
  // console.log(JSON.stringify(txnDataJSON));
  // chrome.tabs.sendMessage(tab.id, {"action" : "renderChartsTxns", "txns" : JSON.stringify(txnDataJSON)});
}

//library
function parseDate(dateRaw) {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  dateRaw = dateRaw.replace("Ordered on ", "").trim();
  dateRaw = dateRaw.substr(0, dateRaw.length - 6);
  var array = dateRaw.split(" ");
  var month = array[0];
  var day = array[1];
  var month = monthNames.indexOf(month) + 1;
  var result = month + "/" + day;
  return result;
}

function parseName(nameRaw) {
  var regEx = /(\d+\sof\s)(.+)/gi;
  var match = regEx.exec(nameRaw);
  if (match !== null) {
    return match[2].replace(/,/g, " ");
  } else {
    return nameRaw.replace(/,/g, " ");
  }
}

function parseQuantity(nameRaw) {
  nameRaw = nameRaw.text().trim();
  if (nameRaw.length != 0) {
    return nameRaw;
  } else {
    return "1";
  }

  // var regEx = /(\d+)(\sof\s)/ig;
  // var match = regEx.exec(nameRaw);
  // if(match !== null) {
  //     return match[1];
  // } else {
  //     return 1;
  // }
}

function parseId(rawId) {
  return rawId.replace("Order#", "").trim();
}

function parseBrand(arrayRow) {
  console.log(`parseBrand`);

  var brand = $(arrayRow[1]).text().trim();
  if (brand.includes("Sold by:")) {
    brand = $(arrayRow[0]).text().trim().toLowerCase();
  }
  brand = brand.toLowerCase();
  for (i = 0; i < candicateBrand.length; i++) {
    var candicate = candicateBrand[i].toLowerCase();
    if (brand.includes(candicate)) {
      return candicate;
    }
  }
  return " ";
}

function parsePrice(arrayRow) {
  var regEx = /^\$\d+.\d+/gi;
  for (i = 0; i < arrayRow.length; i++) {
    var price = $(arrayRow[i]).text().trim();
    var match = regEx.exec(price);
    if (match !== null) {

      res = match[0];
      res = res.replace(",", ".")
      res = res.replace("$", "")

      return res;
    }
  }

  return "$";
}

function joinVariable(...variable) {
  var result = "";
  for (let val of variable) {
    result = result + val + ", ";
  }
  return result;
}
