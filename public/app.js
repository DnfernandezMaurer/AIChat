const form = document.querySelector("form");
const messageInput = document.getElementById("message");
const chatHistory = document.getElementById("chat-history");
const messageBtn = document.getElementById("message-btn");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const userMessage = messageInput.value;

  if (!userMessage.trim()) return;

  appendMessageToHistory("user", userMessage);

  messageBtn.disabled = true;
  messageBtn.innerHTML = "Enviando...";

  try {
    const res = await fetch("/api/flowise", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: userMessage }),
    });

    const data = await res.json();

    appendMessageToHistory("bot", data.message);
  } catch (error) {
    appendMessageToHistory("bot", "Error: " + error.message);
  } finally {
    messageBtn.disabled = false;
    messageBtn.innerHTML = "Enviar";
    messageInput.value = "";
  }
});

function appendMessageToHistory(sender, message) {
  const messageEl = document.createElement("div");
  messageEl.classList.add("p-4", "rounded-xl", "w-full", "relative");

  const titleContainer = document.createElement("div");
  titleContainer.classList.add("absolute", "-top-7", "left-0", "p-2", "text-white", "font-bold");

  if (sender === "user") {
    messageEl.classList.add("bg-gray-500", "text-white");

    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("absolute", "-bottom-3", "right-0", "flex", "space-x-1", "p-2");

    const button1 = document.createElement("button");
    button1.classList.add("bg-red-500", "text-white", "px-1", "py-0.5", "rounded", "text-xs");
    button1.innerText = "Sin respuesta";

    // Agregar event listener al botón
    button1.addEventListener("click", () => {
      console.log(message);
    });

    buttonContainer.appendChild(button1);
    messageEl.appendChild(buttonContainer);

    // Añadir título "User"
    titleContainer.innerText = "User";
  } else {
    messageEl.classList.add("bg-gray-700", "text-white");

    // Añadir título "Chatbot"
    titleContainer.innerText = "Chatbot";
    
  }

  const messageText = document.createElement("div");
  messageText.innerText = message;
  messageEl.appendChild(messageText);

  // Añadir el contenedor de título al elemento del mensaje
  messageEl.appendChild(titleContainer);

  chatHistory.appendChild(messageEl);
  chatHistory.scrollTop = chatHistory.scrollHeight;
}
