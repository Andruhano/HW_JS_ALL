document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("start-then").addEventListener("click", () => runThen());
    document.getElementById("start-await").addEventListener("click", () => runAwait());
});

function getSelectedOption() {
    return document.querySelector('input[name="result"]:checked').value;
}

function getCurrentTime() {
    return new Date().toLocaleTimeString();
}

function logMessage(message) {
    const log = document.getElementById("log");
    log.textContent += message + "\n";
}

function simulateAsyncCall(delay, isSuccess) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            isSuccess ? resolve() : reject();
        }, delay);
    });
}

function runThen() {
    const delay = parseInt(document.getElementById("delay").value);
    const isSuccess = getSelectedOption() === "success";

    logMessage(`${getCurrentTime()} виклик (.then)`);

    simulateAsyncCall(delay, isSuccess)
        .then(() => {
            logMessage(`${getCurrentTime()} завершено успішно`);
        })
        .catch(() => {
            logMessage(`${getCurrentTime()} завершено з помилкою`);
        });
}

async function runAwait() {
    const delay = parseInt(document.getElementById("delay").value);
    const isSuccess = getSelectedOption() === "success";

    logMessage(`${getCurrentTime()} виклик (await)`);

    try {
        await simulateAsyncCall(delay, isSuccess);
        logMessage(`${getCurrentTime()} завершено успішно`);
    } catch {
        logMessage(`${getCurrentTime()} завершено з помилкою`);
    }
}
