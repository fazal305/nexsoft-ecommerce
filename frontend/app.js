const API_BASE = 'https://nexsoft-ecommerce.onrender.com/api';

let sessionExpiredHandled = false;

async function apiCall(endpoint, method = 'GET', body = null) {
  const headers = {
    'Content-Type': 'application/json'
  };

  const token = getToken();

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const options = { method, headers };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, options);
    const data = await response.json();

    if (response.status === 401 && token) {
      data.message = 'Your session has expired — please log in again.';
      handleSessionExpired();
    }

    return data;
  } catch {
    return {
      success: false,
      message: 'Unable to connect to server.'
    };
  }
}

function handleSessionExpired() {
  if (sessionExpiredHandled) {
    return;
  }

  sessionExpiredHandled = true;

  localStorage.removeItem('nexmartToken');
  localStorage.removeItem('nexmartUser');
  showToast('Your session has expired — please log in again.', 'error');

  setTimeout(function () {
    window.location.href = 'auth.html';
  }, 800);
}

function escapeHtml(value) {
  return String(value || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function getToken() {
  return localStorage.getItem('nexmartToken');
}

function getUser() {
  try {
    const user = localStorage.getItem('nexmartUser');
    return user ? JSON.parse(user) : null;
  } catch {
    localStorage.removeItem('nexmartUser');
    return null;
  }
}

function isLoggedIn() {
  return Boolean(getToken());
}

function isAdmin() {
  const user = getUser();
  return Boolean(user && user.role === 'admin');
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
  try {
    const cart = localStorage.getItem('nexmartGuestCart');
    return cart ? JSON.parse(cart) : [];
  } catch {
    localStorage.removeItem('nexmartGuestCart');
    return [];
  }
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
      return total + Number(item.quantity || 0);
    }, 0);
  }

  const response = await apiCall('/cart');

  if (!response.success || !response.cart) {
    return 0;
  }

  return response.cart.items.reduce(function (total, item) {
    return total + Number(item.quantity || 0);
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
      <button class="btn logout-btn ms-lg-2" type="button" onclick="logout()">Logout</button>
    `);
    return;
  }

  $('#authNavArea').html(`
    <span class="navbar-user">Hi, ${escapeHtml(user.name)}</span>
    <button class="btn logout-btn ms-lg-2" type="button" onclick="logout()">Logout</button>
  `);
}

function showToast(message, type = 'info') {
  const toastId = `toast-${Date.now()}`;
  const safeType = ['info', 'success', 'error'].includes(type) ? type : 'info';

  $('#toastContainer').append(`
    <div id="${toastId}" class="app-toast ${safeType}">
      ${escapeHtml(message)}
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
  return `PKR ${Number(amount || 0).toLocaleString('en-PK')}`;
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

  return `<span class="stars" aria-label="Rating ${roundedRating} out of 5">${stars}</span>`;
}

function buildProductCard(product) {
  const imageColor = product.images && product.images.length > 0 ? product.images[0] : '#00f5ff';
  const safeId = escapeHtml(product._id);
  const safeName = escapeHtml(product.name);
  const safeCategory = escapeHtml(product.category);
  const safeImageColor = escapeHtml(imageColor);
  const price = Number(product.price || 0);
  const originalPrice = Number(product.originalPrice || 0);
  const ratingAverage = product.rating ? product.rating.average : 0;
  const ratingCount = product.rating ? product.rating.count : 0;

  const originalPriceHtml = originalPrice > price
    ? `<span class="original-price">${formatPrice(originalPrice)}</span>`
    : '';

  return `
    <div class="col-lg-3 col-md-4 col-sm-6">
      <div class="product-card">
        <a href="product-detail.html?id=${safeId}" class="product-image" style="background:${safeImageColor};" aria-label="View ${safeName}"></a>
        <div class="product-body">
          <p class="product-category">${safeCategory}</p>
          <h3>${safeName}</h3>
          <div class="rating-row">
            ${buildStarRating(ratingAverage)}
            <span>${Number(ratingCount || 0)}</span>
          </div>
          <div class="price-row">
            <strong>${formatPrice(price)}</strong>
            ${originalPriceHtml}
          </div>
          <div class="d-flex gap-2">
            <button class="btn primary-btn w-100 add-to-cart-btn" type="button" data-product-id="${safeId}">
              Add
            </button>
            <a class="btn icon-btn" href="product-detail.html?id=${safeId}">View</a>
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

$(document).on('click', '.add-to-cart-btn', async function () {
  const productId = $(this).data('product-id');
  const response = await apiCall(`/products/${productId}`);

  if (!response.success || !response.product) {
    showToast('Could not load product details.', 'error');
    return;
  }

  const product = response.product;
  const image = product.images && product.images.length > 0 ? product.images[0] : '#00f5ff';

  await addProductToCart(product._id, product.name, Number(product.price), image, 1);
});