// Reemplaza con tu propia clave de API de OpenAI (esto se puede mejorar con un backend, de manera qe vaya a buscar la key ahi
const openAiApiKey = 'sk-proj-xxxxxxxxxxxxxxx';

// Función para generar el resumen usando la API de OpenAI
const generateSummaryWithChatGPT = async (text) => {
  const apiUrl = 'https://api.openai.com/v1/chat/completions';

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${openAiApiKey}`,
  };

  const body = JSON.stringify({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: 'Eres un asistente que resume textos de forma clara y breve.',
      },
      {
        role: 'user',
        content: `Genera un resumen breve de este texto:\n\n${text}`,
      }
    ],
    max_tokens: 150,
    temperature: 0.5,
  });

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: headers,
      body: body,
    });

    const data = await response.json();

    if (!data.choices || !data.choices[0]) {
      console.error('Respuesta inválida de OpenAI:', data);
      return {
        resumen: 'No se pudo obtener el resumen. Intenta nuevamente más tarde.',
        error: true,
        raw: data
      };
    }

    const summary = data.choices[0].message.content.trim();
    return {
      resumen: summary,
      error: false,
      raw: data
    };
  } catch (error) {
    console.error('Error al generar el resumen:', error);
    return {
      resumen: 'Hubo un error al generar el resumen.',
      error: true,
      exception: error
    };
  }
};


// Cuando el usuario hace clic en "Generar Resumen"
document.getElementById('generate-summary').addEventListener('click', async () => {
  chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
    const tab = tabs[0];
    
    // Verifica si la pestaña es válida antes de proceder
    if (!tab || !tab.id) {
      console.error('No se pudo obtener la pestaña activa');
      return;
    }

    try {
      // Ejecuta el script de extracción de texto en la pestaña activa
      const [result] = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: extractText,
      });

      // Si el resultado está vacío, maneja el caso
      const textToSummarize = result.result || '';
      if (textToSummarize === '') {
        console.error('No se pudo extraer texto de la página');
        return;
      }

      // Generar el resumen usando la API de OpenAI
      const summary = await generateSummaryWithChatGPT(textToSummarize);

      // Mostrar el resumen en el contenedor de la extensión
      document.getElementById('summary-container').innerText = summary.resumen;
    } catch (error) {
      console.error('Error al ejecutar el script:', error);
    }
  });
});

// Función para extraer el texto de la página web
function extractText() {
  return document.body.innerText;  // Extrae todo el texto visible en el cuerpo de la página
}

// document.getElementById('summary-container').innerText = resultado.resumen;
