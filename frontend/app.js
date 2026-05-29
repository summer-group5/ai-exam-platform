const backendUrl = '/api/message';
const resultEl = document.getElementById('result');
const inputEl = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');

function showResult(text) {
  resultEl.textContent = text;
}

async function sendMessage() {
  const text = inputEl.value.trim();
  if (!text) {
    showResult('Please enter a message before sending.');
    return;
  }

  try {
    showResult('Sending request...');
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });

    const data = await response.json();
    if (!response.ok) {
      showResult(`Error: ${data.error || 'unknown error'}`);
      return;
    }

    showResult(`Backend response:\n${JSON.stringify(data, null, 2)}`);
  } catch (error) {
    showResult(`Network error: ${error.message}`);
  }
}

sendButton.addEventListener('click', sendMessage);
inputEl.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    sendMessage();
  }
});
