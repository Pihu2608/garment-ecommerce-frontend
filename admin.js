const API_BASE =
  "https://garment-ecommerce-backend-production.up.railway.app";

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
          <td>
            <select onchange="updateStatus('${order._id}', this.value)">
              <option ${order.status==="Pending"?"selected":""}>Pending</option>
              <option ${order.status==="Processing"?"selected":""}>Processing</option>
              <option ${order.status==="Completed"?"selected":""}>Completed</option>
            </select>
          </td>
          <td>${new Date(order.createdAt).toLocaleDateString()}</td>
          <td>
            <button onclick="downloadInvoice('${order._id}')">🧾 Invoice</button>
            <button onclick="shareInvoice('${order._id}', '${order.phone}')">📲 WhatsApp</button>
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
   UPDATE STATUS
   =============================== */
async function updateStatus(orderId, status) {
  await fetch(`${API_BASE}/api/orders/${orderId}/status`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });

  alert("Status updated");
}

/* ===============================
   INVOICE
   =============================== */
function downloadInvoice(orderId) {
  window.open(`${API_BASE}/api/orders/${orderId}/invoice`, "_blank");
}

function shareInvoice(orderId, phone) {
  const url = `${API_BASE}/api/orders/${orderId}/invoice`;
  const msg = `Your invoice: ${url}`;
  window.open(`https://wa.me/91${phone}?text=${encodeURIComponent(msg)}`);
}

function logout() {
  localStorage.removeItem("adminLoggedIn");
  window.location.href = "admin-login.html";
}

loadOrders();
