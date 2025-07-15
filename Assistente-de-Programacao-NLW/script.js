const apiKeyInput = document.getElementById('apiKey')
const topicSelect = document.getElementById('topicSelect')
const questionInput = document.getElementById('questionInput')
const askButton = document.getElementById('askButton')
const aiResponse = document.getElementById('aiResponse')
const form = document.getElementById('form')

const markdownToHTML = (text) => {
    const converter = new showdown.Converter()
    return converter.makeHtml(text)
}

const perguntarAI = async (question, topic, apiKey) => {
    const model = "gemini-2.0-flash"
    const geminiURL = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`
    const pergunta = `
## Especialidade
Você é um assistente de estudos com foco em programação e tecnologia. Sua especialidade é o tema: ${topic}.

## Tarefa
Responda perguntas com explicações claras, curtas e bem estruturadas, usando Markdown.

## Regras
- Use **título com \`##\** para apresentar o conceito.
- Explique com listas curtas e organizadas.
- Destaque termos importantes com **negrito**.
- Utilize blocos de código com \`\`\` para exemplos.
- Finalize com uma dica usando 💡 ou 📌.
- Limite a resposta a 5000 caracteres.
- Se não souber, diga "Não sei". Não invente.
- Se a pergunta for fora da área de tecnologia, diga "Pergunta fora do escopo de programação."
- A data atual é: ${new Date().toLocaleDateString()}.## Especialidade
Você é um assistente de estudos com foco em programação e tecnologia. Sua especialidade é o tema: ${topic}.

## Tarefa
Responda perguntas com explicações claras, curtas e bem estruturadas, usando Markdown.

## Regras
- Use **título com \`##\** para apresentar o conceito.
- Explique com listas curtas e organizadas.
- Destaque termos importantes com **negrito**.
- Utilize blocos de código com \`\`\` para exemplos.
- Finalize com uma dica usando 💡 ou 📌.
- Limite a resposta a 5000 caracteres.
- Se não souber, diga "Não sei". Não invente.
- Se a pergunta for fora da área de tecnologia, diga "Pergunta fora do escopo de programação."
- A data atual é: ${new Date().toLocaleDateString()}.
    ---
    Aqui está a pergunta do usuário: ${question}
  `

    const contents = [{
        role: "user",
        parts: [{
            text: pergunta
        }]
    }]

    const tools = [{
        google_search: {}
    }]

    // chamada API
    const response = await fetch(geminiURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            contents,
            tools
        })
    })

    const data = await response.json()
    return data.candidates[0].content.parts[0].text
}

const enviarFormulario = async (event) => {
    event.preventDefault()
    const apiKey = apiKeyInput.value
    const topic = topicSelect.value
    const question = questionInput.value

    if (apiKey == '' || topic == '' || question == '') {
        alert('Por favor, preencha todos os campos')
        return
    }

    askButton.disabled = true
    askButton.textContent = 'Perguntando...'
    askButton.classList.add('loading')

    try {
        const text = await perguntarAI(question, topic, apiKey)
        aiResponse.querySelector('.response-content').innerHTML = markdownToHTML(text)
        aiResponse.classList.remove('hidden')
    } catch (error) {
        console.log('Erro: ', error)
        aiResponse.querySelector('.response-content').innerHTML = "Houve um erro na resposta da IA."
        aiResponse.classList.remove('hidden')
    } finally {
        askButton.disabled = false
        askButton.textContent = "Perguntar"
        askButton.classList.remove('loading')
    }
}

form.addEventListener('submit', enviarFormulario)