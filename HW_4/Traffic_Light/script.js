const lights = ["red", "yellow", "green"];
let current = 0;

function updateLight() {
  lights.forEach((color, index) => {
    const light = document.getElementById(color);
    light.classList.toggle("active", index === current);
  });
}

document.getElementById("next").addEventListener("click", () => {
  current = (current + 1) % lights.length;
  updateLight();
});

updateLight();
