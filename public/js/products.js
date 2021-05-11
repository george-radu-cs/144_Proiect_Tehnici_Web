// const {promiseImpl} = require("ejs");
window.onload = function () {
  const urlParams = new URLSearchParams(window.location.search);
  const g = urlParams.get('g');

  //make an ajax call here
  var data;
  var httpObj = new XMLHttpRequest();

  // ask the server for a json
  var address = "http://localhost:3000/" + g;
  httpObj.open('GET', address, true);
  httpObj.send();

  // if we receive a response back
  httpObj.onreadystatechange = function () {
    if (httpObj.readyState = 4 && httpObj.status == 200) {
      data = JSON.parse(httpObj.responseText);
      // console.log(data); //-> for testing
      loadProducts(data);
    }
  }

  function loadProducts(data) {
    const g = urlParams.get('g');
    const type = urlParams.get('type');
    const type_item = urlParams.get('type_item');
    var page = urlParams.get('p');

    // get the array of products
    var products_array = data[type][type_item];

    // console.log(products_array); //-> for testing

    // how many products to show on a page
    var nr_products_on_page = 9;

    // if we get a wrong page number from the url reset to first page
    if (page * nr_products_on_page > products_array.length || page <= 0) {
      page = 1;
    }

    // add the products in page
    for (let i = (page - 1) * nr_products_on_page; i < page * nr_products_on_page; i++) {
      var product_data = products_array[i];
      // console.log(product_data); //->for testing

      // create the product
      new_product = document.createElement("div");
      document.getElementById("products-container").appendChild(new_product);
      new_product.setAttribute("class", "product");
      new_product.setAttribute("id", "product-" + i);
      document.getElementById("product-" + i).onclick =
        function loadProduct() {
          let new_address = "/product?g=" + g + "&type=" + type + "&type_item=" + type_item + "&id=" + i;
          location.href = new_address;
        }

      // the showcase image for the product i
      product_image = document.createElement("img");
      product_image.setAttribute("src", product_data.location + "1.jpeg");
      product_image.setAttribute("alt", "Image: " + i);

      // details about the product
      product_details = document.createElement("div");
      product_details.setAttribute("class", "product-details");
      product_details.setAttribute("id", "product-details-" + i);

      // add the image and details to div product
      document.getElementById("product-" + i).appendChild(product_image);
      document.getElementById("product-" + i).appendChild(product_details);

      // name of the product
      product_name = document.createElement("div");
      product_name.innerText = product_data.name;

      // price of the product
      product_price = document.createElement("p");
      product_price.innerText = product_data.price + " €";

      document.getElementById("product-details-" + i).appendChild(product_name);
      document.getElementById("product-details-" + i).appendChild(product_price);
    }

    // add links to other pages
    for (let i = 1; i <= Math.ceil(products_array.length / nr_products_on_page); i++) {
      var div_page = document.createElement("div");
      div_page.innerText = i;
      div_page.setAttribute("id", i);
      div_page.setAttribute("class", "page-item");

      document.getElementById("pages-container").appendChild(div_page);

      document.getElementById(i).onclick = function () {
        let new_address = "/list_products?g=" + g + "&type=" + type + "&type_item=" + type_item + "&p=" + i;
        location.href = new_address;
      }
    }
  }

}

