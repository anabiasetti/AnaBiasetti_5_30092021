//function afin de recuperer le id du product courant
function getCurrentProductId() {
  let id;
  const str = window.location.href;
  const url = new URL(str);
  const search_params = new URLSearchParams(url.search);
  if (search_params.has("id")) {
    id = search_params.get("id");
    return id;
  }
}

//function afin d'afficher les détails du produit
function displayProductDetails(product) {
  //Title de la page
  document.title = product.name;
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
//function pour ajouter le produit detaillé au panier en utilisant le buton
function addToCart(event) {
  // Récupérer les données stockées dans le pannier
  const cartString = localStorage.getItem("cart");
  let cartObject;
  if (cartString) {
    cartObject = JSON.parse(cartString);
  } else {
    cartObject = [];
  }
  // Creation d'un object qui contienne id, coleur et quantité des produits choissies pour le pannier
  const productToAddToCart = {
    id: getCurrentProductId(),
    color: document.getElementById("colors").value,
    quantity: Number(document.getElementById("quantity").value),
  };
  console.log(productToAddToCart);
  // Vérification de quantité
  if (productToAddToCart.quantity < 1 || productToAddToCart.quantity > 100) {
    alert("Quantité invalide");
    return;
  }
  // Vérification de la couleur
  if (productToAddToCart.color === "") {
    alert("Couleur invalide");
    return;
  }
  //Ajout seulement de la quantité lorsqu'il s'agit du même produit et même coleur
  let found = false;
  for (content of cartObject) {
    if (content.id === productToAddToCart.id && content.color === productToAddToCart.color) {
      content.quantity += productToAddToCart.quantity;
      found = true;
    }
  }
  // Ajout d'un produit different a cause de la couleur ou du produit
  if (!found) {
    cartObject.push(productToAddToCart);
  }

  // Persister le panier
  localStorage.setItem("cart", JSON.stringify(cartObject));
  //Redirection vers le panier
  window.location.replace("./cart.html");
}

const button = document.getElementById("addToCart");
button.addEventListener("click", addToCart);

const id = getCurrentProductId();
console.log(id);
if (!id) {
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
