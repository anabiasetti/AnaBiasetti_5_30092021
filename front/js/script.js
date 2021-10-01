function displayProductCard(product, items) {
  console.log(product);
  // <a href="./product.html?id=42">
  const a = document.createElement("a");
  a.href = "./product.html?id=" + product._id;
  items.appendChild(a);
  //<article>
  const article = document.createElement("article");
  a.appendChild(article);
  // Image
  const img = document.createElement("img");
  img.src = product.imageUrl;
  img.alt = product.altTxt;
  article.appendChild(img);
  //h3 class="productName">Kanap name1
  const h3 = document.createElement("h3");
  h3.textContent = product.name;
  h3.classList.add("productName");
  article.appendChild(h3);
  // Description: <p class="productDescription">
  const p = document.createElement("p");
  p.classList.add("productdescription");
  p.textContent = product.description;
  article.appendChild(p);
}
fetch("http://localhost:3000/api/products")
  .then(function (res) {
    if (res.ok) {
      return res.json();
    }
  })
  .then(function (products) {
    console.log(products);
    const items = document.getElementById("items");
    for (product of products) {
      displayProductCard(product, items);
    }
  })
  .catch(function (err) {
    // Une erreur est survenue
    console.error(err);
    const main = document.getElementByClassName("main");
    main.textContent = "Erreur pendant le chargement! " + err;
  });
