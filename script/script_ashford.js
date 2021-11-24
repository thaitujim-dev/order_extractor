window.addEventListener("load", init());

function init() {
  console.log("on init asford");
  addSaveEvent();
  var table = buildTable();
  $(table).insertBefore("ul.items.order-links");
}

function addSaveEvent() {
  $("table#my-orders-table > tbody > tr").each(function (index) {
    var colId = $(this).find(".col.id").text();
    var colDate = $(this).find(".col.date").text();
    var colAction = $(this).find(".col.actions").find("a");
    var href = colAction.attr("href");
    colAction.attr("href", href + "?colID=" + colId + "&colDate=" + colDate);
  });
}

function buildTable() {
  var result = "";
  var comma = ",";

  console.log("buildTable");
  $("#my-orders-table > tbody > tr").each(function (index) {
    console.log("buildTable build row");
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split("&");

    var dateRaw = sURLVariables[1].split("=")[1];
    var nameRaw = $(this).find("td").eq(0).find("strong").text();
    var brandRaw = nameRaw;
    var quantityRaw = $(this).find("td").eq(3).find("li").text();
    var priceRaw = $(this).find("td").eq(2).text();
    var idRaw = sURLVariables[0].split("=")[1];

    var orderDate = parseDate(dateRaw);
    var name = parseName(nameRaw);
    var brand = parseBrand(brandRaw);
    var quantity = parseQuantity(quantityRaw);
    var price = parsePrice(priceRaw);
    var orderId = parseId(idRaw);
    var merchant = "ashford";

    var line =
      "<div class='gomUs'>" +
      joinVariable(orderDate, name, brand, merchant, quantity, price, orderId) +
      "</div>";
    result = result.concat(line);
  });
  return result;
}

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
  dateRaw = dateRaw.replace("Order Date: ", "").trim();
  var date = dateRaw.split("/");
  var month = date[0];
  var day = date[1];
  var result =  month + "/" + day;
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

function parseBrand(brandRaw) {
  console.log(`parseBrand`);

  var brand = brandRaw.toLowerCase();

  for (i = 0; i < candicateBrand.length; i++) {
    var candicate = candicateBrand[i].toLowerCase();
    if (brand.includes(candicate)) {
      return candicateBrand[i];
    }
  }
  return " ";
}

function parseQuantity(quantityRaw) {
  var regEx = /\d+/g;
  var match = regEx.exec(quantityRaw);
  if (match !== null) {

    res = match[0];
    res = res.replace(",", ".")
    res = res.replace("$", "")

    return res;
  }
  return "1";
}

function parsePrice(priceRaw) {
  var regEx = /\$\d+.\d+/gi;
  var match = regEx.exec(priceRaw);
  if (match !== null) {
    return match[0].replace("$","");
  }

  return "$";
}

//library

function parseId(rawId) {
  var regEx = /.*/gi;
  var match = regEx.exec(rawId);
  if (match !== null) {
    return match[0];
  }
}

function joinVariable(...variable) {
  var result = "";
  for (let val of variable) {
    result = result + val + ", ";
  }
  return result;
}
