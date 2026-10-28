const API_BASE_URL = 'http://localhost:5000/api';

async function adminRequest(endpoint, options = {}) {
const response = await fetch(`${API_BASE_URL}${endpoint}`, {
...options,
credentials: 'include',
headers: {
'Content-Type': 'application/json',
...options.headers,
},
});

const data = await response.json().catch(() => ({
status: 'error',
message: 'The server returned an invalid response.',
}));

if (!response.ok) {
const error = new Error(
data.message || 'The request could not be completed.'
);


error.status = response.status;
throw error;


}

return data;
}

export const adminApi = {
login(email, password) {
return adminRequest('/admin/login', {
method: 'POST',
body: JSON.stringify({ email, password }),
});
},

getCurrentAdmin() {
return adminRequest('/admin/me');
},

logout() {
return adminRequest('/admin/logout', {
method: 'POST',
});
},

getDashboardStats() {
return adminRequest('/admin/dashboard-stats');
},

getBookings(filters = {}) {
const params = new URLSearchParams();


Object.entries(filters).forEach(([key, value]) => {
  if (value !== undefined && value !== null && value !== '') {
    params.set(key, value);
  }
});

const query = params.toString();

return adminRequest(
  `/admin/bookings${query ? `?${query}` : ''}`
);


},

updateBookingStatus(bookingId, status) {
return adminRequest(`/admin/bookings/${bookingId}/status`, {
method: 'PATCH',
body: JSON.stringify({ status }),
});
},

recordPayment(bookingId, paymentDetails) {
  return adminRequest(`/admin/bookings/${bookingId}/payments`, {
    method: 'POST',
    body: JSON.stringify(paymentDetails),
  });
},
};
