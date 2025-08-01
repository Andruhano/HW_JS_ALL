document.addEventListener('DOMContentLoaded', () => {
  const currencySelect = document.getElementById('currency');
  const convertBtn = document.getElementById('convertBtn');
  const resultDiv = document.getElementById('result');

  fetch('https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json')
    .then(res => res.json())
    .then(data => {
      const filtered = data.filter(c => ['USD', 'EUR', 'GBP', 'PLN', 'CHF'].includes(c.cc));
      filtered.forEach(c => {
        const option = document.createElement('option');
        option.value = c.rate;
        option.textContent = `${c.cc} (${c.txt})`;
        currencySelect.appendChild(option);
      });
    });

  convertBtn.addEventListener('click', () => {
    const amount = parseFloat(document.getElementById('amount').value);
    const rate = parseFloat(currencySelect.value);
    if (isNaN(amount)) {
      resultDiv.textContent = "Введіть правильну суму!";
      resultDiv.style.color = "red";
      return;
    }
    const converted = (amount / rate).toFixed(2);
    const selected = currencySelect.options[currencySelect.selectedIndex].textContent;
    resultDiv.textContent = `${amount} ₴ = ${converted} ${selected}`;
    resultDiv.style.color = "black";
  });
});
