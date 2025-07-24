const form = document.getElementById("colorForm");
const palette = document.getElementById("palette");

const nameInput = document.getElementById("name");
const typeInput = document.getElementById("type");
const codeInput = document.getElementById("code");

const nameError = document.getElementById("nameError");
const codeError = document.getElementById("codeError");

let colors = getColorsFromCookie();

function getColorsFromCookie() {
  const match = document.cookie.match(/colors=([^;]+)/);
  return match ? JSON.parse(decodeURIComponent(match[1])) : [];
}

function saveColorsToCookie(colors) {
  const expires = new Date(Date.now() + 3 * 60 * 60 * 1000).toUTCString(); // 3 години
  document.cookie = `colors=${encodeURIComponent(JSON.stringify(colors))}; expires=${expires}; path=/`;
}

function isValidName(name) {
  return /^[a-zA-Zа-яА-ЯіІїЇєЄ]+$/.test(name);
}

function isUniqueName(name) {
  return !colors.some(c => c.name.toLowerCase() === name.toLowerCase());
}

function isValidCode(type, code) {
  if (type === "RGB") {
    return /^(\d{1,3}),(\d{1,3}),(\d{1,3})$/.test(code) &&
      code.split(',').every(n => +n >= 0 && +n <= 255);
  }
  if (type === "RGBA") {
    const parts = code.split(',');
    if (parts.length !== 4) return false;
    const [r, g, b, a] = parts;
    return [r, g, b].every(n => +n >= 0 && +n <= 255) && +a >= 0 && +a <= 1;
  }
  if (type === "HEX") {
    return /^#[0-9A-Fa-f]{6}$/.test(code);
  }
  return false;
}

function renderPalette() {
  palette.innerHTML = "";
  colors.forEach(color => {
    const div = document.createElement("div");
    div.className = "color-box";

    let cssColor = "";
    if (color.type === "RGB") {
      cssColor = `rgb(${color.code})`;
    } else if (color.type === "RGBA") {
      cssColor = `rgba(${color.code})`;
    } else {
      cssColor = color.code;
    }

    div.style.backgroundColor = cssColor;

    const isDark = getTextColorBasedOnBg(cssColor);
    div.style.color = isDark ? "white" : "black";

    div.innerHTML = `
      <div class="name">${color.name.toUpperCase()}</div>
      <div class="type">${color.type}</div>
      <div class="code">${color.code}</div>
    `;
    palette.appendChild(div);
  });
}

function getTextColorBasedOnBg(bgColor) {
  let r, g, b;

  if (bgColor.startsWith("#")) {
    const bigint = parseInt(bgColor.slice(1), 16);
    r = (bigint >> 16) & 255;
    g = (bigint >> 8) & 255;
    b = bigint & 255;
  } else if (bgColor.startsWith("rgb")) {
    const values = bgColor.match(/\d+(\.\d+)?/g);
    [r, g, b] = values.map(Number);
  }

  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness < 128;
}

form.addEventListener("submit", function (e) {
  e.preventDefault();

  nameError.textContent = "";
  codeError.textContent = "";

  const name = nameInput.value.trim();
  const type = typeInput.value;
  const code = codeInput.value.trim().replace(/\s+/g, '');

  let valid = true;

  if (!name) {
    nameError.textContent = "Назва обов’язкова";
    valid = false;
  } else if (!isValidName(name)) {
    nameError.textContent = "Назва повинна містити лише літери";
    valid = false;
  } else if (!isUniqueName(name)) {
    nameError.textContent = "Назва вже використовується";
    valid = false;
  }

  if (!isValidCode(type, code)) {
    codeError.textContent = "Неправильний формат коду кольору для типу " + type;
    valid = false;
  }

  if (!valid) return;

  const newColor = { name, type, code };
  colors.push(newColor);
  saveColorsToCookie(colors);
  renderPalette();
  form.reset();
});

renderPalette();
