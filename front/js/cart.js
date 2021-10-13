// function displayProduct afin d'afficher les details pour chaque produit ajouté au panier
function displayProduct(content, details) {
  //<article>
  const sectionItems = document.getElementById("cart__items");
  const article = document.createElement("article");
  article.classList.add("cart__item");
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
  divQuantity.appendChild(inputQuantity);
  divSettings.appendChild(divQuantity);
  divContent.appendChild(divSettings);

  //supprimer
  const divDelete = document.createElement("div");
  divDelete.classList.add("cart__item__content__settings__delete");
  const pDelete = document.createElement("p");
  pDelete.classList.add("deleteItem");
  pDelete.textContent = "Supprimer";
  pDelete.classList.add("deleteItem");
  divDelete.appendChild(pDelete);
  divSettings.appendChild(divDelete);
}

//function pour afficher le contenu du panier dans la page panier
function displayCartContents() {
  // Récupérer les données stockées dans le pannier
  const stringifiedValueFromLocalStorage = localStorage.getItem("cart");
  let cart;
  if (stringifiedValueFromLocalStorage) {
    cart = JSON.parse(stringifiedValueFromLocalStorage);
  } else {
    cart = [];
  }
  //parcourir l'array
  //const parce que on dois garder le contenu pour que le callback de fetch l'utilise plus tard
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

//----------------gestion du buton pour supprimer le produit------------------------//
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
