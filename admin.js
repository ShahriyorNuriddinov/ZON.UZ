let editingProduct = null;

document.addEventListener("DOMContentLoaded", function () {
  loadProducts();

  document
    .getElementById("product-form")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      if (editingProduct) {
        updateProduct();
      } else {
        addProduct();
      }
    });
});

async function loadProducts() {
  const productsList = document.getElementById("products-list");

  try {
    const response1 = await fetch(
      "https://6905b069ee3d0d14c13361c0.mockapi.io/productsss"
    );
    const products1 = await response1.json();

    const response2 = await fetch(
      "https://6905b069ee3d0d14c13361c0.mockapi.io/product"
    );
    const products2 = await response2.json();

    const allProducts = [
      ...products1.map((p) => ({
        ...p,
        api: "https://6905b069ee3d0d14c13361c0.mockapi.io/productsss",
      })),
      ...products2.map((p) => ({
        ...p,
        api: "https://6905b069ee3d0d14c13361c0.mockapi.io/product",
      })),
    ];
    showProducts(allProducts);
  } catch (error) {
    productsList.innerHTML = `
                    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        <strong>Ошибка:</strong> ${error.message}
                    </div>
                `;
  }
}
function showProducts(products) {
  const productsList = document.getElementById("products-list");

  if (products.length === 0) {
    productsList.innerHTML =
      '<div class="text-center p-8 text-gray-500">Товары не найдены</div>';
    return;
  }
  productsList.innerHTML = products
    .map(
      (product) => `
                <div class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-4">
                            <img src="${product.img}" alt="${product.title}" 
                                 class="w-16 h-16 object-contain border rounded">
                            <div>
                                <h3 class="font-semibold text-gray-800">${product.title}</h3>
                                <p class="text-green-600 font-medium">${product.price}</p>
                            
                            </div>
                        </div>
                        <div class="flex space-x-2">
                            <button onclick="startEdit('${product.id}', '${product.api}')" 
                                    class="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button onclick="deleteProduct('${product.id}', '${product.api}')" 
                                    class="bg-red-500 text-white p-2 rounded hover:bg-red-600">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `
    )
    .join("");
}

async function addProduct() {
  const title = document.getElementById("product-title").value;
  const price = document.getElementById("product-price").value;
  const image = document.getElementById("product-image").value;
  const api = document.getElementById("product-api").value;

  if (!title || !price || !image) {
    alert("Пожалуйста, заполните все поля!");
    return;
  }

  try {
    const response = await fetch(api, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title,
        price: price + "",
        img: image,
      }),
    });

    if (response.ok) {
      alert("Товар успешно добавлен!");
      resetForm();
      loadProducts();
    } else {
      throw new Error("Ошибка при добавлении товара");
    }
  } catch (error) {
    alert("Ошибка: " + error.message);
  }
}

async function startEdit(productId, apiUrl) {
  try {
    const response = await fetch(`${apiUrl}/${productId}`);
    const product = await response.json();

    let priceValue = product.price;

    document.getElementById("product-title").value = product.title;
    document.getElementById("product-price").value = priceValue;
    document.getElementById("product-image").value = product.img;
    document.getElementById("product-api").value = apiUrl;

    document.getElementById("form-title").innerHTML =
      '<i class="fas fa-edit mr-2 text-yellow-500"></i>Редактировать Товар';
    document.getElementById("submit-btn").innerHTML =
      '<i class="fas fa-save mr-2"></i>Сохранить';
    document.getElementById("submit-btn").className =
      "bg-yellow-500 text-white px-6 py-3 rounded hover:bg-yellow-600";
    document.getElementById("cancel-btn").classList.remove("hidden");

    editingProduct = {
      id: productId,
      api: apiUrl,
    };
  } catch (error) {
    alert("Ошибка: " + error.message);
  }
}

async function updateProduct() {
  const title = document.getElementById("product-title").value;
  const price = document.getElementById("product-price").value;
  const image = document.getElementById("product-image").value;

  if (!title || !price || !image) {
    alert("Пожалуйста, заполните все поля!");
    return;
  }

  try {
    const response = await fetch(`${editingProduct.api}/${editingProduct.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title,
        price: price + "",
        img: image,
      }),
    });

    if (response.ok) {
      alert("Товар успешно обновлен!");
      resetForm();
      loadProducts();
    } else {
      throw new Error("Ошибка при обновлении товара");
    }
  } catch (error) {
    alert("Ошибка: " + error.message);
  }
}

async function deleteProduct(productId, apiUrl) {
  if (!confirm("Вы действительно хотите удалить этот товар?")) {
    return;
  }

  try {
    const response = await fetch(`${apiUrl}/${productId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      alert("Товар успешно удален!");
      loadProducts();
    } else {
      throw new Error("Ошибка при удалении товара");
    }
  } catch (error) {
    alert("Ошибка: " + error.message);
  }
}

function resetForm() {
  document.getElementById("product-form").reset();
  document.getElementById("form-title").innerHTML =
    '<i class="fas fa-plus mr-2 text-green-500"></i>Добавить Новый Товар';
  document.getElementById("submit-btn").innerHTML =
    '<i class="fas fa-plus mr-2"></i>Добавить';
  document.getElementById("submit-btn").className =
    "bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700";
  document.getElementById("cancel-btn").classList.add("hidden");

  editingProduct = null;
}
