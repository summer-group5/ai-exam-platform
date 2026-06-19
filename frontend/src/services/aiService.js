export async function generateExamTasks(prompt) {
  const response = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gemma4',
      prompt: `
Generate exam questions.

Rules:
- Return exactly 5 multiple choice questions
- Include 4 options
- Include correct answer
- Topic: ${prompt}

Format:

Question:
Options:
Correct answer:
`,
      stream: false
    })
  });

  if (!response.ok) {
    throw new Error('AI request failed');
  }

  const data = await response.json();

  return data.response;
}