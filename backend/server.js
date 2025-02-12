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

// Rota otimizada para buscar informações do perfil
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
    url: "https://instagram-scraper-stable-api.p.rapidapi.com/get_ig_user_followers_v2.php",
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
            const imageBase64 = Buffer.from(imageResponse.data, "binary").toString("base64");
            const contentType = imageResponse.headers["content-type"] || "image/jpeg"; // Fallback
            base64Image = `data:${contentType};base64,${imageBase64}`;
          } catch (error) {
            console.error("Erro ao baixar imagem:", error.message);
            // Opcional: Definir uma imagem padrão em Base64
            base64Image = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wcAAgAB/1h8JAAAAABJRU5ErkJggg=="; // Imagem placeholder
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
    url: "https://instagram-scraper-stable-api.p.rapidapi.com/get_ig_user_followers_v2.php",
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
      // Mapear os seguidores e processar as imagens para Base64
      const followers = await Promise.all(
        response.data.users.map(async (f) => {
          const profilePicUrl = f.profile_pic_url;
          
          // Fazer o download da imagem do perfil do seguidor e converter para Base64
          const imageResponse = await axios.get(profilePicUrl, {
            responseType: "arraybuffer",
          });

          const imageBuffer = Buffer.from(imageResponse.data, "binary");
          const imageBase64 = imageBuffer.toString("base64");
          const contentType = imageResponse.headers["content-type"];
          const base64Image = `data:${contentType};base64,${imageBase64}`;
return {
  username: f.username,
  full_name: f.full_name,
  profile_pic_base64: base64Image, // A imagem em Base64
};

        })
      );

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
    console.log("📌 Dados de highlights:", JSON.stringify(highlightsData, null, 2));

    // Verificação de erro na resposta
    if (highlightsData.error) {
      return res.status(404).json({ message: highlightsData.error });
    }

    // Verificação para garantir que há highlights e o primeiro highlight possui um nó
    if (!Array.isArray(highlightsData) || highlightsData.length === 0 || !highlightsData[0].node) {
      return res.status(404).json({ message: "Nenhum highlight encontrado." });
    }
    

    // 2️⃣ Pegando o ID do primeiro highlight
    const highlightId = highlightsData[0].node.id;
    console.log(`🎯 Highlight ID obtido: ${highlightId}`);

    if (!highlightId) {
      return res.status(404).json({ message: "ID do highlight não encontrado." });
    }

    // Remover o prefixo "highlight:" do ID
    const cleanHighlightId = highlightId.replace("highlight:", "");
    console.log("🛠 ID Limpo:", cleanHighlightId);

    // 3️⃣ Segundo Fetch: Pegando histórias do primeiro Highlight
    const storiesResponse = await axios.post(
      "https://instagram-scraper-stable-api.p.rapidapi.com/get_highlights_stories.php",
      `highlight_id=${encodeURIComponent(cleanHighlightId)}`,
      {
        headers: {
          "x-rapidapi-key": "6914148d4emsh72559e87eeaa511p1a0915jsn704c1eaf771f",
          "x-rapidapi-host": "instagram-scraper-stable-api.p.rapidapi.com",
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const storiesData = storiesResponse.data;

    // Verificação se há histórias no highlight
    if (!storiesData.items || storiesData.items.length === 0) {
      return res.status(404).json({ message: "Nenhuma história encontrada." });
    }

    // 4️⃣ Pegando a primeira imagem do primeiro highlight
    const thumbnailUrl = storiesData.items[0]?.img_versions2?.candidates?.[0]?.url;
    if (!thumbnailUrl) {
      return res.status(404).json({ message: "Nenhuma imagem encontrada." });
    }

    console.log("🔗 URL da Thumbnail:", thumbnailUrl);

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
      highlightId: cleanHighlightId,
      thumbnailBase64: base64Image,
    });

  } catch (error) {
    console.error("❌ Erro ao buscar highlights:", error.response?.data || error.message);
    res.status(500).json({ message: "Erro ao obter highlights" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
