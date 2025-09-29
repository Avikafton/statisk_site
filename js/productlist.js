document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const category = params.get("category");
    const container = document.querySelector(".product_list_container");
  
    const formattedCategory = category
      ? category.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())
      : "Ukendt kategori";
  
    const h1 = document.querySelector("h1");
    h1.textContent = formattedCategory;
  
    fetch(`https://kea-alt-del.dk/t7/api/products?category=${category}&limit=400&offset=0`)
      .then(res => res.json())
      .then(products => {
        container.innerHTML = "";
  
        if (products.length === 0) {
            container.innerHTML = `<h2 class="empty-category">There are no products in the "${formattedCategory}" category yet. </h2>`;
            return;
          }
   
        products.forEach(showProduct);
      });
  
    function showProduct(product) {
      const card = document.createElement("a");
      card.classList.add("product_card");
      card.href = `product.html?id=${product.id}&category=${category}`;
  
      let priceHTML = `${product.price},-`;
      if (product.discount) {
        const newPrice = Math.round(product.price - (product.price * product.discount) / 100);
        priceHTML = `<span class="old_price">${product.price},-</span> <span class="discounted_price">${newPrice},-</span>`;
      }
      if (product.soldout) {
        priceHTML = `<span class="soldout-msg">Sold Out</span>`;
      }
  
      card.innerHTML = `
        <img src="https://kea-alt-del.dk/t7/images/webp/640/${product.id}.webp" alt="${product.productdisplayname}">
        <h2>${product.productdisplayname}</h2>
        <p class="price">${priceHTML}</p>
      `;

      if (product.soldout) {
        card.classList.add("udsolgt");
        card.innerHTML += `<span class="badge soldout">Sold Out</span>`;
      }
      if (product.discount) {
        card.classList.add("nedsat");
        card.innerHTML += `<span class="badge discount">-${product.discount}%</span>`;
      }
  
      container.appendChild(card);
    }
});