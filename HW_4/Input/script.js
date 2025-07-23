const input = document.getElementById("nameInput");

input.addEventListener("keypress", function(event) {
  const char = String.fromCharCode(event.which);
  if (/\d/.test(char)) {
    event.preventDefault(); 
  }
});

input.addEventListener("input", function() {
  this.value = this.value.replace(/\d/g, '');
});