class ExtendedDate extends Date {
  constructor(dateString) {
    super(dateString);
  }

  getTextDate() {
    const months = [
      "січня", "лютого", "березня", "квітня", "травня", "червня",
      "липня", "серпня", "вересня", "жовтня", "листопада", "грудня"
    ];
    const day = this.getDate();
    const month = this.getMonth();
    return `${day} ${months[month]}`;
  }

  isFutureOrToday() {
    const today = new Date();
    today.setHours(0, 0, 0, 0); 
    return this >= today;
  }

  isLeapYear() {
    const year = this.getFullYear();
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  }

  getNextDate() {
    const nextDate = new Date(this);
    nextDate.setDate(this.getDate() + 1);
    return nextDate.toLocaleDateString("uk-UA");
  }
}

function showDateInfo() {
  const dateStr = document.getElementById("dateInput").value;
  if (!dateStr) {
    alert("Будь ласка, введіть дату");
    return;
  }

  const extDate = new ExtendedDate(dateStr);
  const output = document.getElementById("output");

  output.innerHTML = `
    <strong>Дата текстом:</strong> ${extDate.getTextDate()}<br>
    <strong>Майбутня або сьогоднішня дата:</strong> ${extDate.isFutureOrToday()}<br>
    <strong>Високосний рік:</strong> ${extDate.isLeapYear()}<br>
    <strong>Наступна дата:</strong> ${extDate.getNextDate()}
  `;
}
