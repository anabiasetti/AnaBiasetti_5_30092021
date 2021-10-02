function displayProductDetails(product) {
  // Image
  const img = document.createElement("img");
  img.src = product.imageUrl;
  img.alt = product.altTxt;
  const itemImage = document.getElementsByClassName("item__img")[0];
  itemImage.appendChild(img);
  //title h1
  const titleName = document.getElementById("title");
  titleName.textContent = product.name;
  //Prix
  const priceProduct = document.getElementById("price");
  priceProduct.textContent = product.price;
  //Description
  const descriptionProduct = document.getElementById("description");
  descriptionProduct.textContent = product.description;
  //Choix de colors
  const select = document.getElementById("colors");
  for (color of product.colors) {
    const option = document.createElement("option");
    option.value = color;
    option.textContent = color;
    select.appendChild(option);
  }
}

const str = window.location.href;
const url = new URL(str);
const search_params = new URLSearchParams(url.search);

let id;
if (search_params.has("id")) {
  id = search_params.get("id");
  console.log(id);
} else {
  // Redirection au cas ou le moteur de recherche envoie directement sur ce page sans id
  window.location.replace("./index.html");
}

fetch("http://localhost:3000/api/products/" + id)
  .then(function (res) {
    if (res.ok) {
      return res.json();
    }
  })
  .then(function (product) {
    console.log(product);
    displayProductDetails(product);
  })
  .catch(function (err) {
    // Une erreur est survenue
    console.error(err);
  });
