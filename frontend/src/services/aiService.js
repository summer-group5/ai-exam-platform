export async function generateExam(topic) {
  const res = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'gemma',
      prompt: `
Create a 5 question multiple choice exam about: ${topic}
Return JSON only.
      `,
      stream: false
    })
  });

  const data = await res.json();
  return data.response;
}