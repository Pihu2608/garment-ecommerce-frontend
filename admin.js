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
        `<tr><td colspan="5">No orders found</td></tr>`;
      return;
    }

    orders.forEach(order => {
      ordersBody.innerHTML += `
        <tr>
          <td>${order._id}</td>
          <td>${order.companyName || "Customer"}</td>
          <td>₹${order.total}</td>
          <td>${order.status}</td>
          <td>${new Date(order.createdAt).toLocaleDateString()}</td>
        </tr>
      `;
    });

  } catch (err) {
    ordersBody.innerHTML =
      `<tr><td colspan="5">Error loading orders</td></tr>`;
  }
}

function logout(){
  localStorage.removeItem("adminLoggedIn");
  window.location.href = "admin-login.html";
}

loadOrders();
