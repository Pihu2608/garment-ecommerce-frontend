/* ===============================
   CONFIG
   =============================== */
const API_BASE =
  "https://garment-ecommerce-backend-production.up.railway.app";

/* ===============================
   AUTH CHECK (VERY IMPORTANT)
   =============================== */
if (localStorage.getItem("adminLoggedIn") !== "true") {
  window.location.replace("admin-login.html");
}

/* ===============================
   LOAD ORDERS
   =============================== */
const ordersBody = document.getElementById("orders-body");

async function loadOrders() {
  try {
    const res = await fetch(`${API_BASE}/api/orders`);
    const orders = await res.json();

    ordersBody.innerHTML = "";

    if (!orders.length) {
      ordersBody.innerHTML =
        `<tr><td colspan="6">No orders found</td></tr>`;
      return;
    }

    orders.forEach((order) => {
      ordersBody.innerHTML += `
        <tr>
          <td>${order._id}</td>
          <td>${order.companyName || "Customer"}</td>
          <td>₹${order.total}</td>
          <td>${order.status}</td>
          <td>${new Date(order.createdAt).toLocaleDateString()}</td>
          <td>
            <button onclick="downloadInvoice('${order._id}')">🧾 Invoice</button>
            <button onclick="shareWhatsApp('${order._id}', '${order.phone}')">📲 WhatsApp</button>
          </td>
        </tr>
      `;
    });
  } catch (err) {
    console.error(err);
    ordersBody.innerHTML =
      `<tr><td colspan="6">Error loading orders</td></tr>`;
  }
}

/* ===============================
   DOWNLOAD INVOICE
   =============================== */
function downloadInvoice(orderId) {
  window.open(
    `${API_BASE}/api/orders/${orderId}/invoice`,
    "_blank"
  );
}

/* ===============================
   WHATSAPP SHARE
   =============================== */
function shareWhatsApp(orderId, phone) {
  if (!phone) return alert("Customer phone not available");

  const mobile = phone.startsWith("91") ? phone : `91${phone}`;
  const invoiceUrl =
    `${API_BASE}/api/orders/${orderId}/invoice`;

  const message = `Hello 👋
Your GST invoice is ready.

🧾 Invoice Link:
${invoiceUrl}

Thank you for shopping with Classycrafth.`;

  window.open(
    `https://wa.me/${mobile}?text=${encodeURIComponent(message)}`,
    "_blank"
  );
}

/* ===============================
   LOGOUT
   =============================== */
function logout() {
  localStorage.removeItem("adminLoggedIn");
  window.location.replace("admin-login.html");
}

/* ===============================
   INIT
   =============================== */
loadOrders();
