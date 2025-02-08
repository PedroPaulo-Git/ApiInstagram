const express = require("express");
const axios = require("axios");
const cors = require("cors");
const helmet = require("helmet");

const app = express();

// Helmet e CORS
app.use(helmet());
app.use(cors());

// Rota da API para buscar detalhes do usuário do Instagram
app.get("/api/user/:username", async (req, res) => {
  const username = req.params.username;
  console.log(`Recebida solicitação para buscar dados do usuário: ${username}`);

  try {
    const response = await axios.get(
      `https://instagram191.p.rapidapi.com/v4/user-details-by-username?username=${username}`,
      {
        headers: {
          "X-RapidAPI-Host": "instagram191.p.rapidapi.com",
          "X-RapidAPI-Key": "6fd7e57a76msha10f59af253aab5p131b0fjsnc4948829518a",
        },
      }
    );

    console.log("Resposta recebida da API:", response.data);

    if (response.data && response.data.data) {
      res.json({
        status: "success",
        data: response.data.data,
      });
    } else {
      console.warn(`Nenhum dado encontrado para o usuário: ${username}`);
      res.status(404).json({
        status: "error",
        message: "Usuário não encontrado ou dados inválidos.",
      });
    }
  } catch (error) {
    console.error("Erro ao buscar usuário:", error.message);

    if (error.response) {
      console.error("Detalhes do erro:", error.response.data);
    }

    res.status(500).json({
      status: "error",
      message: "Erro ao buscar usuário.",
    });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
