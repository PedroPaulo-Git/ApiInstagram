const express = require("express");
const axios = require("axios");
const cors = require("cors");
const helmet = require("helmet");

const app = express();

// Helmet e CORS
app.use(helmet());
const corsOptions = {
  origin: [
    "https://espiafacil.com.br",  // Origem original permitida
    "http://localhost:3000",      // Adiciona o localhost ao CORS para desenvolvimento local
  ], // Permite apenas esse domínio
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Permite os métodos HTTP necessários
  allowedHeaders: ["Content-Type", "Authorization", "x-rapidapi-key"], // Permite esses headers
  credentials: true, // Permite cookies, se necessário
};

app.use(cors(corsOptions));

// FETCH PROFILE IMAGE

app.get("/api/instagram-profile-pic/:username", async (req, res) => {
  const username = req.params.username;
  console.log(`Buscando imagem de perfil para: ${username}`);

  try {
    const response = await axios.get(
      `https://instagram-scraper-api2.p.rapidapi.com/v1/info?username_or_id_or_url=${username}`,
      {
        headers: {
          "x-rapidapi-key":
            "07f8ca038amshb9b7481a48db93ap121322jsn2d474082fbff",
          "x-rapidapi-host": "instagram-scraper-api2.p.rapidapi.com",
        },
      }
    );

    console.log("Resposta da API recebida:", response.data);

    if (
      response.data &&
      response.data.data &&
      response.data.data.profile_pic_url_hd
    ) {
      const imageUrl = response.data.data.profile_pic_url_hd;
      console.log(`Imagem encontrada: ${imageUrl}`);
      res.json({ status: "success", profile_pic_url_hd: imageUrl });
    } else {
      console.warn(`Imagem não encontrada para: ${username}`);
      res
        .status(404)
        .json({ status: "error", message: "Imagem não encontrada." });
    }
  } catch (error) {
    console.error("Erro ao buscar imagem:", error.message);
    res
      .status(500)
      .json({
        status: "error",
        message: "Erro ao buscar imagem do Instagram.",
      });
  }
});

// FETCH FOLLOWERS

app.get("/api/instagram-followers/:username", async (req, res) => {
  const username = req.params.username;
  console.log(`Buscando seguidores para: ${username}`);

  try {
    const response = await axios.get(
      `https://instagram-scraper-api2.p.rapidapi.com/v1/followers?username_or_id_or_url=${username}`,
      {
        headers: {
          "x-rapidapi-key": "07f8ca038amshb9b7481a48db93ap121322jsn2d474082fbff",
          "x-rapidapi-host": "instagram-scraper-api2.p.rapidapi.com",
        },
      }
    );

    console.log("Resposta da API recebida:", response.data);

    if (response.data && response.data.data && response.data.data.items) {
      const followers = response.data.data.items.slice(0, 10).map((f) => ({
        username: f.username,
        full_name: f.full_name,
        profile_pic_url: f.profile_pic_url,
      }));

      console.log("Seguidores encontrados:", followers);
      res.json({ status: "success", followers });
    } else {
      console.warn(`Nenhum seguidor encontrado para: ${username}`);
      res.status(404).json({ status: "error", message: "Nenhum seguidor encontrado." });
    }
  } catch (error) {
    console.error("Erro ao buscar seguidores:", error.message);
    res.status(500).json({
      status: "error",
      message: "Erro ao buscar seguidores do Instagram.",
    });
  }
});

















const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
