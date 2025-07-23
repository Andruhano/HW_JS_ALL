const resizable = document.getElementById("resizable");
const resizer = document.getElementById("resizer");

let isResizing = false;

resizer.addEventListener("mousedown", function (e) {
  isResizing = true;

  const startX = e.clientX;
  const startY = e.clientY;
  const startWidth = resizable.offsetWidth;
  const startHeight = resizable.offsetHeight;

  function resizeMouseMove(e) {
    if (!isResizing) return;

    const newWidth = startWidth + (e.clientX - startX);
    const newHeight = startHeight + (e.clientY - startY);
    resizable.style.width = newWidth + "px";
    resizable.style.height = newHeight + "px";
  }

  function stopResize() {
    isResizing = false;
    document.removeEventListener("mousemove", resizeMouseMove);
    document.removeEventListener("mouseup", stopResize);
  }

  document.addEventListener("mousemove", resizeMouseMove);
  document.addEventListener("mouseup", stopResize);
});
