const seatsGrid = document.getElementById("seatsGrid");
const showSeatsBtn = document.getElementById("showSeats");
const bookSeatsBtn = document.getElementById("bookSeats");
const bookedList = document.getElementById("bookedList");

const bookedTickets = []; 

const totalSeats = 20; 

let currentSelection = [];

function generateSeats() {
  seatsGrid.innerHTML = "";
  currentSelection = [];

  for (let i = 1; i <= totalSeats; i++) {
    const seat = document.createElement("div");
    seat.className = "seat";
    seat.textContent = i;

    const direction = document.getElementById("direction").value;
    const date = document.getElementById("date").value;
    const key = `${direction}-${date}-${i}`;

    const isBooked = bookedTickets.some(t => t.key === key);
    if (isBooked) {
      seat.classList.add("booked");
    } else {
      seat.addEventListener("click", () => {
        seat.classList.toggle("selected");
        const index = currentSelection.indexOf(i);
        if (index === -1) {
          currentSelection.push(i);
        } else {
          currentSelection.splice(index, 1);
        }
      });
    }

    seatsGrid.appendChild(seat);
  }
}

showSeatsBtn.addEventListener("click", () => {
  const date = document.getElementById("date").value;
  if (!date) {
    alert("Оберіть дату!");
    return;
  }
  document.getElementById("seatsSection").style.display = "block";
  generateSeats();
});

bookSeatsBtn.addEventListener("click", () => {
  const direction = document.getElementById("direction").value;
  const date = document.getElementById("date").value;

  currentSelection.forEach(seatNum => {
    const ticket = {
      key: `${direction}-${date}-${seatNum}`,
      direction,
      date,
      seat: seatNum
    };
    bookedTickets.push(ticket);
  });

  updateBookedList();
  generateSeats(); 
  alert("Місця заброньовано!");
});

function updateBookedList() {
  bookedList.innerHTML = "";
  bookedTickets.forEach(ticket => {
    const li = document.createElement("li");
    li.textContent = `${ticket.direction} | ${ticket.date} | Місце: ${ticket.seat}`;
    bookedList.appendChild(li);
  });
}
