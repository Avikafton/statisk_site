document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  const productContainer = document.querySelector(".product-container");
  const brandSection = document.querySelector(".brand-description");

  fetch(`https://kea-alt-del.dk/t7/api/products/${id}`)
    .then(res => res.json())
    .then(product => {
      productContainer.innerHTML = `
        <div class="product-image">
          <img src="https://kea-alt-del.dk/t7/images/webp/640/${product.id}.webp" alt="${product.productdisplayname}">
        </div>
        <div class="product-info">
          <h1>${product.productdisplayname}</h1>
          <p><strong>Brand:</strong> ${product.brandname}</p>
          <p><strong>Category:</strong> ${product.category}</p>
          <p><strong>Type:</strong> ${product.articletype}</p>
          <p class="price">
            ${product.soldout ? "Sold Out" : product.discount ? `<span class="old_price">${product.price},-</span> ${Math.round(product.price - product.price * product.discount / 100)},-` : `${product.price},-`}
          </p>
          <button class="add-to-basket">Add to basket</button>
      
${product.category === "Apparel" ? `
<div class="choose-size">
  <button class="size">S</button>
  <button class="size">M</button>
  <button class="size">L</button>
  <button class="size">XL</button>
</div>
` : product.category === "Footwear" ? `
<div class="choose-size">
  <button class="size">36</button>
  <button class="size">37</button>
  <button class="size">38</button>
  <button class="size">39</button>
  <button class="size">40</button>
  <button class="size">41</button>
  <button class="size">42</button>
</div>
` : ''}
          <div class="extra-info">
            <p><strong>Color:</strong> ${product.basecolour}</p>
            <p><strong>Gender:</strong> ${product.gender}</p>
            <p><strong>Inventory:</strong> ${product.id}</p>
          </div>
        </div>
      `;

      brandSection.innerHTML = `
      <h2>About Brand</h2>
      <p>${product.brandname} is a very popular brand. The ${product.productdisplayname} is one of their standout products, loved for its quality and design.</p>
    `;
    });
});