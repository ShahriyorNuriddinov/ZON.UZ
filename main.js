let lastScrollTop = 0;
const firstHeader = document.querySelector(".first-header");
const secondHeader = document.querySelector(".second-header");

if (firstHeader && secondHeader) {
  const headerHeight = firstHeader.offsetHeight;

  window.addEventListener("scroll", function () {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > lastScrollTop && scrollTop > headerHeight) {
      firstHeader.classList.add("hidden");
      secondHeader.classList.add("fixed");
    } else {
      if (scrollTop <= headerHeight) {
        firstHeader.classList.remove("hidden");
        secondHeader.classList.remove("fixed");
      }
    }
    lastScrollTop = scrollTop;
  });
}
function updateLikeCount() {
  const likeCount = document.getElementById("like-count");
  if (likeCount) {
    const likedItems = JSON.parse(localStorage.getItem("likes")) || [];
    likeCount.textContent = likedItems.length;
  }
}
if (
  document.getElementById("product-container") ||
  document.getElementById("products")
) {
  const API_URL1 = "https://6905b069ee3d0d14c13361c0.mockapi.io/productsss";
  const API_URL2 = "https://6905b069ee3d0d14c13361c0.mockapi.io/product";

  const productContainer = document.getElementById("product-container");
  const productsContainer = document.getElementById("products");
  const cartCount = document.getElementById("cart-count");

  let cartItems = JSON.parse(localStorage.getItem("cart")) || [];
  let likedItems = JSON.parse(localStorage.getItem("likes")) || [];

  function updateCartCount() {
    if (cartCount) {
      cartCount.textContent = cartItems.length;
    }
  }

  function createProductCard(product) {
    const div = document.createElement("div");
    const isLiked = likedItems.some((item) => item.id === product.id);
    const inCart = cartItems.some((item) => item.id === product.id);

    div.innerHTML = `
      <div class="flex flex-col justify-between py-5 h-[460px] items-center rounded-lg relative bg-white ">
        <button class="like-btn absolute top-3 right-3 p-2 ${
          isLiked ? "text-red-500" : "text-gray-400"
        }">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="${
            isLiked ? "currentColor" : "none"
          }" stroke="currentColor">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </button>

        <div>
          <img class="w-[200px] h-[200px] object-contain" src="${
            product.img
          }" alt="" />
        </div>

        <div class="px-4">
          <h2 class="font-normal text-base text-black text-center">${
            product.title
          }</h2>
        </div>

        <div class="flex items-center justify-between w-[220px]">
          <p class="font-bold text-base text-[#212427]">${product.price} сум</p>
          <button class="cart-btn p-2 border-2 rounded-full ${
            inCart
              ? "bg-blue-600 border-blue-600"
              : "border-gray-300 hover:bg-gray-100"
          }">
            <img src="./img/cart.svg" alt="Cart" width="20" height="20" />
          </button>
        </div>
      </div>
    `;

    const likeBtn = div.querySelector(".like-btn");
    likeBtn.addEventListener("click", () => toggleLike(product, likeBtn));

    const cartBtn = div.querySelector(".cart-btn");
    cartBtn.addEventListener("click", () => toggleCart(product, cartBtn));

    return div;
  }

  function toggleLike(product, likeBtn) {
    const existingIndex = likedItems.findIndex(
      (item) => item.id === product.id
    );

    if (existingIndex > -1) {
      likedItems.splice(existingIndex, 1);
      likeBtn.classList.remove("text-red-500");
      likeBtn.classList.add("text-gray-400");
      likeBtn.querySelector("svg").setAttribute("fill", "none");
    } else {
      likedItems.push({
        id: product.id,
        title: product.title,
        price: product.price,
        img: product.img,
      });
      likeBtn.classList.remove("text-gray-400");
      likeBtn.classList.add("text-red-500");
      likeBtn.querySelector("svg").setAttribute("fill", "currentColor");
    }

    localStorage.setItem("likes", JSON.stringify(likedItems));
    updateLikeCount();
  }

  function toggleCart(product, button) {
    const itemIndex = cartItems.findIndex((item) => item.id === product.id);

    if (itemIndex > -1) {
      cartItems.splice(itemIndex, 1);
      button.classList.remove("bg-blue-600", "border-blue-600");
      button.classList.add("border-gray-300", "hover:bg-gray-100");
    } else {
      cartItems.push({
        id: product.id,
        title: product.title,
        price: product.price,
        img: product.img,
        quantity: 1,
      });
      button.classList.remove("border-gray-300", "hover:bg-gray-100");
      button.classList.add("bg-blue-600", "border-blue-600");
    }

    localStorage.setItem("cart", JSON.stringify(cartItems));
    updateCartCount();
  }

  async function getProducts(url, container) {
    try {
      const response = await fetch(url);
      const products = await response.json();

      products.forEach((product) => {
        const card = createProductCard(product);
        container.appendChild(card);
      });
    } catch (error) {
      console.log("Xatolik:", error);
    }
  }

  updateCartCount();
  updateLikeCount();
  if (productContainer) getProducts(API_URL1, productContainer);
  if (productsContainer) getProducts(API_URL2, productsContainer);
}

if (document.querySelector(".cart-container")) {
  function displayCartItems() {
    const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
    const cartContainer = document.querySelector(".cart-container");

    if (cartItems.length === 0) {
      cartContainer.innerHTML = `
        <div class="w-full">
          <h1 class="font-bold text-2xl text-[#000] mb-4">Корзина</h1>
          <p class="font-bold text-xl text-[#000] mb-6">Ваша корзина пусто</p>
        </div>
        <div class="w-full">
          <a href="./index.html">
            <button class="bg-[#6682a9] text-white p-3 rounded-sm hover:bg-[#5a7699] transition" type="button">
              На главную
            </button>
          </a>
        </div>
      `;
      return;
    }

    let totalPrice = 0;
    let itemsHTML = "";

    cartItems.forEach((item, index) => {
      const itemPrice = parseFloat(item.price) || 0;
      const quantity = item.quantity || 1;
      totalPrice += itemPrice * quantity;

      itemsHTML += `
        <div class="flex items-center justify-between p-4 border-b border-gray-200" data-id="${item.id}">
          <div class="flex items-center gap-4">
            <img src="${item.img}" alt="${item.title}" class="w-16 h-16 object-contain">
            <div>
              <h3 class="font-bold text-lg">${item.title}</h3>
              <p class="text-gray-600">${item.price} сум</p>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <div class="flex items-center gap-2">
              <button class="quantity-btn bg-gray-200 w-8 h-8 rounded" data-index="${index}" data-action="decrease">-</button>
              <span class="quantity">${quantity}</span>
              <button class="quantity-btn bg-gray-200 w-8 h-8 rounded" data-index="${index}" data-action="increase">+</button>
            </div>
            <button class="remove-btn bg-red-500 text-white p-2 rounded hover:bg-red-600" data-id="${item.id}">
              Удалить
            </button>
          </div>
        </div>
      `;
    });

    cartContainer.innerHTML = `
      <div class="w-full">
        <h1 class="font-bold text-2xl text-[#000] mb-6">Корзина</h1>
        ${itemsHTML}
        <div class="flex justify-between items-center p-4 border-t border-gray-200 mt-4">
          <p class="font-bold text-xl">Общая сумма: ${totalPrice} сум</p>
          <button class="bg-green-500 text-white p-3 rounded-sm hover:bg-green-600 transition">
            Оформить заказ
          </button>
        </div>
      </div>
      <div class="w-full">
        <a href="./index.html">
          <button class="bg-[#6682a9] text-white p-3 rounded-sm hover:bg-[#5a7699] transition" type="button">
            На главную
          </button>
        </a>
      </div>
    `;

    document.querySelectorAll(".quantity-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const index = parseInt(e.target.dataset.index);
        const action = e.target.dataset.action;
        updateQuantity(index, action);
      });
    });

    document.querySelectorAll(".remove-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = e.target.dataset.id;
        removeFromCart(id);
      });
    });
  }

  function updateQuantity(index, action) {
    let cartItems = JSON.parse(localStorage.getItem("cart")) || [];

    if (action === "increase") {
      cartItems[index].quantity = (cartItems[index].quantity || 1) + 1;
    } else if (action === "decrease") {
      if (cartItems[index].quantity > 1) {
        cartItems[index].quantity -= 1;
      } else {
        cartItems.splice(index, 1);
      }
    }

    localStorage.setItem("cart", JSON.stringify(cartItems));
    displayCartItems();
  }

  function removeFromCart(id) {
    let cartItems = JSON.parse(localStorage.getItem("cart")) || [];
    cartItems = cartItems.filter((item) => item.id !== id);
    localStorage.setItem("cart", JSON.stringify(cartItems));
    displayCartItems();
  }

  document.addEventListener("DOMContentLoaded", displayCartItems);
}

if (document.querySelector(".like-container")) {
  function displayLikeItems() {
    const likedItems = JSON.parse(localStorage.getItem("likes")) || [];
    const likeContainer = document.querySelector(".like-container");

    if (likedItems.length === 0) {
      likeContainer.innerHTML = `
        <div class="w-full">
          <h1 class="font-bold text-2xl text-[#000] mb-4">Избранное</h1>
          <p class="font-bold text-xl text-[#000] mb-6">Нет выбранных продуктов</p>
        </div>
        <div class="w-full">
          <a href="./index.html">
            <button class="bg-[#6682a9] text-white p-3 rounded-sm hover:bg-[#5a7699] transition" type="button">
              На главную
            </button>
          </a>
        </div>
      `;
      return;
    }

    let itemsHTML = "";

    likedItems.forEach((item) => {
      itemsHTML += `
        <div class="flex items-center justify-between p-4 border-b border-gray-200" data-id="${item.id}">
          <div class="flex items-center gap-4">
            <img src="${item.img}" alt="${item.title}" class="w-16 h-16 object-contain">
            <div>
              <h3 class="font-bold text-lg">${item.title}</h3>
              <p class="text-gray-600">${item.price} сум</p>
            </div>
          </div>
          <button class="remove-like-btn bg-red-500 text-white p-2 rounded hover:bg-red-600" data-id="${item.id}">
            Удалить
          </button>
        </div>
      `;
    });

    likeContainer.innerHTML = `
      <div class="w-full">
        <h1 class="font-bold text-2xl text-[#000] mb-6">Избранное</h1>
        ${itemsHTML}
      </div>
      <div class="w-full">
        <a href="./index.html">
          <button class="bg-[#6682a9] text-white p-3 rounded-sm hover:bg-[#5a7699] transition" type="button">
            На главную
          </button>
        </a>
      </div>
    `;

    document.querySelectorAll(".remove-like-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = e.target.dataset.id;
        removeFromLikes(id);
      });
    });
  }

  function removeFromLikes(id) {
    let likedItems = JSON.parse(localStorage.getItem("likes")) || [];
    likedItems = likedItems.filter((item) => item.id !== id);
    localStorage.setItem("likes", JSON.stringify(likedItems));
    displayLikeItems();
    updateLikeCount();
  }

  document.addEventListener("DOMContentLoaded", displayLikeItems);
}

const swiper = new Swiper(".mySwiper", {
  slidesPerView: 1,
  spaceBetween: 30,
  loop: true,
  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
  },
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});

document.addEventListener("DOMContentLoaded", updateLikeCount);
