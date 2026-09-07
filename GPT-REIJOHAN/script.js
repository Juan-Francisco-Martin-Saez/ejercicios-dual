// REFERENCIAS AL HTML
// querySelector() conecta el JavaScript con los elementos definidos en el HTML.

const chatApp = document.querySelector(".chat-app");
const messageInput = document.querySelector(".message-input");
const sendButton = document.querySelector(".message-send-button");
const newChatButton = document.querySelector("#new-chat-button");
const messagesContainer = document.querySelector(".messages-container");
const sidebarToggle = document.querySelector("#sidebar-toggle");
const chatHistoryButton = document.querySelector("#chat-history-button");
const fileInput = document.querySelector("#file-attach");
const fileAttachContainer = document.querySelector(".file-attach-container");
const messageInputContainer = document.querySelector(".message-input-container");

let selectedFile = null;


// Ajusta automáticamente la altura del textarea según su contenido.
function autoResizeTextarea() {
  messageInput.style.height = "auto";
  messageInput.style.height = `${Math.min(messageInput.scrollHeight, 180)}px`;
}


// Cierra el menú lateral en tablet y móvil.
function closeMobileMenu() {
  if (window.innerWidth <= 1024) {
    sidebarToggle.checked = false;
  }
}


// Convierte el tamaño del archivo a Bytes, KB, MB o GB.
function formatFileSize(bytes) {
  if (bytes === 0) {
    return "0 Bytes";
  }

  const units = ["Bytes", "KB", "MB", "GB"];
  const index = Math.floor(Math.log(bytes) / Math.log(1024));

  return `${(bytes / Math.pow(1024, index)).toFixed(1)} ${units[index]}`;
}


// Crea la previsualización visual del archivo seleccionado.
function createFilePreview() {
  removeFilePreview();

  if (!selectedFile) {
    return;
  }

  const filePreview = document.createElement("div");
  filePreview.className = "file-preview";
  filePreview.id = "file-preview";

  const fileInfo = document.createElement("div");
  fileInfo.className = "file-preview-info";

  const fileIcon = document.createElement("span");
  fileIcon.className = "file-preview-icon";
  fileIcon.textContent = "📎";

  const fileDetails = document.createElement("div");
  fileDetails.className = "file-preview-details";

  const fileName = document.createElement("span");
  fileName.className = "file-preview-name";
  fileName.textContent = selectedFile.name;
  fileName.title = selectedFile.name;

  const fileSize = document.createElement("span");
  fileSize.className = "file-preview-size";
  fileSize.textContent = formatFileSize(selectedFile.size);

  const removeButton = document.createElement("button");
  removeButton.type = "button";
  removeButton.className = "file-preview-remove";
  removeButton.setAttribute("aria-label", "Eliminar archivo adjunto");
  removeButton.textContent = "×";


  // Elimina el archivo al pulsar el botón ×.
  removeButton.addEventListener("click", function () {
    removeSelectedFile();
  });

  fileDetails.appendChild(fileName);
  fileDetails.appendChild(fileSize);

  fileInfo.appendChild(fileIcon);
  fileInfo.appendChild(fileDetails);

  filePreview.appendChild(fileInfo);
  filePreview.appendChild(removeButton);

  messageInputContainer.parentNode.insertBefore(
    filePreview,
    messageInputContainer
  );
}


// Elimina la previsualización existente del archivo.
function removeFilePreview() {
  const existingPreview = document.querySelector("#file-preview");

  if (existingPreview) {
    existingPreview.remove();
  }
}


// Elimina el archivo seleccionado y su previsualización.
function removeSelectedFile() {
  selectedFile = null;
  fileInput.value = "";
  removeFilePreview();
}


// Detecta el archivo seleccionado y genera su previsualización.
function handleFileSelection() {
  const file = fileInput.files[0];

  if (!file) {
    return;
  }

  selectedFile = file;

  createFilePreview();
}


// Procesa el envío de un mensaje, un archivo o ambos.
function sendMessage() {
  const message = messageInput.value.trim();

  if (!message && !selectedFile) {
    return;
  }

  chatApp.classList.add("chat-has-messages");

  messageInput.value = "";
  messageInput.style.height = "auto";

  if (selectedFile) {
    console.log("Archivo adjunto:", selectedFile.name);
    console.log("Tipo:", selectedFile.type);
    console.log("Tamaño:", selectedFile.size);

    /*
     * Aquí queda preparado el archivo para enviarlo
     * posteriormente a un servidor o API.
     */
  }

  removeSelectedFile();

  closeMobileMenu();
}


// Devuelve el chat a su estado inicial.
function resetChat() {
  chatApp.classList.remove("chat-has-messages");

  messagesContainer.innerHTML = "";

  messageInput.value = "";
  messageInput.style.height = "auto";

  removeSelectedFile();

  closeMobileMenu();
}


// Detecta cambios en el textarea y reajusta automáticamente su altura.
messageInput.addEventListener("input", autoResizeTextarea);


// Permite enviar con Enter y crear una nueva línea con Shift + Enter.
messageInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }
});


// Envía el mensaje al pulsar el botón de enviar.
sendButton.addEventListener("click", sendMessage);


// Reinicia el chat al pulsar "Nueva conversación".
newChatButton.addEventListener("click", function (event) {
  event.preventDefault();
  resetChat();
});


// Permite desplegar el sidebar desde el botón de historial en escritorio.
chatHistoryButton.addEventListener("click", function () {
  if (window.innerWidth > 1024 && sidebarToggle.checked) {
    sidebarToggle.checked = false;
  }
});


// Detecta cuándo se selecciona un archivo.
fileInput.addEventListener("change", handleFileSelection);


// Mantiene cerrado el menú móvil al volver a escritorio.
window.addEventListener("resize", function () {
  if (window.innerWidth > 1024) {
    sidebarToggle.checked = false;
  }
});


// Cierra el menú lateral después de seleccionar una conversación.
document.querySelectorAll(".chat-history-link").forEach(function (link) {
  link.addEventListener("click", function () {
    closeMobileMenu();
  });
});