document.addEventListener("DOMContentLoaded", () => {
    console.log("Index.js loaded – kategorierne er statiske i HTML");
  });

  document.addEventListener("DOMContentLoaded", () => {
    const burger = document.getElementById("hamburgerButton");
    const dropdown = document.getElementById("hamburgerDropdown");

    burger.addEventListener("click", () => {
        dropdown.classList.toggle("hidden");
    });
});