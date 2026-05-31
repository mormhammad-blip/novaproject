// ========== PRODUCT PRICES ==========
const productPrices = {
  'Golden Bloom': 30.00,
  'Wild Rose': 15.00,
  'Blue Mist': 20.00,
  'Meadow Herb': 10.00
};

// ========== CART ==========
function updateTotal(cartItems) {
  let total = 0;
  cartItems.forEach(item => {
    total += (productPrices[item.name] || 0) * item.quantity;
  });

  const totalElement = document.querySelector(".cart-page #total");
  if (totalElement) {
    totalElement.textContent = `Total: $${total.toFixed(2)}`;
  }
}

function renderCart() {
  const cartList = document.querySelector(".cart-page #cart-list");
  if (!cartList) return;

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cartList.innerHTML = "";

  if (cart.length === 0) {
    cartList.innerHTML = "<li>Your cart is empty.</li>";
    updateTotal([]);
    return;
  }

  cart.forEach((item, index) => {
    const li = document.createElement("li");
    li.className = "cart-item";

    li.innerHTML = `
      <div class="cart-details">${item.name}</div>
      <div class="cart-controls">
        <button class="decrease">-</button>
        <span class="quantity">${item.quantity}</span>
        <button class="increase">+</button>
        <button class="remove-btn">Remove</button>
      </div>
    `;

    const decreaseBtn = li.querySelector(".decrease");
    const increaseBtn = li.querySelector(".increase");
    const removeBtn = li.querySelector(".remove-btn");
    const quantitySpan = li.querySelector(".quantity");

    decreaseBtn.addEventListener("click", () => {
      if (cart[index].quantity > 1) {
        cart[index].quantity--;
        quantitySpan.textContent = cart[index].quantity;
        localStorage.setItem("cart", JSON.stringify(cart));
        updateTotal(cart);
      }
    });

    increaseBtn.addEventListener("click", () => {
      cart[index].quantity++;
      quantitySpan.textContent = cart[index].quantity;
      localStorage.setItem("cart", JSON.stringify(cart));
      updateTotal(cart);
    });

    removeBtn.addEventListener("click", () => {
      cart.splice(index, 1);
      localStorage.setItem("cart", JSON.stringify(cart));
      renderCart(); 
    });

    cartList.appendChild(li);
  });

  updateTotal(cart);
}

// ========== ADD TO CART ==========
function setupAddToCartButtons() {
  const buttons = document.querySelectorAll(".add-to-cart");

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      const productName = button.getAttribute("data-name");
      let cart = JSON.parse(localStorage.getItem("cart")) || [];

      const existingItem = cart.find(item => item.name === productName);
      if (existingItem) {
        existingItem.quantity++;
      } else {
        cart.push({ name: productName, quantity: 1 });
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      alert(`${productName} added to cart.`);
    });
  });
}

// ========== CHECKOUT WHATSAPP ==========
function setupCheckoutForm() {
  const form = document.getElementById("checkout-form");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const location = document.getElementById("location").value.trim();
    const paymentMethod = document.querySelector("input[name='payment']:checked").value;

    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    let total = 0;
    let productLines = cart.map(item => {
      const price = productPrices[item.name] || 0;
      const subtotal = price * item.quantity;
      total += subtotal;
      return `• ${item.name} x${item.quantity} = $${subtotal.toFixed(2)}`;
    }).join("%0A");

    const message = `
New Order:
Name: ${name}
Phone: ${phone}
Location: ${location}
Payment Method: ${paymentMethod}

Products:
${productLines}

Total: $${total.toFixed(2)}
`.trim();

    const encodedMessage = encodeURIComponent(message);
    const phoneNumber = "96176014993";
    const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    window.open(whatsappLink, "_blank");
  });
}

window.addEventListener("DOMContentLoaded", () => {
  renderCart();
  setupCheckoutForm();
  setupAddToCartButtons();
});
