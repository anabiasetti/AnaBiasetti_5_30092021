// Récupérer les données stockées dans le pannier
function getCart() {
  const stringifiedValueFromLocalStorage = localStorage.getItem("cart");
  let cart;
  // Si cart existe dans localstorage (n'est pas null)
  if (stringifiedValueFromLocalStorage) {
    // Convertir le string à objet
    cart = JSON.parse(stringifiedValueFromLocalStorage);
  } else {
    // Initialiser parce que le panier n'existe pas encore
    cart = [];
  }
  return cart;
}

// Persister le panier
function storeCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}
