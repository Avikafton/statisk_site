document.addEventListener("DOMContentLoaded", () => {
  // ===================== PRODUKT VISNING =====================
  const params = new URLSearchParams(window.location.search);
  const category = params.get("category");
  const container = document.querySelector(".product_list_container");
  const h1 = document.querySelector("h1");

  const formattedCategory = category
    ? category.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())
    : "Ukendt kategori";
  h1.textContent = formattedCategory;

  let allData = [];
  let currentData = [];

  fetch(`https://kea-alt-del.dk/t7/api/products?category=${category}&limit=400&offset=0`)
    .then(res => res.json())
    .then(products => {
      allData = products;
      currentData = [...allData];
      if (!products.length) {
        container.innerHTML = `<h2 class="empty-category">There are no products in the "${formattedCategory}" category yet.</h2>`;
        return;
      }
      showProducts(currentData);
    })
    .catch(console.error);

  function showProducts(products) {
    container.innerHTML = "";
    products.forEach(product => {
      const card = document.createElement("a");
      card.classList.add("product_card");
      card.href = `product.html?id=${product.id}&category=${category}`;

      let priceHTML = `${product.price},-`;
      if (product.discount) {
        const newPrice = Math.round(product.price - (product.price * product.discount) / 100);
        priceHTML = `<span class="old_price">${product.price},-</span> <span class="discounted_price">${newPrice},-</span>`;
      }
      if (product.soldout) priceHTML = `<span class="soldout-msg">Sold Out</span>`;

      card.innerHTML = `
        <img src="https://kea-alt-del.dk/t7/images/webp/640/${product.id}.webp" alt="${product.productdisplayname}">
        <h2>${product.productdisplayname}</h2>
        <p class="price">${priceHTML}</p>
      `;

      if (product.soldout) card.classList.add("udsolgt");
      if (product.discount) card.classList.add("nedsat");

      container.appendChild(card);
    });
  }

  // ===================== FILTER & SORT =====================
  const filterButtons = document.querySelectorAll("#filters button");
  let activeFilter = "All";
  filterButtons.forEach(btn => btn.addEventListener("click", () => {
    filterButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    activeFilter = btn.dataset.gender;
    updateDisplay();
  }));

  const sortButtons = document.querySelectorAll("#sorting button");
  let activeSort = null;
  sortButtons.forEach(btn => btn.addEventListener("click", () => {
    sortButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    activeSort = btn.dataset.direction;
    updateDisplay();
  }));

  function updateDisplay() {
    let filtered = activeFilter === "All" ? [...allData] : allData.filter(p => p.gender === activeFilter);
    if (activeSort) filtered.sort((a, b) => activeSort === "lohi" ? a.price - b.price : b.price - a.price);
    currentData = filtered;
    showProducts(currentData);
  }

  // ===================== SELECT CATEGORY TOGGLE (desktop) =====================
  const toggleButton = document.getElementById("toggleButton");
  const categoryDropdown = document.getElementById("categoryDropdown");

  if (toggleButton && categoryDropdown) {
    toggleButton.addEventListener("click", e => {
      e.stopPropagation();
      categoryDropdown.classList.toggle("visible");
    });

    document.addEventListener("click", e => {
      if (!toggleButton.contains(e.target) && !categoryDropdown.contains(e.target)) {
        categoryDropdown.classList.remove("visible");
      }
    });
  }

  // ===================== HAMBURGER MENU (mobil) =====================
  const hamburgerButton = document.getElementById("hamburgerButton");
  const hamburgerDropdown = document.getElementById("hamburgerDropdown");
  const wrapper = document.querySelector(".category-hamburger-wrapper");

  if (hamburgerButton && wrapper && hamburgerDropdown) {
    hamburgerButton.addEventListener("click", e => {
      e.stopPropagation();
      wrapper.classList.toggle("active");
      hamburgerDropdown.classList.toggle("hidden");
    });

    document.addEventListener("click", e => {
      if (!e.target.closest(".category-hamburger-wrapper")) {
        wrapper.classList.remove("active");
        hamburgerDropdown.classList.add("hidden");
      }
    });
  }
});