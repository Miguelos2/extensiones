const display = document.createElement('div');
display.style.position = 'fixed';
display.style.top = '50%'; // Centra verticalmente
display.style.right = '10px'; // Mantene el contenedor a la derecha de la pantalla. 
display.style.transform = 'translateY(-50%)'; // Ajusta el contenedor para que esté perfectamente centrado asi es fácil marcar 
display.style.backgroundColor = 'rgba(0,0,0,0.7)';
display.style.color = 'white';
display.style.padding = '8px';
display.style.borderRadius = '8px';
display.style.fontSize = '14px';
display.style.zIndex = '9999';
display.style.display = 'flex';
display.style.alignItems = 'center';
display.style.flexDirection = 'column';
document.body.appendChild(display);

const topContainer = document.createElement('div');
topContainer.style.display = 'flex';
topContainer.style.alignItems = 'center';
display.appendChild(topContainer);

// Icono principal (favicon o icon.png)
const image = document.createElement('img');
image.style.width = '24px';
image.style.height = '24px';
image.style.marginRight = '8px';
image.style.cursor = 'pointer';
topContainer.appendChild(image);

// Función para obtener el favicon de la página
function getFavicon() {
  const faviconTag = document.querySelector("link[rel='icon'], link[rel='shortcut icon']");
  return faviconTag ? faviconTag.href : '/icon.png';
}
image.src = getFavicon();

const textDisplay = document.createElement('span');
topContainer.appendChild(textDisplay);

// Contenedor de botones adicionales
const buttonContainer = document.createElement('div');
buttonContainer.style.display = 'flex';
buttonContainer.style.gap = '6px';
buttonContainer.style.marginLeft = '8px';
topContainer.appendChild(buttonContainer);

// Crear botones con funciones específicas
const goToTopButton = createButton('˄', 'Ir al inicio', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
const goToBottomButton = createButton('˅', 'Ir al final', () => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }));
const resetButton = createButton('🔄', 'Resetear memorias', resetMemories);

// Agregar botones al contenedor
buttonContainer.appendChild(goToTopButton);
buttonContainer.appendChild(goToBottomButton);
buttonContainer.appendChild(resetButton);

let storedMemories = [];
const memoriesContainer = document.createElement('div');
memoriesContainer.style.marginTop = '8px';
memoriesContainer.style.textAlign = 'left';
memoriesContainer.style.maxWidth = '200px';
memoriesContainer.style.wordWrap = 'break-word';
display.appendChild(memoriesContainer);

image.addEventListener('click', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPercent = docHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / docHeight) * 100)) : NaN;
  const displayValue = isNaN(scrollPercent) ? '-' : scrollPercent.toFixed(2) + '%';

  const { text, element } = getNearbyText(30);

  if (storedMemories.length >= 3) {
    storedMemories.shift();
  }
  storedMemories.push({ percentage: displayValue, text, element });

  updateStoredMemories();
});

function updateStoredMemories() {
  memoriesContainer.innerHTML = '';

  storedMemories.forEach((memory, index) => {
    const memoryEntry = document.createElement('div');
    memoryEntry.textContent = `🔹 ${index + 1}: ${memory.percentage} - ${memory.text}`;
    memoryEntry.style.cursor = 'pointer';
    memoryEntry.style.textDecoration = 'underline';
    memoryEntry.style.color = '#FFD700';

    memoryEntry.addEventListener('click', () => {
      if (memory.element) {
        memory.element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });

    memoriesContainer.appendChild(memoryEntry);
  });
}

function getNearbyText(maxChars) {
  const elements = document.elementsFromPoint(window.innerWidth / 2, window.innerHeight / 2);
  let textCollected = '';
  let foundElement = null;

  for (let el of elements) {
    if (el.tagName === 'P' || el.tagName === 'SPAN' || el.tagName === 'DIV' || el.tagName === 'LI') {
      let text = el.innerText.trim();
      if (text) {
        textCollected += text + ' ';
        if (!foundElement) foundElement = el;
        if (textCollected.length >= maxChars) break;
      }
    }
  }

  return { text: textCollected.substring(0, maxChars), element: foundElement };
}

function resetMemories() {
  storedMemories = [];
  updateStoredMemories();
}

// Función para crear un botón con emoji
function createButton(icon, tooltip, action) {
  const button = document.createElement('button');
  button.innerHTML = icon;
  button.style.border = 'none';
  button.style.background = 'transparent';
  button.style.cursor = 'pointer';
  button.style.fontSize = '18px';
  button.style.color = 'white';
  button.style.padding = '2px';
  button.style.display = 'flex';
  button.style.alignItems = 'center';

  button.title = tooltip;
  button.addEventListener('click', action);

  return button;
}

let isDarkMode = true;

function toggleDisplayTheme() {
  isDarkMode = !isDarkMode;
  display.style.backgroundColor = isDarkMode ? 'rgba(0,0,0,0.7)' : 'white';
  display.style.color = isDarkMode ? 'white' : 'black';
}

display.addEventListener('dblclick', toggleDisplayTheme);
window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPercent = docHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / docHeight) * 100)) : NaN;
  textDisplay.textContent = `${isNaN(scrollPercent) ? '-' : scrollPercent.toFixed(2)}%`;
});
