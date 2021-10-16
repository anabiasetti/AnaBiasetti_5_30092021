// Function displayProduct afin d'afficher les details pour chaque produit ajouté au panier
function displayProduct(content, details) {
  //<article>
  const sectionItems = document.getElementById("cart__items");
  const article = document.createElement("article");
  article.classList.add("cart__item");
  article.setAttribute("data-id", content.id);
  article.setAttribute("data-color", content.color);
  sectionItems.appendChild(article);
  // Image
  const divImg = document.createElement("div");
  divImg.classList.add("cart__item__img");
  const img = document.createElement("img");
  img.src = details.imageUrl;
  img.alt = details.altTxt;
  divImg.appendChild(img);
  article.appendChild(divImg);
  //h2 nom du produit et prix
  const divContent = document.createElement("div");
  divContent.classList.add("cart__item__content");
  article.appendChild(divContent);
  const divContentTitlePrice = document.createElement("div");
  divContentTitlePrice.classList.add("cart__item__content__titlePrice");
  divContent.appendChild(divContentTitlePrice);
  const h2NameOfProduct = document.createElement("h2");
  h2NameOfProduct.textContent = details.name + " - " + content.color;
  divContentTitlePrice.appendChild(h2NameOfProduct);
  const pPrixOfProduct = document.createElement("p");
  pPrixOfProduct.textContent = details.price + " €";
  divContentTitlePrice.appendChild(pPrixOfProduct);

  //Quantité
  const divSettings = document.createElement("div");
  divSettings.classList.add("cart__item__content__settings");
  const divQuantity = document.createElement("div");
  divQuantity.classList.add("cart__item__content__settings__quantity");
  const pQuantity = document.createElement("p");
  pQuantity.textContent = "Qté :";
  divQuantity.appendChild(pQuantity);
  //input
  const inputQuantity = document.createElement("input");
  inputQuantity.classList.add("itemQuantity");
  inputQuantity.setAttribute("type", "number");
  inputQuantity.setAttribute("value", content.quantity);
  inputQuantity.name = "itemQuantity";
  inputQuantity.min = "1";
  inputQuantity.max = "100";
  inputQuantity.addEventListener("change", changeQuantity);
  divQuantity.appendChild(inputQuantity);
  divSettings.appendChild(divQuantity);
  divContent.appendChild(divSettings);

  //supprimer
  const divDelete = document.createElement("div");
  divDelete.classList.add("cart__item__content__settings__delete");
  const pDelete = document.createElement("p");

  //----------------gestion du buton pour supprimer le produit------------------------//
  pDelete.classList.add("deleteItem");
  pDelete.textContent = "Supprimer";
  divDelete.appendChild(pDelete);
  divSettings.appendChild(divDelete);
  pDelete.addEventListener("click", deleteItem);
}

/**
 * function pour afficher le contenu du panier dans la page panier
 */
function displayCartContents() {
  // Récupérer les données stockées dans le pannier
  const stringifiedValueFromLocalStorage = localStorage.getItem("cart");
  let cart;
  if (stringifiedValueFromLocalStorage) {
    console.log("Panier a du contenu, parser l'array du localstorage");
    cart = JSON.parse(stringifiedValueFromLocalStorage);
  } else {
    console.log("Panier est vide, initialiser à un array vide");
    cart = [];
  }
  //Parcourir l'array
  //const parce que on doit garder le contenu pour que le callback de fetch l'utilise plus tard
  /**
   * for (let i= 0;i<cart.length;i++) {
   * const content = cart[i];
   */
  for (const content of cart) {
    console.log(content);
    fetch("http://localhost:3000/api/products/" + content.id)
      .then(function (res) {
        if (res.ok) {
          return res.json();
        }
      })
      .then(function (details) {
        console.log(details);
        displayProduct(content, details);
      })
      .catch(function (err) {
        // Une erreur est survenue
        console.error(err);
      });
  }
}

//function changeQuantity pour modifier la quantité

function changeQuantity(event) {
  // Recuperer id, color pour celui ou on a cliqué
  const id = event.target.closest("article").getAttribute("data-id");
  const color = event.target.closest("article").getAttribute("data-color");
  console.log(color, id);

  // Reprendre cart depuis localstorage

  const cart = getCart();
  // Trouver le produit dans cart et changer son quantité

  for (const content of cart) {
    if (content.id === id && content.color === color) {
      content.quantity = event.target.value;
    }
  }

  // sauvegarder dans localstorage le nouveau cart
  storeCart(cart);
}

function deleteItem(event) {
  const id = event.target.closest("article").getAttribute("data-id");
  const color = event.target.closest("article").getAttribute("data-color");
  // Reprendre cart depuis localstorage

  let cart = getCart();
  // Trouver le produit dans cart et supprimer

  cart = cart.filter((content) => !(content.id === id && content.color === color));

  // Sauvegarder dans localstorage le nouveau cart
  storeCart(cart);
}

//-------------------form pour commander------------------------------------------//
function submit() {
  const questions = document.getElementsByClassName("cart__order__form__question");
  for (questionElement of questions) {
    const inputValue = questionElement.getElementsByTagName("input")[0].value;
    const errorElement = questionElement.getElementsByTagName("p")[0];
    if (!inputValue) {
      errorElement.textContent = "Error c'est vide !";
    } else {
      errorElement.textContent = "";
    }
  }
}

displayCartContents();
