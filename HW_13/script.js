const authContent = `
    <div class="d-flex justify-content-between align-items-center mb-3">
        <button id="exit-button" class="btn btn-danger">Вихід з системи</button>
        <div id="user-data" class="ms-3"></div>
    </div>
`;

const anonContent = `<button id="auth-button" class="btn btn-dark">Вхід до системи</button>`;
let intervalId = null;

document.addEventListener('DOMContentLoaded', () => {
    updateAuthBlock();
});

function authenticate() {
    const tokenPayload = {
        user: "M.A",
        timestamp: new Date().toISOString()
    };
    const token = btoa(JSON.stringify(tokenPayload));
    return new Promise((resolve) => setTimeout(() => resolve(token), 500));
}

function decodeToken(token) {
    try {
        return JSON.parse(atob(token));
    } catch (e) {
        console.error("Помилка декодування:", e);
        return null;
    }
}

function isTokenValid(data) {
    if (!data || !data.timestamp) return { isValid: false };
    const created = new Date(data.timestamp);
    const expires = new Date(created.getTime() + 24 * 60 * 60 * 1000);
    const now = new Date();
    return {
        isValid: now < expires,
        validUntil: expires,
        timeLeft: Math.max(0, expires - now)
    };
}

function formatTimeLeft(ms) {
    const totalSec = Math.floor(ms / 1000);
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    return `${h > 0 ? `${h} год. ` : ''}${m > 0 ? `${m} хв. ` : ''}${s} сек.`;
}

function authBtnClick() {
    authenticate().then(token => {
        localStorage.setItem("token", token);
        updateAuthBlock();
    });
}

function exitBtnClick() {
    localStorage.removeItem("token");
    clearInterval(intervalId);
    updateAuthBlock();
    showInfoModal("Сесія завершена", "Ви вийшли з системи.");
}

function updateAuthBlock() {
    const block = document.getElementById("auth-block");
    const token = localStorage.getItem("token");
    if (!block) return;

    if (token) {
        const data = decodeToken(token);
        const validity = isTokenValid(data);

        if (!validity.isValid) {
            exitBtnClick();
            return;
        }

        block.innerHTML = authContent;
        const userData = document.getElementById("user-data");

        const authTime = new Date(data.timestamp);
        const timeLeftStr = formatTimeLeft(validity.timeLeft);
        const expiresStr = validity.validUntil.toLocaleString("uk-UA");

        userData.innerHTML = `
            <div class="user-info">
                👤 <strong>${data.user}</strong><br>
                🕓 Авторизація: ${authTime.toLocaleString("uk-UA")}<br>
                ⏰ Дійсний до: ${expiresStr} <span id="time-remaining">(${timeLeftStr})</span>
            </div>
        `;

        if (!block.dataset.authenticated) {
            showWelcomeModal(data.user, validity);
            block.dataset.authenticated = "true";
        }

        clearInterval(intervalId);
        intervalId = setInterval(() => {
            const now = new Date();
            const newTimeLeft = validity.validUntil - now;

            if (newTimeLeft <= 0) {
                clearInterval(intervalId);
                exitBtnClick();
                return;
            }

            const timeRemainingEl = document.getElementById("time-remaining");
            if (timeRemainingEl) {
                timeRemainingEl.textContent = `(${formatTimeLeft(newTimeLeft)})`;
            }
        }, 1000);
    } else {
        block.innerHTML = anonContent;
        block.removeAttribute('data-authenticated');
        clearInterval(intervalId);
    }

    updateListeners();
}

function updateListeners() {
    const authBtn = document.getElementById("auth-button");
    const exitBtn = document.getElementById("exit-button");
    if (authBtn) authBtn.onclick = authBtnClick;
    if (exitBtn) exitBtn.onclick = exitBtnClick;
}

function showWelcomeModal(userName, validity) {
    const userNameEl = document.getElementById("userName");
    const timeLeftEl = document.getElementById("modal-time-left");

    userNameEl.textContent = userName;
    timeLeftEl.textContent = formatTimeLeft(validity.timeLeft);

    const modal = new bootstrap.Modal(document.getElementById("welcomeModal"));
    modal.show();
}

function showInfoModal(title, message) {
    alert(`${title}\n\n${message}`);
}
