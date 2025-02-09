const fs = require('fs');
const path = require('path');
const axios = require('axios');
const express = require('express');
const app = express();

// Middleware para configurar CORS
const cors = require('cors');
app.use(cors());

// Função para baixar a imagem do perfil
const downloadImage = async (url, filename) => {
  const pathToSave = path.join(__dirname, 'images', filename);
  const writer = fs.createWriteStream(pathToSave);
  
  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream',
  });

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on('finish', () => resolve(pathToSave));
    writer.on('error', reject);
  });
};

// FETCH PROFILE IMAGE & GET USERNAME & FULL NAME
app.get("/api/instagram-profile-pic/:username", async (req, res) => {
  const username = req.params.username;
  console.log(`Buscando imagem de perfil para: ${username}`);

  try {
    const response = await axios.get(
      `https://instagram-scraper-api2.p.rapidapi.com/v1/info?username_or_id_or_url=${username}`,
      {
        headers: {
          "x-rapidapi-key": "07f8ca038amshb9b7481a48db93ap121322jsn2d474082fbff",
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
      const id = response.data.data.id;
      const fullName = response.data.data.full_name;
      const username = response.data.data.username;

      // Baixar a imagem e salvar no servidor
      const imagePath = await downloadImage(imageUrl, `${username}_profile.jpg`);
      console.log(`Imagem salva em: ${imagePath}`);

      res.json({
        status: "success",
        profile_pic_url: `/images/${username}_profile.jpg`,  // A URL que o cliente vai acessar
        id,
        full_name: fullName,
        username,
      });
    } else {
      console.warn(`Imagem não encontrada para: ${username}`);
      res.status(404).json({ status: "error", message: "Imagem não encontrada." });
    }
  } catch (error) {
    console.error("Erro ao buscar imagem:", error.message);
    res.status(500).json({
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

// Servir as imagens baixadas
app.use('/images', express.static(path.join(__dirname, 'images')));

// Iniciar o servidor


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
