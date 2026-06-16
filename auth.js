function showMessage(container, message, type = 'success') {
    if (!container) return;
    container.textContent = message;
    container.className = `auth-message ${type}`;
    container.style.display = 'block';
}

function clearMessage(container) {
    if (!container) return;
    container.textContent = '';
    container.style.display = 'none';
}

async function postJson(url, payload) {
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'same-origin'
    });
    return response.json().then(data => ({ ok: response.ok, data }));
}

const registerForm = document.getElementById('registerForm');
const loginForm = document.getElementById('loginForm');
const profileCard = document.getElementById('profileCard');
const signedOutCard = document.getElementById('signedOutCard');
const logoutBtn = document.getElementById('logoutBtn');
const contactForm = document.getElementById('contactBookingForm');
const contactNotice = document.getElementById('contactNotice');
const contactLoggedIn = document.getElementById('contactLoggedIn');

if (registerForm) {
    const messageContainer = document.getElementById('registerMessage');
    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        clearMessage(messageContainer);

        const form = new FormData(registerForm);
        const payload = {
            name: form.get('name'),
            email: form.get('email'),
            password: form.get('password'),
            district: form.get('district'),
            service: form.get('service')
        };

        const { ok, data } = await postJson('/api/register', payload);
        if (ok) {
            showMessage(messageContainer, 'Registration successful. Redirecting to login...', 'success');
            setTimeout(() => { window.location.href = 'login.html'; }, 1400);
        } else {
            showMessage(messageContainer, data.error || 'Unable to register.', 'error');
        }
    });
}

if (loginForm) {
    const messageContainer = document.getElementById('loginMessage');
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        clearMessage(messageContainer);

        const form = new FormData(loginForm);
        const payload = {
            email: form.get('email'),
            password: form.get('password')
        };

        const { ok, data } = await postJson('/api/login', payload);
        if (ok) {
            showMessage(messageContainer, 'Login successful. Redirecting to account...', 'success');
            setTimeout(() => { window.location.href = 'account.html'; }, 900);
        } else {
            showMessage(messageContainer, data.error || 'Unable to log in.', 'error');
        }
    });
}

async function loadProfile() {
    const response = await fetch('/api/profile', { credentials: 'same-origin' });
    const result = await response.json();
    return { ok: response.ok, data: result };
}

async function renderProfile() {
    if (!profileCard) return;
    const profileInfo = document.getElementById('profileInfo');
    const profileError = document.getElementById('profileError') || document.getElementById('accountError');
    const { ok, data } = await loadProfile();

    if (!ok) {
        profileCard.style.display = 'none';
        if (signedOutCard) signedOutCard.style.display = 'block';
        if (profileError) {
            profileError.style.display = 'block';
            profileError.textContent = data.error || 'Please sign in to continue.';
        }
        return;
    }

    const user = data.user;
    if (profileInfo) {
        profileInfo.innerHTML = `
            <div class="profile-row"><strong>Name</strong><span>${user.name}</span></div>
            <div class="profile-row"><strong>Email</strong><span>${user.email}</span></div>
            <div class="profile-row"><strong>District</strong><span>${user.district || 'Not specified'}</span></div>
            <div class="profile-row"><strong>Service</strong><span>${user.service || 'Not specified'}</span></div>
            <div class="profile-row"><strong>Joined</strong><span>${new Date(user.created_at).toLocaleDateString()}</span></div>
        `;
    }
}

async function renderContactPage() {
    if (!contactForm) return;

    const { ok, data } = await loadProfile();
    if (!ok) {
        contactForm.style.display = 'none';
        if (contactNotice) contactNotice.style.display = 'block';
        if (contactLoggedIn) contactLoggedIn.style.display = 'none';
        return;
    }

    const user = data.user;
    if (contactLoggedIn) contactLoggedIn.style.display = 'block';
    if (contactNotice) contactNotice.style.display = 'none';
    contactForm.style.display = 'block';

    const nameParts = user.name.split(' ');
    const firstName = nameParts.shift();
    const lastName = nameParts.join(' ') || '';

    const fnameInput = document.getElementById('fname');
    const lnameInput = document.getElementById('lname');
    const emailInput = document.getElementById('email');
    const districtInput = document.getElementById('district');
    const serviceInput = document.getElementById('service');

    if (fnameInput) fnameInput.value = firstName;
    if (lnameInput) lnameInput.value = lastName;
    if (emailInput) emailInput.value = user.email;
    if (districtInput) districtInput.value = user.district || '';
    if (serviceInput) serviceInput.value = user.service || '';
}

if (contactForm) {
    contactForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const messageContainer = document.getElementById('contactMessage');
        clearMessage(messageContainer);

        const form = new FormData(contactForm);
        const payload = {
            firstName: form.get('fname'),
            lastName: form.get('lname'),
            phone: form.get('phone'),
            email: form.get('email'),
            district: form.get('district'),
            service: form.get('service'),
            message: form.get('message')
        };

        const { ok, data } = await postJson('/api/book', payload);
        if (ok) {
            showMessage(messageContainer, 'Booking request submitted. Our team will contact you soon.', 'success');
            contactForm.reset();
            renderContactPage();
            renderAccount();
        } else {
            showMessage(messageContainer, data.error || 'Unable to submit booking.', 'error');
        }
    });
}

async function loadBookings() {
    const response = await fetch('/api/bookings', { credentials: 'same-origin' });
    const result = await response.json();
    return { ok: response.ok, data: result };
}

async function renderAccount() {
    const accountDashboard = document.getElementById('accountDashboard');
    const profileInfo = document.getElementById('profileInfo');
    const profileError = document.getElementById('profileError') || document.getElementById('accountError');
    const appointmentsList = document.getElementById('appointmentsList');
    const noAppointments = document.getElementById('noAppointments');
    const signedOut = document.getElementById('signedOutCard');

    if (!accountDashboard) return;

    const profileResult = await loadProfile();
    if (!profileResult.ok) {
        accountDashboard.style.display = 'none';
        if (signedOut) signedOut.style.display = 'block';
        if (profileError) {
            profileError.style.display = 'block';
            profileError.textContent = profileResult.data.error || 'Please login to access your dashboard.';
        }
        return;
    }

    if (signedOut) signedOut.style.display = 'none';
    const user = profileResult.data.user;
    if (profileInfo) {
        profileInfo.innerHTML = `
            <div class="profile-row"><strong>Name</strong><span>${user.name}</span></div>
            <div class="profile-row"><strong>Email</strong><span>${user.email}</span></div>
            <div class="profile-row"><strong>District</strong><span>${user.district || 'Not specified'}</span></div>
            <div class="profile-row"><strong>Service</strong><span>${user.service || 'Not specified'}</span></div>
            <div class="profile-row"><strong>Joined</strong><span>${new Date(user.created_at).toLocaleDateString()}</span></div>
        `;
    }

    const bookingsResult = await loadBookings();
    if (!bookingsResult.ok) {
        if (appointmentsList) appointmentsList.innerHTML = `<div class="auth-message error">${bookingsResult.data.error || 'Unable to load bookings.'}</div>`;
        if (noAppointments) noAppointments.style.display = 'none';
        return;
    }

    const bookings = bookingsResult.data.bookings || [];
    if (bookings.length === 0) {
        if (appointmentsList) appointmentsList.innerHTML = '';
        if (noAppointments) noAppointments.style.display = 'block';
        return;
    }

    if (appointmentsList) {
        appointmentsList.innerHTML = bookings.map(booking => `
            <div class="appointment-item">
                <div class="appointment-header">
                    <span class="appointment-name">${booking.first_name} ${booking.last_name}</span>
                    <span class="appointment-status ${booking.status.toLowerCase()}">${booking.status}</span>
                </div>
                <div class="appointment-meta">
                    <span>${new Date(booking.created_at).toLocaleDateString()}</span>
                    <span>${booking.district}</span>
                    <span>${booking.service}</span>
                </div>
                <p>${booking.message || 'No additional details provided.'}</p>
            </div>
        `).join('');
    }
    if (noAppointments) noAppointments.style.display = 'none';
}

if (profileCard || contactForm) {
    renderProfile().then(() => {
        renderContactPage();
    });
}

renderAccount().catch(() => {});

if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
        await postJson('/api/logout', {});
        window.location.href = 'login.html';
    });
}
