const fs = require("fs");
const path = require("path");
const axios = require("axios");
const express = require("express");
const app = express();

// Middleware CORS melhorado
const cors = require("cors");
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://espiafacil.com.br",
      "https://espiafacil.info",
      "https://esp1afacil.shop",
      "https://instaviewpro.site"
    ],
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

app.get("/api/instagram-profile-pic/:username", async (req, res) => {
  try {
    const { username } = req.params;

    // 1. Buscar dados do perfil usando a nova API



    //V3 !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

    // const profileResponse = await axios.post(
    //   'https://instagram-scraper-stable-api.p.rapidapi.com/ig_get_fb_profile_v3.php',
    //   `username_or_url=${username}`,
    //   {
    //     headers: {
    //       "x-rapidapi-key": "6914148d4emsh72559e87eeaa511p1a0915jsn704c1eaf771f",
    //       "x-rapidapi-host": "instagram-scraper-stable-api.p.rapidapi.com",
    //       "Content-Type": "application/x-www-form-urlencoded"
    //     }
    //   }
    // );

    
    const profileResponse = await axios.post(
      'https://instagram-scraper-stable-api.p.rapidapi.com/ig_get_fb_profile.php ', // API original
      `username_or_url=${username}&data=basic`, // Incluindo 'data=basic'
      {
        headers: {
          "x-rapidapi-key": "6914148d4emsh72559e87eeaa511p1a0915jsn704c1eaf771f",
          "x-rapidapi-host": "instagram-scraper-stable-api.p.rapidapi.com",
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }
    );
    

    const profileData = profileResponse.data;
    
    if (!profileData || !profileData.hd_profile_pic_url_info?.url) {
      return res.status(404).json({
        status: "error",
        message: "Perfil não encontrado",
      });
    }

    // 2. Buscar a imagem do perfil e converter para base64
    const imageResponse = await axios({
      url: profileData.hd_profile_pic_url_info.url,
      method: "GET",
      responseType: "arraybuffer",
    });

    const base64Image = Buffer.from(imageResponse.data, "binary").toString("base64");
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
  encodedParams.set(
    "username_or_url",
    `https://www.instagram.com/${username}/`
  );
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
    // console.log("Resposta da API recebida:", response.data);

    if (response.data && response.data.users) {
      response.data.users.forEach(user => {
        console.log({
          username: user.username,
          // full_name: user.full_name,
          id: user.id,
          // profile_pic_url: user.profile_pic_url
        });
      });
    }
    
    if (response.data && response.data.users) {
      const followers = await Promise.all(
        response.data.users.map(async (f) => {
          const profilePicUrl = f.profile_pic_url;
          let base64Image = ""; // Valor padrão (string vazia)

          try {
            // Baixar a imagem
            const imageResponse = await axios.get(profilePicUrl, {
              responseType: "arraybuffer",
            });

            // Converter para Base64
            const imageBase64 = Buffer.from(
              imageResponse.data,
              "binary"
            ).toString("base64");
            const contentType =
              imageResponse.headers["content-type"] || "image/jpeg"; // Fallback
            base64Image = `data:${contentType};base64,${imageBase64}`;
          } catch (error) {
            console.error("Erro ao baixar imagem:", error.message);
            // Opcional: Definir uma imagem padrão em Base64
            base64Image =
              "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wcAAgAB/1h8JAAAAABJRU5ErkJggg=="; // Imagem placeholder
          }

          return {
            username: f.username,
            full_name: f.full_name,
            profile_pic_base64: base64Image, // Sempre preenchido
          };
        })
      );

      res.json({ status: "success", followers });
    } else {
      console.warn(`Nenhum seguidor encontrado para: ${username}`);
      res
        .status(404)
        .json({ status: "error", message: "Nenhum seguidor encontrado." });
    }

  } catch (error) {
    console.error("Erro ao buscar seguidores:", error.message);
    if (error.response && error.response.status === 429) {
      return res.status(429).json({
        status: "error",
        message: "Limite de requisições excedido",
      });
    }
    res.status(500).json({
      status: "error",
      message: "Erro ao buscar seguidores do Instagram.",
    });
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
          "x-rapidapi-key":
            "6914148d4emsh72559e87eeaa511p1a0915jsn704c1eaf771f",
          "x-rapidapi-host": "instagram-scraper-stable-api.p.rapidapi.com",
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    const highlightsData = highlightsResponse.data;
    // console.log(
    //   "📌 Dados de highlights:",
    //   JSON.stringify(highlightsData, null, 2)
    // );

    // Verificação de erro na resposta
    if (highlightsData.error) {
      return res.status(404).json({ message: highlightsData.error });
    }

    // Verificação para garantir que há highlights e o primeiro highlight possui um nó
    if (
      !Array.isArray(highlightsData) ||
      highlightsData.length === 0 ||
      !highlightsData[0].node
    ) {
      return res.status(404).json({ message: "Nenhum highlight encontrado." });
    }

    // 2️⃣ Pegando o ID do primeiro highlight
    const highlightId = highlightsData[0].node.id;
    console.log(`🎯 Highlight ID obtido: ${highlightId}`);

    if (!highlightId) {
      return res
        .status(404)
        .json({ message: "ID do highlight não encontrado." });
    }

    // 3️⃣ Segundo Fetch: Pegando histórias do primeiro Highlight
    const storiesResponse = await axios.post(
      "https://instagram-scraper-stable-api.p.rapidapi.com/get_highlights_stories.php",
      new URLSearchParams({ highlight_id: highlightId }).toString(),
      {
        headers: {
          "x-rapidapi-key":
            "6914148d4emsh72559e87eeaa511p1a0915jsn704c1eaf771f",
          "x-rapidapi-host": "instagram-scraper-stable-api.p.rapidapi.com",
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const storiesData = storiesResponse.data;
    console.log(
      "📦 Dados do primeiro response ITEMS:",
      JSON.stringify(
        storiesResponse.data.items[0].image_versions2.candidates[0].url,
        null,
        2
      )      
    );
    
    if (!storiesData.items || storiesData.items.length === 0) {
      console.error("Nenhum item encontrado nos stories.");
      return res.status(404).json({ message: "Nenhuma história encontrada." });
    }
    
    const firstStory = storiesData.items[0];
    
    if (!firstStory.image_versions2?.candidates?.[0]?.url) {
      console.error("Nenhuma imagem encontrada para o primeiro story.");
      return res.status(502).json({ message: "Dados inesperados da API do Instagram" });
    }
    // console.log(storiesData.items);
    // 🔍 Verificação PROFUNDA dos dados
    if (!storiesData?.items?.[0]?.image_versions2?.candidates?.[0]?.url) {
      console.error("Estrutura de dados inválida:", storiesData);
      return res
        .status(502)
        .json({ message: "Dados do Instagram em formato inesperado" });
    }
    // 4️⃣ Pegando a primeira imagem do primeiro highlight
    const isValidResponse = (
      storiesData?.items?.[0]?.image_versions2?.candidates?.[0]?.url
    );
    
    const alternativeThumbnail =
      highlightsData[0].node.cover_media.cropped_image_version.url;

    const thumbnailUrl = isValidResponse
      ? storiesData.items[0].image_versions2.candidates[0].url
      : alternativeThumbnail;

    console.log("🔗 URL válida:", thumbnailUrl);

    console.log("🔧 Highlight ID Enviado:", highlightId);
    // 5️⃣ Fazer o download da imagem e converter para Base64
    const imageResponse = await axios.get(thumbnailUrl, {
      responseType: "arraybuffer",
    });

    const imageBuffer = Buffer.from(imageResponse.data, "binary");
    const imageBase64 = imageBuffer.toString("base64");
    const contentType = imageResponse.headers["content-type"];
    const base64Image = `data:${contentType};base64,${imageBase64}`;

    // 6️⃣ Retornar o ID do highlight e a imagem em Base64
    
    res.json({
      status: "success",
      highlightId: highlightId,
      thumbnailBase64: base64Image,
    });
  } catch (error) {
    console.error("❌ Erro detalhado:", error.stack); // Log completo do erro
    res.status(500).json({
      message: "Falha crítica no servidor",
      error: error.message,
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
