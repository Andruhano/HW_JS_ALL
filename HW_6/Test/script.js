document.getElementById("testForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const correctAnswers = {
    q1: "b", // Київ
    q2: "a", // 1939
    q3: "b"  // Мова розмітки
  };

  let score = 0;

  for (let key in correctAnswers) {
    const selected = document.querySelector(`input[name="${key}"]:checked`);
    if (selected && selected.value === correctAnswers[key]) {
      score++;
    }
  }

  document.getElementById("result").textContent = `Правильних відповідей: ${score} з ${Object.keys(correctAnswers).length}`;
});
