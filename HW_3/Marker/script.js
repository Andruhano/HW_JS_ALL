class Marker {
  constructor(color, ink) {
    this.color = color;
    this.ink = ink; 
  }

  print(text) {
    let result = '';
    for (let char of text) {
      if (this.ink <= 0) break;
      if (char !== ' ') {
        if (this.ink >= 0.5) {
          result += char;
          this.ink -= 0.5;
        } else {
          break;
        }
      } else {
        result += char; 
      }
    }

    return `<span style="color:${this.color}">${result}</span>`;
  }
}

class RefillableMarker extends Marker {
  refill() {
    this.ink = 100;
  }
}

let marker;

function printText() {
  const color = document.getElementById('markerColor').value;
  const ink = parseFloat(document.getElementById('inkAmount').value);
  const text = document.getElementById('inputText').value;

  if (!marker) marker = new RefillableMarker(color, ink);
  else {
    marker.color = color;
    marker.ink = ink;
  }

  const printed = marker.print(text);
  document.getElementById('output').innerHTML = printed + `<br><small>Залишилось чорнил: ${marker.ink.toFixed(1)}%</small>`;
  document.getElementById('inkAmount').value = marker.ink.toFixed(1);
}

function refill() {
  if (marker) {
    marker.refill();
    document.getElementById('inkAmount').value = 100;
    alert("Маркер заправлено!");
  }
}
