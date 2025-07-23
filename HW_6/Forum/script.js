const form = document.getElementById("messageForm");
const nameInput = document.getElementById("nameInput");
const messageInput = document.getElementById("messageInput");
const messagesContainer = document.getElementById("messagesContainer");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = nameInput.value.trim();
  const message = messageInput.value.trim();

  if (name && message) {
    const messageBlock = document.createElement("div");
    messageBlock.className = "message";

    const now = new Date();
    const timeString = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    const dateString = now.toLocaleDateString('en-GB');

    messageBlock.innerHTML = `
      <div class="message-header">
        <span>${name}</span>
        <span>${timeString} ${dateString}</span>
      </div>
      <div class="message-content">
        ${message}
      </div>
    `;

    messagesContainer.appendChild(messageBlock);

    nameInput.value = '';
    messageInput.value = '';
  }
});
