window.addEventListener("load", init());

function init() {
  console.log("on init joma");
  setTimeout(function(){
    var table = buildTable();
    $(table).insertBefore("div.order-date");
  }, 5000);
}

function buildTable() {
  var result = "";
  var comma = ",";

  console.log("buildTable");
  $(".ordered-items > tbody").first().children().each(function (index) {
    console.log("buildTable build row");
    var dateRaw = $("div.myaccount-content").find(".order-date").text();
    var nameRaw = $(this).find("td").eq(1).find("a").text();
    var brandRaw = $(this).find("td").eq(1).find("a").text();
    var quantityRaw = $(this).find("td").eq(4).find("li").eq(0).text();
    var priceRaw = $(this).find("td").eq(3).text();
    var idRaw = $(".my-account__page-title").text();

    var orderDate = parseDate(dateRaw);
    var name = parseName(nameRaw);
    var brand = parseBrand(brandRaw);
    var quantity = parseQuantity(quantityRaw);
    var price = parsePrice(priceRaw);
    var orderId = parseId(idRaw);
    var merchant = "joma";

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
  dateRaw = dateRaw.substr(0, 10);
  var array = dateRaw.split("/");
  var month = array[0];
  var day = array[1];
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
    return match[0];
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
  return rawId.replace("Order","").replace("Shipped","").replace("#","").trim();
}

function joinVariable(...variable) {
  var result = "";
  for (let val of variable) {
    result = result + val + ", ";
  }
  return result;
}
