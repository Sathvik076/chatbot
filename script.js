const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

// API Configuration
const API_KEY = "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";
const API_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "gemma2-9b-it"; // Example: use a valid model name supported by Groq API

function addMessage(text, sender) {
  const msg = document.createElement("div");
  msg.className = `message ${sender}`;
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
  const message = userInput.value.trim();
  if (!message) return;
  addMessage(message, "user");
  userInput.value = "";

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{
          role: "user",
          content: message
        }]
      })
    });

    if (!res.ok) {
      const errorText = await res.text();
      addMessage(`⚠️ Error: API responded with status ${res.status}.`, "bot");
      console.error("API Error:", res.status, errorText);
      return;
    }
    const data = await res.json();
    if (
      !data.choices ||
      !data.choices[0] ||
      !data.choices[0].message ||
      !data.choices[0].message.content
    ) {
      addMessage("⚠️ Error: Unexpected API response format.", "bot");
      console.error("API Response:", data);
      return;
    }
    addMessage(data.choices[0].message.content, "bot");
  } catch (err) {
    addMessage("⚠️ Error: Could not connect to the API or an error occurred.", "bot");
    console.error(err);
  }
}

sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});