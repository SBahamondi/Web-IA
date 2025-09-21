// server.js
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('public')); // Sirve archivos de frontend desde la carpeta "public"

// Configuración segura de Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// Endpoint para generar recetas
app.post('/generar-receta', async (req, res) => {
  try {
    const { ingredientes } = req.body;
    const prompt = `
Eres un chef creativo y amigable. Tu tarea es crear una receta
simple y rápida basada en una lista de ingredientes.

Ingredientes disponibles: "${ingredientes}".

Por favor, responde con el siguiente formato, y solo con este formato:

**Nombre del Plato:** [Un nombre creativo para el plato]
**Ingredientes Adicionales:** [Una lista corta de 2 o 3 ingredientes comunes como sal, aceite o pimienta]
**Pasos:** [Una lista numerada de pasos muy simples y claros para preparar la receta]
    `;

    const result = await model.generateContent(prompt);
    const receta = result.response.text();

    res.json({ receta: receta.trim() });
  } catch (error) {
    res.status(500).json({ error: 'Error al generar la receta.' });
  }
});

app.listen(port, () => {
  console.log(`¡Chef IA listo para cocinar en http://localhost:${port}!`);
});