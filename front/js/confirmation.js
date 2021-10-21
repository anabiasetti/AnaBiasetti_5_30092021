//function afin de recuperer le orderId de la commande courant
function getCurrentOrderId() {
  let orderId;
  const str = window.location.href;
  const url = new URL(str);
  const search_params = new URLSearchParams(url.search);
  if (search_params.has("orderId")) {
    orderId = search_params.get("orderId");
    return orderId;
  } else {
    window.location.replace("./index.html");
  }
}

const numberOrder = document.getElementById("orderId");
numberOrder.textContent = getCurrentOrderId();
