window.onload = () => {
  drawSkeletonProducts();

  const urlParams = new URLSearchParams(window.location.search);
  const g = urlParams.get('g');

  //make an ajax call here
  var data;
  var httpObj = new XMLHttpRequest();

  // ask the server for a json
  var address = "http://localhost:3000/" + g + "/";
  httpObj.open('GET', address, true);
  httpObj.send();

  // if we receive a response back
  httpObj.onreadystatechange = () => {
    if (httpObj.readyState = 4 && httpObj.status == 200 && httpObj.responseText) {
      data = JSON.parse(httpObj.responseText);
      setTimeout(() => loadProducts(data), 1000); // leave a timeout to look fluent even on faster connection
    }
  }

  const loadProducts = (data) => {
    const g = urlParams.get('g');
    const type = urlParams.get('type');
    const type_item = urlParams.get('type_item');
    var page = urlParams.get('p');

    // get the array of products
    var products_array = data[type][type_item];

    // how many products to show on a page
    const nr_products_on_page = 9;

    // if we get a wrong page number from the url reset to first page
    if (page * nr_products_on_page > products_array.length || page <= 0) {
      page = 1;
    }

    // clear the products skeleton
    document.getElementById("products-container").textContent = "";
    // add the products in page
    for (let i = (page - 1) * nr_products_on_page; i < page * nr_products_on_page; i++) {
      let product_data = products_array[i];

      // create the product
      new_product = document.createElement("div");
      document.getElementById("products-container").appendChild(new_product);
      new_product.setAttribute("class", "product");
      new_product.setAttribute("id", "product-" + i);
      document.getElementById("product-" + i).onclick = () => {
        let new_address = "/product?g=" + g + "&type=" + type + "&type_item=" + type_item + "&id=" + i;
        location.href = new_address;
      }

      // the showcase image for the product i
      product_image = document.createElement("img");
      product_image.setAttribute("src", product_data.location + "1.jpeg");
      product_image.setAttribute("alt", "Image: " + i);
      product_image.setAttribute("id", "product-image-" + i);

      // details about the product
      product_details = document.createElement("div");
      product_details.setAttribute("class", "product-details");
      product_details.setAttribute("id", "product-details-" + i);

      // add the image and details to div product
      document.getElementById("product-" + i).appendChild(product_image);
      document.getElementById("product-" + i).appendChild(product_details);

      // product rating and price
      product_rating_price = document.createElement("div");
      product_rating_price.setAttribute("class", "product-rating-price");
      product_rating_price.setAttribute("id", "product-rating-price-" + i);

      // name of the product
      product_name = document.createElement("div");
      product_name.setAttribute("class", "product-name");
      product_name.innerText = product_data.name;

      // rating of the product
      product_rating = document.createElement("div");
      product_rating.setAttribute("class", "product-rating");
      product_rating.setAttribute("id", "product-rating-" + i);

      // price of the product
      product_price = document.createElement("div");
      product_price.setAttribute("class", "product-price");
      product_price.innerText = product_data.price + " €";

      // append to the product details div
      document.getElementById("product-details-" + i).appendChild(product_name);
      document.getElementById("product-details-" + i).appendChild(product_rating_price);

      // append to the product rating and price div
      document.getElementById("product-rating-price-" + i).appendChild(product_rating);
      document.getElementById("product-rating-price-" + i).appendChild(product_price);

      for (let s = 0; s < 5; s++) {
        star = document.createElement("i");
        star.setAttribute("class", "fa fa-star");
        star.setAttribute("id", "star-" + s);

        if (s < product_data.rating) {
          star.setAttribute("class", "fa fa-star star-filled")
        }
        if (product_data.rating - s > 0 && product_data.rating - s < 1) {
          star.setAttribute("class", "fa fa-star-half")
        }

        document.getElementById("product-rating-" + i).appendChild(star);
      }
    }

    // add links to other pages
    for (let i = 1; i <= Math.ceil(products_array.length / nr_products_on_page); i++) {
      let div_page = document.createElement("div");
      div_page.innerText = i;
      div_page.setAttribute("id", i);
      div_page.setAttribute("class", "page-item");

      document.getElementById("pages-container").appendChild(div_page);

      document.getElementById(i).onclick = () => {
        let new_address = "/list_products?g=" + g + "&type=" + type + "&type_item=" + type_item + "&p=" + i;
        location.href = new_address;
      }
    }
  }

}

const drawSkeletonProducts = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const g = urlParams.get('g');
  const type = urlParams.get('type');
  const type_item = urlParams.get('type_item');
  const nr_products_on_page = 9;
  const page = urlParams.get('p');

  // add the products in page
  for (let i = (page - 1) * nr_products_on_page; i < page * nr_products_on_page; i++) {
    // create the product
    new_product = document.createElement("div");
    document.getElementById("products-container").appendChild(new_product);
    new_product.setAttribute("class", "product");
    new_product.setAttribute("id", "product-" + i);

    // the showcase image for the product i
    product_image = document.createElement("img");
    product_image.setAttribute("class", "product-image skeleton skeleton-img")
    product_image.setAttribute("id", "product-image-" + i)
    product_image.setAttribute("src", "skeleton.png")

    // details about the product
    product_details = document.createElement("div");
    product_details.setAttribute("class", "product-details skeleton-details");
    product_details.setAttribute("id", "product-details-" + i);

    // add the image and details to div product
    document.getElementById("product-" + i).appendChild(product_image);
    document.getElementById("product-" + i).appendChild(product_details);

    // product rating and price
    product_rating_price = document.createElement("div");
    product_rating_price.setAttribute("class", "product-rating-price");
    product_rating_price.setAttribute("id", "product-rating-price-" + i);

    // name of the product
    product_name = document.createElement("div");
    product_name.setAttribute("class", "product-name");
    product_name.setAttribute("id", "product-name-" + i);

    // rating of the product
    product_rating = document.createElement("div");
    product_rating.setAttribute("class", "product-rating skeleton skeleton-text");
    product_rating.setAttribute("id", "product-rating-" + i);

    // price of the product
    product_price = document.createElement("div");
    product_price.setAttribute("class", "product-price skeleton skeleton-text");

    // append to the product details div
    document.getElementById("product-details-" + i).appendChild(product_name);
    // insert 2 rows of text
    for (let r = 0; r < 2; r++) {
      skeleton_text = document.createElement("div");
      skeleton_text.setAttribute("class", "skeleton skeleton-text-name")
      document.getElementById("product-name-" + i).appendChild(skeleton_text)
    }

    document.getElementById("product-details-" + i).appendChild(product_rating_price);
    // append to the product rating and price div
    document.getElementById("product-rating-price-" + i).appendChild(product_rating);
    document.getElementById("product-rating-price-" + i).appendChild(product_price);
  }

  let div_page = document.createElement("div");
  div_page.innerText = 1;
  div_page.setAttribute("id", 1);
  div_page.setAttribute("class", "page-item");

  document.getElementById("pages-container").appendChild(div_page);

  document.getElementById(1).onclick = () => {
    let new_address = "/list_products?g=" + g + "&type=" + type + "&type_item=" + type_item + "&p=1";
    location.href = new_address;
  }
}