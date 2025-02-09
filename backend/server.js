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
    const profileResponse = await axios.get(`https://instagram-scraper-api2.p.rapidapi.com/v1/info?username_or_id_or_url=${username}`, {
      headers: {
        "x-rapidapi-key": "07f8ca038amshb9b7481a48db93ap121322jsn2d474082fbff",
        "x-rapidapi-host": "instagram-scraper-api2.p.rapidapi.com",
      }
    });

    // 2. Verificar resposta
    if (!profileResponse.data?.data?.profile_pic_url_hd) {
      return res.status(404).json({ 
        status: "error", 
        message: "Perfil não encontrado" 
      });
    }

    // 3. Buscar imagem diretamente (sem salvar)
    const imageResponse = await axios({
      url: profileResponse.data.data.profile_pic_url_hd,
      method: 'GET',
      responseType: 'stream'
    });

    // 4. Definir headers para o cliente
    res.set({
      'Content-Type': imageResponse.headers['content-type'],
      'Cache-Control': 'public, max-age=86400', // Cache de 24h
      'Access-Control-Expose-Headers': 'Content-Type'
    });

    // 5. Pipe direto da resposta
    imageResponse.data.pipe(res);

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
