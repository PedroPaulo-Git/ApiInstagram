const fs = require('fs');
const path = require('path');
const axios = require('axios');
const express = require('express');
const app = express();
// Middleware CORS melhorado
const cors = require('cors');
app.use(cors({
  origin: ['http://localhost:3000', 'https://espiafacil.com.br'],
  methods: ['GET'],
  allowedHeaders: ['Content-Type'],
  credentials: true
}));

// Rota otimizada para buscar informações do perfil
app.get("/api/instagram-profile-pic/:username", async (req, res) => {
  try {
    const { username } = req.params;
    
    // 1. Buscar dados do perfil
    const profileResponse = await axios.get(
      `https://instagram-scraper-api2.p.rapidapi.com/v1/info?username_or_id_or_url=${username}`,
      {
        headers: {
          "x-rapidapi-key": "07f8ca038amshb9b7481a48db93ap121322jsn2d474082fbff",
          "x-rapidapi-host": "instagram-scraper-api2.p.rapidapi.com",
        },
      }
    );
    
    const profileData = profileResponse.data.data;
    if (!profileData || !profileData.profile_pic_url_hd) {
      return res.status(404).json({ 
        status: "error", 
        message: "Perfil não encontrado" 
      });
    }
    
    // 2. Buscar a imagem do perfil e converter para base64
    const imageResponse = await axios({
      url: profileData.profile_pic_url_hd,
      method: 'GET',
      responseType: 'arraybuffer'
    });
    
    const base64Image = Buffer.from(imageResponse.data, 'binary').toString('base64');
    const contentType = imageResponse.headers['content-type'];
    const imageDataUrl = `data:${contentType};base64,${base64Image}`;
    
    // 3. Retornar os dados do perfil com a Data URL da imagem
    res.json({
      status: "success",
      id: profileData.id,
      username: profileData.username,
      full_name: profileData.full_name,
      profile_pic_url: imageDataUrl
    });
    
  } catch (error) {
    console.error('Erro no proxy:', error);
    res.status(500).json({
      status: "error",
      message: error.response?.data?.message || "Erro interno do servidor"
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
      // Mapeia os seguidores e prepara a lista para enviar
      const followers = await Promise.all(
        response.data.data.items.slice(0, 10).map(async (f) => {
          // Para cada seguidor, buscamos a imagem do perfil
          const imageResponse = await axios({
            url: f.profile_pic_url, // URL da foto do perfil
            method: 'GET',
            responseType: 'arraybuffer', // Fazendo o fetch como array de bytes
          });

          // Cria um Buffer e converte para um formato que o front-end possa usar
          const imageBuffer = Buffer.from(imageResponse.data, 'binary');
          const imageBase64 = imageBuffer.toString('base64');
          const imageUrl = `data:${imageResponse.headers['content-type']};base64,${imageBase64}`;

          return {
            username: f.username,
            full_name: f.full_name,
            profile_pic_url: imageUrl,  // URL da imagem convertida para Base64
          };
        })
      );

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
