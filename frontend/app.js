const API_BASE = 'https://nexsoft-ecommerce.onrender.com/api';

async function apiCall(endpoint, method = 'GET', body = null) {
  const headers = {
    'Content-Type': 'application/json'
  };

  const token = getToken();

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const options = {
    method,
    headers
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, options);
    return await response.json();
  } catch (error) {
    return {
      success: false,
      message: 'Unable to connect to server.'
    };
  }
}

function getToken() {
  return localStorage.getItem('nexmartToken');
}

function getUser() {
  const user = localStorage.getItem('nexmartUser');
  return user ? JSON.parse(user) : null;
}

function isLoggedIn() {
  return Boolean(getToken());
}

function isAdmin() {
  const user = getUser();
  return user && user.role === 'admin';
}

function logout() {
  localStorage.removeItem('nexmartToken');
  localStorage.removeItem('nexmartUser');
  showToast('Logged out successfully.', 'success');

  setTimeout(function () {
    window.location.href = 'index.html';
  }, 700);
}

function getGuestCart() {
  const cart = localStorage.getItem('nexmartGuestCart');
  return cart ? JSON.parse(cart) : [];
}

function saveGuestCart(cart) {
  localStorage.setItem('nexmartGuestCart', JSON.stringify(cart));
}

async function mergeGuestCartToBackend() {
  const guestCart = getGuestCart();

  if (!isLoggedIn() || guestCart.length === 0) {
    return;
  }

  for (const item of guestCart) {
    await apiCall('/cart/add', 'POST', {
      productId: item.productId,
      quantity: item.quantity
    });
  }

  localStorage.removeItem('nexmartGuestCart');
}

async function getCartCount() {
  if (!isLoggedIn()) {
    const guestCart = getGuestCart();

    return guestCart.reduce(function (total, item) {
      return total + item.quantity;
    }, 0);
  }

  const response = await apiCall('/cart');

  if (!response.success) {
    return 0;
  }

  return response.cart.items.reduce(function (total, item) {
    return total + item.quantity;
  }, 0);
}

async function updateCartBadge() {
  const count = await getCartCount();
  $('#cartCountBadge').text(count);
}

function updateNavbar() {
  const user = getUser();

  if (!user) {
    $('#authNavArea').html('<a class="btn small-btn" href="auth.html">Login</a>');
    return;
  }

  if (user.role === 'admin') {
    $('#authNavArea').html(`
      <a class="btn small-btn admin-link" href="admin.html">Admin</a>
      <button class="btn logout-btn ms-lg-2" onclick="logout()">Logout</button>
    `);
    return;
  }

  $('#authNavArea').html(`
    <span class="navbar-user">Hi, ${user.name}</span>
    <button class="btn logout-btn ms-lg-2" onclick="logout()">Logout</button>
  `);
}

function showToast(message, type = 'info') {
  const toastId = `toast-${Date.now()}`;

  $('#toastContainer').append(`
    <div id="${toastId}" class="app-toast ${type}">
      ${message}
    </div>
  `);

  setTimeout(function () {
    $(`#${toastId}`).addClass('show');
  }, 50);

  setTimeout(function () {
    $(`#${toastId}`).removeClass('show');

    setTimeout(function () {
      $(`#${toastId}`).remove();
    }, 300);
  }, 3000);
}

function formatPrice(amount) {
  return `PKR ${Number(amount).toLocaleString('en-PK')}`;
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-PK', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

function buildStarRating(rating) {
  const roundedRating = Math.round(rating || 0);
  let stars = '';

  for (let i = 1; i <= 5; i++) {
    stars += i <= roundedRating ? '★' : '☆';
  }

  return `<span class="stars">${stars}</span>`;
}

function buildProductCard(product) {
  const imageColor = product.images && product.images.length > 0 ? product.images[0] : '#00f5ff';
  const originalPrice = product.originalPrice > product.price
    ? `<span class="original-price">${formatPrice(product.originalPrice)}</span>`
    : '';

  return `
    <div class="col-lg-3 col-md-4 col-sm-6">
      <div class="product-card">
        <a href="product-detail.html?id=${product._id}" class="product-image" style="background:${imageColor};"></a>
        <div class="product-body">
          <p class="product-category">${product.category}</p>
          <h3>${product.name}</h3>
          <div class="rating-row">
            ${buildStarRating(product.rating.average)}
            <span>${product.rating.count}</span>
          </div>
          <div class="price-row">
            <strong>${formatPrice(product.price)}</strong>
            ${originalPrice}
          </div>
          <div class="d-flex gap-2">
            <button class="btn primary-btn w-100" onclick="addProductToCart('${product._id}', '${product.name}', ${product.price}, '${imageColor}')">
              Add
            </button>
            <a class="btn icon-btn" href="product-detail.html?id=${product._id}">View</a>
          </div>
        </div>
      </div>
    </div>
  `;
}

async function addProductToCart(productId, name, price, image, quantity = 1) {
  if (isLoggedIn()) {
    const response = await apiCall('/cart/add', 'POST', {
      productId,
      quantity
    });

    if (!response.success) {
      showToast(response.message || 'Failed to add product.', 'error');
      return;
    }

    await updateCartBadge();
    showToast('Product added to cart.', 'success');
    return;
  }

  const cart = getGuestCart();

  const existingItem = cart.find(function (item) {
    return item.productId === productId;
  });

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({
      productId,
      name,
      price,
      image,
      quantity
    });
  }

  saveGuestCart(cart);
  await updateCartBadge();
  showToast('Product added to cart.', 'success');
}

async function addGuestProductToCart(productId, name, price, image) {
  await addProductToCart(productId, name, price, image, 1);
}