const fs = require("fs");
const path = require("path");
const axios = require("axios");
const express = require("express");
const app = express();

// Middleware CORS melhorado
const cors = require("cors");
app.use(
  cors({
    origin: ["http://localhost:3000", "https://espiafacil.com.br","https://espiafacil.info"],
    methods: ["GET"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  })
);
//GET LOCALIZATION
// app.get("/api/location", async (req, res) => {
//   try {
//     const response = await axios.get("https://ipinfo.io/json?token=e40c53e27a59ce");
//     res.json(response.data);
//     console.log(response.data)
//   } catch (error) {
//     console.error("Erro ao buscar localização:", error);
//     res.status(500).json({ message: "Erro ao obter localização" });
//   }
// });



// Rota otimizada para buscar informações do perfil
app.get("/api/instagram-profile-pic/:username", async (req, res) => {
  try {
    const { username } = req.params;

    // 1. Buscar dados do perfil
    const profileResponse = await axios.get(
      `https://instagram-scraper-api2.p.rapidapi.com/v1/info?username_or_id_or_url=${username}`,
      {
        headers: {
          "x-rapidapi-key":
            "6914148d4emsh72559e87eeaa511p1a0915jsn704c1eaf771f",
          "x-rapidapi-host": "instagram-scraper-api2.p.rapidapi.com",
        },
      }
    );

    const profileData = profileResponse.data.data;
    //console.log(profileData);
    if (!profileData || !profileData.profile_pic_url_hd) {
      return res.status(404).json({
        status: "error",
        message: "Perfil não encontrado",
      });
    }

    // 2. Buscar a imagem do perfil e converter para base64
    const imageResponse = await axios({
      url: profileData.profile_pic_url_hd,
      method: "GET",
      responseType: "arraybuffer",
    });

    const base64Image = Buffer.from(imageResponse.data, "binary").toString(
      "base64"
    );
    const contentType = imageResponse.headers["content-type"];
    const imageDataUrl = `data:${contentType};base64,${base64Image}`;

    // 3. Retornar os dados do perfil com a Data URL da imagem
    res.json({
      status: "success",
      id: profileData.id,
      username: profileData.username,
      full_name: profileData.full_name,
      profile_pic_url: imageDataUrl,
    });
  } catch (error) {
    console.error("Erro no proxy:", error);
    res.status(500).json({
      status: "error",
      message: error.response?.data?.message || "Erro interno do servidor",
    });
  }
});
// FETCH FOLLOWERS
app.get("/api/instagram-followers/:username", async (req, res) => {
  const username = req.params.username;
  console.log(`Buscando seguidores para: ${username}`);

  const encodedParams = new URLSearchParams();
  encodedParams.set("username_or_url", `https://www.instagram.com/${username}/`);
  encodedParams.set("data", "followers");
  encodedParams.set("amount", "6");
  encodedParams.set("start_from", "0");

  const options = {
    method: "POST",
    url: "https://instagram-scraper-stable-api.p.rapidapi.com/get_ig_user_followers.php",
    headers: {
      "x-rapidapi-key": "6914148d4emsh72559e87eeaa511p1a0915jsn704c1eaf771f",
      "x-rapidapi-host": "instagram-scraper-stable-api.p.rapidapi.com",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: encodedParams,
  };

  try {
    const response = await axios.request(options);
    console.log("Resposta da API recebida:", response.data);

    if (response.data && response.data.users) {
      const followers = response.data.users.map((f) => ({
        username: f.username,
        full_name: f.full_name,
        profile_pic_url: f.profile_pic_url,
      }));

      res.json({ status: "success", followers });
    } else {
      console.warn(`Nenhum seguidor encontrado para: ${username}`);
      res.status(404).json({ status: "error", message: "Nenhum seguidor encontrado." });
    }
  } catch (error) {
    console.error("Erro ao buscar seguidores:", error.message);
    res.status(500).json({ status: "error", message: "Erro ao buscar seguidores do Instagram." });
  }
});


// 🔹 Proxy para buscar Highlights e a primeira imagem do destaque
app.get("/api/instagram-highlights/:username", async (req, res) => {
  const username = req.params.username;

  try {
    console.log(`🔍 Buscando highlights para: ${username}`);

    // 1️⃣ Primeiro Fetch: Pegando Highlights do usuário
    const highlightsResponse = await axios.post(
      "https://instagram-scraper-stable-api.p.rapidapi.com/get_ig_user_highlights.php",
      `username_or_url=https://www.instagram.com/${username}/`,
      {
        headers: {
          "x-rapidapi-key": "6914148d4emsh72559e87eeaa511p1a0915jsn704c1eaf771f",
          "x-rapidapi-host": "instagram-scraper-stable-api.p.rapidapi.com",
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const highlightsData = highlightsResponse.data;
    console.log("📌 Dados de highlights:", JSON.stringify(highlightsData, null, 2));

    if (!highlightsData || highlightsData.length === 0 || !highlightsData[0].node) {
      return res.status(404).json({ message: "Nenhum highlight encontrado." });
    }


    // Pegando o primeiro highlight ID
   
    const highlightId = highlightsData[0].node.id;
    console.log(`🎯 Highlight ID obtido: ${highlightId}`);


 if (!highlightId) {
      return res.status(404).json({ message: "ID do highlight não encontrado." });
    }
    // 2️⃣ Segundo Fetch: Pegando histórias do primeiro Highlight
    const storiesResponse = await axios.post(
      "https://instagram-scraper-stable-api.p.rapidapi.com/get_highlights_stories.php",
      `highlight_id=${encodeURIComponent(highlightId)}`,
      {
        headers: {
          "x-rapidapi-key": "6914148d4emsh72559e87eeaa511p1a0915jsn704c1eaf771f",
          "x-rapidapi-host": "instagram-scraper-stable-api.p.rapidapi.com",
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const storiesData = storiesResponse.data;
    console.log("📸 Stories Data:", JSON.stringify(storiesData, null, 2));


    if (!storiesData.items || storiesData.items.length === 0) {
      return res.status(404).json({ message: "Nenhuma história encontrada." });
    }

    // Pegando a primeira imagem do primeiro highlight
    const thumbnailUrl = storiesData.items[0].img_versions2.candidates[0].url;

    console.log("🔗 URL da Thumbnail:", thumbnailUrl);

    // 3️⃣ Fazer o download da imagem e converter para Base64
    const imageResponse = await axios.get(thumbnailUrl, {
      responseType: "arraybuffer",
    });

    const imageBuffer = Buffer.from(imageResponse.data, "binary");
    const imageBase64 = imageBuffer.toString("base64");
    const contentType = imageResponse.headers["content-type"];
    const base64Image = `data:${contentType};base64,${imageBase64}`;

    res.json({
      highlightId,
      thumbnailBase64: base64Image,
    });
  } catch (error) {
    console.error("❌ Erro ao buscar highlights:", error);
    res.status(500).json({ message: "Erro ao obter highlights" });
  }
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
