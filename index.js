const fs = require("fs");
const http = require("http");
const url = require("url");
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);
// read templates
const productTemplate = fs.readFileSync(`${__dirname}/templates/template-product.html`, "utf-8");
const cardTemplate = fs.readFileSync(`${__dirname}/templates/template-card.html`, "utf-8");
const overviewTemplate = fs.readFileSync(`${__dirname}/templates/template-overview.html`, "utf-8");

// replace template variable with data
const replaceTemplate = (temp, product) => {
  let output = temp.replace(/{%PRODUCT_NAME%}/g, product.productName);
  output = output.replace(/{%NUTRIENT%}/g, product.nutrients);
  output = output.replace(/{%FROM%}/g, product.from);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);
  output = output.replace(/{%ID%}/g, product.id);

  if (!product.organic) {
    output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic");
  }

  return output;
};

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  if (pathname === "/" || pathname === "/overview") {
    // overview page
    const cards = dataObj.map(card => replaceTemplate(cardTemplate, card)).join("");
    const overview = overviewTemplate.replace(/{%PRODUCT_CARDS%}/g, cards);
    res.end(overview);
  } else if (pathname === "/product") {
    // product page
    const output = replaceTemplate(productTemplate, dataObj[query.id]);
    res.end(output);
  } else if (pathname === "/api") {
    // api
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(data);
  } else {
    // not found
    res.writeHead(404, {
      "Content-Type": "text/html",
      "alireza-header": "Love Backend",
    });
    res.end("<h2>Not Found!<h2>");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Listening to server...");
});
