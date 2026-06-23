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

Return ONLY valid JSON in this format:

[
  {
    "title": "question here",
    "options": ["A", "B", "C", "D"],
    "correctAnswer": "A"
  }
]

Rules:
- Return exactly 5 multiple choice questions
- Include 4 options
- Include correct answer
- no explanations
- no markdown
- ONLY JSON


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