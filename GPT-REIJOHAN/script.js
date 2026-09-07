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



/* JAVASCRIPT
│
├── REFERENCIAS A ELEMENTOS DEL HTML
│
│   ├── const chatApp = document.querySelector(".chat-app");
│   │   → Busca .chat-app en el HTML.
│   │   → Guarda una referencia al contenedor principal de la aplicación.
│   │   → Sirve para poder modificar el estado general del chat.
│   │
│   ├── const messageInput = document.querySelector(".message-input");
│   │   → Busca el <textarea> donde el usuario escribe.
│   │   → Permite leer, modificar y controlar el campo de texto.
│   │
│   ├── const sendButton = document.querySelector(".message-send-button");
│   │   → Busca el botón de enviar.
│   │   → Permite detectar cuándo el usuario pulsa enviar.
│   │
│   ├── const newChatButton = document.querySelector("#new-chat-button");
│   │   → Busca el botón "Nueva conversación".
│   │   → Permite reiniciar el estado del chat.
│   │
│   ├── const messagesContainer = document.querySelector(".messages-container");
│   │   → Busca el contenedor destinado a los mensajes.
│   │   → Actualmente se utiliza para vaciar el contenido al crear un nuevo chat.
│   │
│   ├── const sidebarToggle = document.querySelector("#sidebar-toggle");
│   │   → Busca el checkbox que controla el menú lateral.
│   │   → Se utiliza para abrir/cerrar el menú en tablet y móvil.
│   │   → En escritorio también controla el estado plegado/desplegado del sidebar.
│   │
│   ├── const chatHistoryButton = document.querySelector("#chat-history-button");
│   │   → Busca el botón "Historial de conversaciones".
│   │   → Permite detectar cuándo se pulsa el icono de conversaciones.
│   │   → En escritorio permite desplegar el sidebar cuando está plegado.
│   │
│   ├── const fileInput = document.querySelector("#file-attach");
│   │   → Busca el selector real de archivos.
│   │   → Permite detectar qué archivo ha seleccionado el usuario.
│   │
│   ├── const fileAttachContainer = document.querySelector(".file-attach-container");
│   │   → Busca el contenedor del sistema de archivos.
│   │   → La referencia queda preparada para futuras funciones relacionadas
│   │     con los archivos.
│   │
│   └── const messageInputContainer = document.querySelector(".message-input-container");
│       → Busca el contenedor del campo de texto.
│       → Se utiliza para insertar dinámicamente la previsualización
│         del archivo seleccionado.
│
│
├── VARIABLE selectedFile
│
│   └── let selectedFile = null;
│       → Guarda temporalmente el archivo seleccionado.
│       → Inicialmente no existe ningún archivo.
│       → Puede contener un objeto File cuando el usuario selecciona uno.
│       → Se utiliza para saber si existe un archivo preparado para enviar.
│
│
├── FUNCIÓN autoResizeTextarea()
│
│   ├── messageInput.style.height = "auto";
│   │   → Restablece temporalmente la altura del textarea.
│   │   → Permite volver a calcular correctamente su tamaño.
│   │
│   └── messageInput.style.height =
│       `${Math.min(messageInput.scrollHeight, 180)}px`;
│       → Calcula la altura necesaria según el contenido.
│       → scrollHeight indica cuánto espacio necesita el texto.
│       → Math.min(..., 180) limita la altura máxima a 180 px.
│       → Permite que el campo crezca cuando se escriben varias líneas.
│       → Cuando alcanza la altura máxima, el CSS permite
│         desplazamiento vertical dentro del textarea.
│
│
├── FUNCIÓN closeMobileMenu()
│
│   └── if (window.innerWidth <= 1024)
│       → Comprueba si la pantalla tiene 1024 px o menos.
│       → Es el rango utilizado para tablet y móvil.
│
│       └── sidebarToggle.checked = false;
│           → Desmarca el checkbox del menú.
│           → Al desmarcarlo, el CSS vuelve a ocultar el sidebar.
│           → Cierra el menú lateral en dispositivos pequeños.
│
│
├── FUNCIÓN formatFileSize(bytes)
│
│   ├── if (bytes === 0)
│   │   └── return "0 Bytes";
│   │       → Devuelve una representación específica
│   │         cuando el archivo tiene tamaño cero.
│   │
│   ├── const units = ["Bytes", "KB", "MB", "GB"];
│   │   └── Define las unidades utilizadas para mostrar
│   │       el tamaño del archivo.
│   │
│   ├── const index =
│   │   Math.floor(Math.log(bytes) / Math.log(1024));
│   │   → Calcula qué unidad corresponde al tamaño.
│   │
│   └── return `${(bytes / Math.pow(1024, index)).toFixed(1)} ${units[index]}`;
│       → Convierte el tamaño a Bytes, KB, MB o GB.
│       → Muestra una cifra decimal.
│
│
├── FUNCIÓN createFilePreview()
│
│   ├── removeFilePreview();
│   │   → Elimina cualquier previsualización anterior.
│   │   → Garantiza que solo exista una previsualización.
│   │
│   ├── if (!selectedFile)
│   │   └── return;
│   │       → Si no existe archivo seleccionado, detiene la función.
│   │
│   ├── filePreview
│   │   └── Crea dinámicamente el contenedor
│   │       de la previsualización.
│   │
│   ├── fileInfo
│   │   └── Crea el contenedor de información del archivo.
│   │
│   ├── fileIcon
│   │   └── Crea el icono visual del archivo.
│   │       Actualmente utiliza el símbolo 📎.
│   │
│   ├── fileDetails
│   │   └── Contiene nombre y tamaño.
│   │
│   ├── fileName
│   │   └── Muestra el nombre del archivo seleccionado.
│   │       También utiliza title para permitir consultar
│   │       el nombre completo.
│   │
│   ├── fileSize
│   │   └── Muestra el tamaño utilizando formatFileSize().
│   │
│   ├── removeButton
│   │   └── Crea el botón "×" para eliminar el archivo.
│   │
│   ├── removeButton.addEventListener("click", ...)
│   │   └── Al pulsarlo ejecuta removeSelectedFile().
│   │
│   └── messageInputContainer.parentNode.insertBefore(...)
│       → Inserta la previsualización justo antes
│         del contenedor del campo de texto.
│
│
├── FUNCIÓN removeFilePreview()
│
│   └── const existingPreview = document.querySelector("#file-preview");
│       → Busca la previsualización existente.
│
│       └── existingPreview.remove();
│           → Elimina la previsualización del HTML.
│           → Solo actúa si existe.
│
│
├── FUNCIÓN removeSelectedFile()
│
│   ├── selectedFile = null;
│   │   → Elimina la referencia al archivo seleccionado.
│   │
│   ├── fileInput.value = "";
│   │   → Limpia el selector de archivos.
│   │   → Permite volver a seleccionar el mismo archivo posteriormente.
│   │
│   └── removeFilePreview();
│       → Elimina la representación visual del archivo.
│
│
├── FUNCIÓN handleFileSelection()
│
│   ├── const file = fileInput.files[0];
│   │   → Obtiene el primer archivo seleccionado.
│   │
│   ├── if (!file)
│   │   └── return;
│   │       → Si no existe archivo, detiene la función.
│   │
│   ├── selectedFile = file;
│   │   → Guarda temporalmente el archivo seleccionado.
│   │
│   └── createFilePreview();
│       → Genera su previsualización visual.
│
│
├── FUNCIÓN sendMessage()
│
│   ├── const message = messageInput.value.trim();
│   │   → Obtiene el texto escrito por el usuario.
│   │   → trim() elimina espacios al principio y al final.
│   │
│   ├── if (!message && !selectedFile)
│   │   └── return;
│   │       → Comprueba que exista texto o archivo.
│   │       → Si no existe ninguno de los dos, detiene la función.
│   │       → Permite enviar una consulta únicamente con un archivo.
│   │
│   ├── chatApp.classList.add("chat-has-messages");
│   │   → Añade la clase .chat-has-messages a .chat-app.
│   │   → Esta clase activa en CSS el estado "chat iniciado".
│   │   → Provoca, entre otras cosas:
│   │       • desplazamiento de la barra de consulta hacia abajo
│   │       • desaparición/transición del mensaje de bienvenida
│   │       • aparición del estado de procesamiento
│   │
│   ├── messageInput.value = "";
│   │   → Vacía el textarea después de enviar.
│   │
│   ├── messageInput.style.height = "auto";
│   │   → Devuelve el textarea a su altura inicial.
│   │
│   ├── if (selectedFile)
│   │   → Comprueba si existe un archivo seleccionado.
│   │
│   │   ├── console.log("Archivo adjunto:", selectedFile.name);
│   │   │   → Muestra el nombre del archivo en la consola.
│   │   │
│   │   ├── console.log("Tipo:", selectedFile.type);
│   │   │   → Muestra el tipo MIME del archivo.
│   │   │
│   │   └── console.log("Tamaño:", selectedFile.size);
│   │       → Muestra el tamaño del archivo en bytes.
│   │
│   │   → Actualmente el archivo no se sube a ningún servidor
│   │     ni API.
│   │   → El código deja preparado el punto donde posteriormente
│   │     podrá incorporarse el envío real del archivo.
│   │
│   ├── removeSelectedFile();
│   │   → Elimina el archivo seleccionado.
│   │   → Limpia la previsualización.
│   │   → Limpia el input de archivos.
│   │
│   └── closeMobileMenu();
│       → Cierra el menú lateral si estamos en tablet o móvil.
│
│
├── FUNCIÓN resetChat()
│
│   ├── chatApp.classList.remove("chat-has-messages");
│   │   → Elimina el estado "chat iniciado".
│   │   → El CSS vuelve a mostrar el estado inicial de la interfaz.
│   │   → La barra de consulta vuelve a su posición central.
│   │
│   ├── messagesContainer.innerHTML = "";
│   │   → Vacía completamente el contenedor de mensajes.
│   │   → Actualmente no se crean mensajes mediante JavaScript,
│   │     pero deja preparado el contenedor para futuras funciones.
│   │
│   ├── messageInput.value = "";
│   │   → Borra cualquier texto que haya quedado escrito.
│   │
│   ├── messageInput.style.height = "auto";
│   │   → Restablece la altura del campo de texto.
│   │
│   ├── removeSelectedFile();
│   │   → Elimina cualquier archivo que estuviera seleccionado.
│   │   → También elimina su previsualización.
│   │
│   └── closeMobileMenu();
│       → Cierra el menú lateral en tablet y móvil.
│
│
├── EVENTO DEL CAMPO DE TEXTO
│
│   └── messageInput.addEventListener("input", autoResizeTextarea);
│       → Detecta cada cambio producido al escribir.
│       → Cada vez que el usuario escribe, ejecuta autoResizeTextarea().
│       → Hace que el textarea crezca automáticamente.
│
│
├── EVENTO DE TECLADO
│
│   └── messageInput.addEventListener("keydown", function (event) {
│
│       → Detecta las teclas pulsadas dentro del textarea.
│
│       ├── if (event.key === "Enter" && !event.shiftKey)
│       │   → Comprueba si se ha pulsado Enter.
│       │   → !event.shiftKey significa que NO se está pulsando Shift.
│       │
│       │   → Por tanto:
│       │       ENTER       = enviar
│       │       SHIFT+ENTER = nueva línea
│       │
│       ├── event.preventDefault();
│       │   → Evita el comportamiento normal del Enter.
│       │   → Impide que Enter cree una nueva línea cuando se quiere enviar.
│       │
│       └── sendMessage();
│           → Ejecuta la función de envío.
│
│   });
│
│
├── EVENTO DEL BOTÓN ENVIAR
│
│   └── sendButton.addEventListener("click", sendMessage);
│       → Detecta el clic sobre el botón de enviar.
│       → Ejecuta sendMessage().
│       → Se puede enviar:
│           • pulsando el botón
│           • pulsando Enter
│           • con texto
│           • con un archivo
│           • con texto + archivo
│
│
├── EVENTO "NUEVA CONVERSACIÓN"
│
│   └── newChatButton.addEventListener("click", function (event) {
│
│       → Detecta el clic sobre "Nueva conversación".
│
│       ├── event.preventDefault();
│       │   → Evita que el enlace <a href="#"> recargue o
│       │     desplace la página.
│       │
│       └── resetChat();
│           → Reinicia completamente el estado visual del chat.
│
│   });
│
│
├── EVENTO DEL BOTÓN HISTORIAL / CONVERSACIONES
│
│   └── chatHistoryButton.addEventListener("click", function () {
│
│       → Detecta cuándo se pulsa el botón "Historial de conversaciones".
│
│       ├── if (window.innerWidth > 1024 && sidebarToggle.checked)
│       │   → Comprueba que estamos en escritorio.
│       │   → Comprueba que la barra lateral está actualmente plegada.
│       │
│       └── sidebarToggle.checked = false;
│           → Desmarca el checkbox que controla el sidebar.
│           → Al desmarcarlo, el CSS devuelve la barra a su anchura normal.
│           → Por tanto, al pulsar el icono de conversaciones con el
│             sidebar plegado, este se despliega.
│
│       → En tablet y móvil no interviene.
│       → Si el sidebar ya está desplegado, no realiza ningún cambio.
│
│   });
│
│
├── EVENTO DE SELECCIÓN DE ARCHIVOS
│
│   └── fileInput.addEventListener("change", handleFileSelection);
│       → Detecta cuándo el usuario selecciona un archivo.
│       → Ejecuta handleFileSelection().
│       → Guarda el archivo en selectedFile.
│       → Genera automáticamente su previsualización.
│
│
├── EVENTO CAMBIO DE TAMAÑO DE VENTANA
│
│   └── window.addEventListener("resize", function () {
│
│       → Detecta cuando cambia el tamaño de la ventana.
│       → Es especialmente importante al pasar de escritorio
│         a tablet/móvil o viceversa.
│
│       ├── if (window.innerWidth > 1024)
│       │   → Comprueba si volvemos a un tamaño superior a 1024 px.
│       │
│       └── sidebarToggle.checked = false;
│           → Si estamos en escritorio, fuerza el cierre del
│             estado del menú móvil.
│
│   });
│
│
└── EVENTOS DE LOS ENLACES DEL HISTORIAL
│
└── document.querySelectorAll(".chat-history-link")
→ Busca TODOS los enlaces del historial.

```
    └── .forEach(function (link) {
        → Recorre cada enlace encontrado.

        └── link.addEventListener("click", function () {
            → Detecta cuándo se pulsa una conversación.

            └── closeMobileMenu();
                → Si estamos en tablet/móvil,
                  cierra el menú lateral después de seleccionar
                  una conversación.
        });

    }); */


/* JAVASCRIPT
│
├── 1. CONECTA CON EL HTML
│   └── querySelector()
│       → Encuentra los elementos que necesita controlar.
│
├── 2. CONTROLA EL TEXTAREA
│   └── autoResizeTextarea()
│       → Hace crecer el campo según escribimos.
│       → Limita su altura máxima a 180 px.
│
├── 3. CONTROLA LOS ARCHIVOS
│   ├── handleFileSelection()
│   │   → Detecta el archivo seleccionado.
│   │
│   ├── createFilePreview()
│   │   → Genera la previsualización.
│   │
│   ├── formatFileSize()
│   │   → Formatea el tamaño del archivo.
│   │
│   └── removeSelectedFile()
│       → Elimina el archivo y su previsualización.
│
├── 4. CONTROLA EL MENÚ
│   └── closeMobileMenu()
│       → Cierra el sidebar en tablet/móvil.
│
├── 5. CONTROLA EL ENVÍO
│   └── sendMessage()
│       → Comprueba si existe texto o archivo.
│       → Activa .chat-has-messages.
│       → Limpia el campo.
│       → Procesa temporalmente los datos del archivo.
│       → Elimina el archivo seleccionado.
│       → Cierra el menú.
│
├── 6. REINICIA EL CHAT
│   └── resetChat()
│       → Devuelve la interfaz a su estado inicial.
│       → También elimina cualquier archivo seleccionado.
│
├── 7. CONTROLA EL TECLADO
│   └── Enter
│       → Envía.
│
│   └── Shift + Enter
│       → Salto de línea.
│
├── 8. CONTROLA LOS BOTONES
│   ├── Enviar
│   └── Nueva conversación
│
├── 9. CONTROLA EL RESPONSIVE
│   └── resize
│       → Mantiene cerrado el menú móvil al volver a escritorio.
│
├── 10. CONTROLA EL HISTORIAL
│   ├── Botón "Historial de conversaciones"
│   │   → En escritorio, si el sidebar está plegado,
│   │     lo despliega al pulsarlo.
│   │
│   └── Enlaces de conversaciones
│       → En tablet/móvil, cierran el menú lateral
│         al seleccionar una conversación.
│
└── 11. PREPARA FUTURA INTEGRACIÓN CON ARCHIVOS
└── selectedFile
→ Mantiene temporalmente el objeto File seleccionado.
→ Actualmente el archivo solo se identifica y registra
en la consola al enviar.
→ La subida real a servidor o API queda pendiente
de una futura implementación.
*/