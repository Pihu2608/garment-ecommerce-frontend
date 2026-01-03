const API_BASE =
  "https://garment-ecommerce-backend-production.up.railway.app";

const ordersBody = document.getElementById("orders-body");

async function loadOrders() {
  try {
    const token = localStorage.getItem("adminToken");

    const res = await fetch(`${API_BASE}/api/orders`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

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
            <button onclick="resendInvoice('${order._id}')">🔁 Resend</button>
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
   CUSTOMER / PUBLIC INVOICE
   =============================== */
function downloadInvoice(orderId) {
  window.open(`${API_BASE}/api/orders/${orderId}/invoice`, "_blank");
}

/* ===============================
   ADMIN RESEND INVOICE
   =============================== */
function resendInvoice(orderId) {
  const token = localStorage.getItem("adminToken");
  if (!token) return alert("Admin not logged in");

  window.open(`${API_BASE}/api/admin/orders/${orderId}/invoice`, "_blank");
}

/* ===============================
   WHATSAPP SHARE
   =============================== */
function shareWhatsApp(orderId, phone) {
  const mobile = phone.startsWith("91") ? phone : `91${phone}`;

  const invoiceUrl = `${API_BASE}/api/orders/${orderId}/invoice`;

  const message = `Hello 👋
Your GST invoice is ready.

🧾 Invoice Link:
${invoiceUrl}

Thank you for shopping with CorporateMart.`;

  window.open(
    `https://wa.me/${mobile}?text=${encodeURIComponent(message)}`,
    "_blank"
  );
}

/* ===============================
   LOGOUT
   =============================== */
function logout() {
  localStorage.removeItem("adminToken");
  window.location.href = "admin-login.html";
}

loadOrders();
