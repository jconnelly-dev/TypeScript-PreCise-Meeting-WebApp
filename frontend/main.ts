const button: HTMLElement = document.getElementById("clickMe")!;
const message: HTMLElement = document.getElementById("message")!;

button.addEventListener("click", () => {
    message.textContent = "Business Time!";
});