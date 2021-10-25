/**
 * Function displayProduct afin d'afficher les details pour chaque produit ajouté au panier
 *  */
function displayProduct(content, details) {
  //<article>
  const sectionItems = document.getElementById("cart__items");
  const article = document.createElement("article");
  article.classList.add("cart__item");
  article.setAttribute("data-id", content.id);
  article.setAttribute("data-color", content.color);
  article.setAttribute("data-price", details.price);
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
  pPrixOfProduct.classList.add("cart__item__content__titlePrice__price");
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

  //====================-Gestion du bouton pour supprimer le produit=======================//
  pDelete.classList.add("deleteItem");
  pDelete.textContent = "Supprimer";
  divDelete.appendChild(pDelete);
  divSettings.appendChild(divDelete);
  pDelete.addEventListener("click", deleteItem);
}

/**
 * Function pour afficher le contenu du panier dans la page panier
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
        calculatePrices();
      })
      .catch(function (err) {
        // Une erreur est survenue
        console.error(err);
      });
  }
  calculatePrices();
}

/**
 * Function changeQuantity pour modifier la quantité
 */
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

  // Sauvegarder dans localstorage le nouveau cart
  storeCart(cart);
  calculatePrices();
}
/**
 * Fonction pour supprimer un produit
 *
 */
function deleteItem(event) {
  const article = event.target.closest("article");
  const id = article.getAttribute("data-id");
  const color = article.getAttribute("data-color");

  // Reprendre cart depuis localstorage
  let cart = getCart();

  // Trouver le produit dans cart et supprimer

  cart = cart.filter((content) => !(content.id === id && content.color === color));
  const sectionItems = document.getElementById("cart__items");
  sectionItems.removeChild(article);

  // Sauvegarder dans localstorage le nouveau cart

  storeCart(cart);
  calculatePrices();
}

/**
 * Function pour calculer le prix par produit, le prix total et la quantité total d'articles
 *
 */
function calculatePrices() {
  let totalQuantity = 0;
  let totalPrice = 0;

  const sectionItems = document.getElementById("cart__items").children;
  for (article of sectionItems) {
    const quantity = Number(article.getElementsByClassName("itemQuantity")[0].value);
    //totalQuantity+= quantity
    totalQuantity = totalQuantity + quantity;
    const priceByProduct = Number(article.getAttribute("data-price"));
    const titlePrice = article.getElementsByClassName("cart__item__content__titlePrice__price")[0];
    titlePrice.textContent = quantity * priceByProduct + " €";
    totalPrice += quantity * priceByProduct;
  }

  document.getElementById("totalQuantity").textContent = totalQuantity;
  document.getElementById("totalPrice").textContent = totalPrice;
}
displayCartContents();
/**
 * 
 * ====================Form pour commander==================================/*

/**
 * Fonction pour valider et nettoyer Prenom
 */
const firstName = document.getElementById("firstName");
function firstNameValidation() {
  const firstNameValue = firstName.value.trim();
  const validFirstName = /^[A-Za-záÁàÀâÂäÄãÃåÅæÆçÇéÉèÈêÊëËíÍìÌîÎïÏñÑóÓòÒôÔöÖõÕøØœŒßúÚùÙûÛüÜ -]+$/;
  const firstNameErr = document.getElementById("firstNameErrorMsg");
  if (firstNameValue == "") {
    firstNameErr.textContent = "Prénom requis";
  } else if (!validFirstName.test(firstNameValue)) {
    firstNameErr.textContent = "Prénom doit être uniquement une chaîne sans espaces blancs";
  } else {
    firstNameErr.textContent = "";
    //firstName.value = firstNameValue;
    return firstNameValue;
  }
  return false;
}
firstName.addEventListener("input", firstNameValidation);

/**
 * Fonction pour valider et nettoyer Nom
 */
const lastName = document.getElementById("lastName");
function lastNameValidation() {
  const lastNameValue = lastName.value.trim();
  const validLastName = /^[A-Za-záÁàÀâÂäÄãÃåÅæÆçÇéÉèÈêÊëËíÍìÌîÎïÏñÑóÓòÒôÔöÖõÕøØœŒßúÚùÙûÛüÜ -]+$/;
  const lastNameErr = document.getElementById("lastNameErrorMsg");
  if (lastNameValue == "") {
    lastNameErr.textContent = "Nom de famille requis";
  } else if (!validLastName.test(lastNameValue)) {
    lastNameErr.textContent = "Nom doit être uniquement une chaîne sans espaces blancs";
  } else {
    lastNameErr.textContent = "";
    return lastNameValue;
  }
  return false;
}
lastName.addEventListener("input", lastNameValidation);

/**
 * Fonction pour valider et nettoyer Addresse
 */
const address = document.getElementById("address");
function addressValidation() {
  const addressValue = address.value.trim();
  const validAddress = /^[A-Za-záÁàÀâÂäÄãÃåÅæÆçÇéÉèÈêÊëËíÍìÌîÎïÏñÑóÓòÒôÔöÖõÕøØœŒßúÚùÙûÛüÜ 0-9-]+$/;
  const addressErr = document.getElementById("addressErrorMsg");
  if (addressValue == "") {
    addressErr.textContent = "Addresse requis";
  } else if (!validAddress.test(addressValue)) {
    addressErr.textContent = "Nom doit être uniquement une chaîne sans espaces blancs";
  } else {
    addressErr.textContent = "";
    return addressValue;
  }
  return false;
}
address.addEventListener("input", addressValidation);

/**
 * Fonction pour valider et nettoyer Ville
 */
const cityName = document.getElementById("city");
function cityNameValidation() {
  const cityNameValue = cityName.value.trim();
  const validCityName = /^[A-Za-záÁàÀâÂäÄãÃåÅæÆçÇéÉèÈêÊëËíÍìÌîÎïÏñÑóÓòÒôÔöÖõÕøØœŒßúÚùÙûÛüÜ -]+$/;
  const cityNameErr = document.getElementById("cityErrorMsg");
  if (cityNameValue == "") {
    cityNameErr.textContent = "Ville requis";
  } else if (!validCityName.test(cityNameValue)) {
    cityNameErr.textContent = "Ville doit être uniquement une chaîne sans espaces blancs";
  } else {
    cityNameErr.textContent = "";
    return cityNameValue;
  }
  return false;
}
cityName.addEventListener("input", cityNameValidation);

/**
 * Fonction pour valider et nettoyer l'addresse mail
 */
const emailAddress = document.getElementById("email");
function emailAddressValidation() {
  const emailAddressValue = emailAddress.value.trim();
  const validEmailAddress = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  const emailAddressErr = document.getElementById("emailErrorMsg");
  if (emailAddressValue == "") {
    emailAddressErr.textContent = "Email Addresse requis";
  } else if (!validEmailAddress.test(emailAddressValue)) {
    emailAddressErr.textContent = "Email Addres doit être au format valide avec le symbole @";
  } else {
    emailAddressErr.textContent = "";
    return emailAddressValue;
  }
  return false;
}
emailAddress.addEventListener("input", emailAddressValidation);

/**
 * Fonction pour valider et envoyer le formulaire
 */
function submitForm(event) {
  event.preventDefault();
  const firstName = firstNameValidation();
  const lastName = lastNameValidation();
  const email = emailAddressValidation();
  const address = addressValidation();
  const city = cityNameValidation();
  if (firstName && lastName && email && address && city) {
    console.log("formulaire ok");
    // Creation du l'objet contact
    const contact = { firstName, lastName, email, address, city };
    createOrder(contact);
  } else {
    console.log("données invalides");
  }
}
document.getElementById("order").onclick = submitForm;

/**
 * Fonction createOrder pour passer la commande
 */
function createOrder(contact) {
  const cart = getCart();
  if (cart === null || cart.length === 0) {
    window.alert("Votre panier est vide");
    cd;
    return;
  }
  fetch("http://localhost:3000/api/products/order", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ contact, products: cart.map((product) => product.id) }),
  })
    .then(function (res) {
      if (res.ok) {
        return res.json();
      }
    })
    .then(function (order) {
      console.log(order);
      window.location.replace("./confirmation.html?orderId=" + order.orderId);
    })
    .catch(function (err) {
      // Une erreur est survenue
      console.error(err);
    });
}
