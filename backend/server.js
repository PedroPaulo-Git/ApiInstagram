const express = require('express');
const axios = require('axios');
const cors = require('cors');
const helmet = require('helmet');

const app = express();

// Helmet e CORS
app.use(helmet());
app.use(cors());

// Endpoint da API
app.get('/api/user/:username', async (req, res) => {
  const username = req.params.username;

  try {
    // Fazendo a requisição usando axios
    const response = await axios.get(
      `https://instagram191.p.rapidapi.com/v4/user-details-by-username?username=${username}`,
      {
        headers: {
          'X-RapidAPI-Host': 'instagram191.p.rapidapi.com',
          'X-RapidAPI-Key': 'e9b32b11efmsh61c3992491c9be9p1319a0jsn3179f3d855a3',
        },
      }
    );

    const data = response.data;

    if (data && data.data) {
      res.json({
        status: 'success',
        data: data.data,
      });
    } else {
      res.json({
        status: 'error',
        message: 'Usuário não encontrado ou dados inválidos.',
      });
    }
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({
      status: 'error',
      message: 'Erro ao buscar usuário.',
    });
  }
});
// app.get('/api/proxy-image', async (req, res) => {
//     const imageUrl = req.query.url;
    
//     try {
//       const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
//       res.set('Content-Type', 'image/jpeg'); // ou o tipo correto de imagem
//       res.send(imageResponse.data);
//     } catch (error) {
//       res.status(500).send('Erro ao carregar a imagem');
//     }
//   });
  
// Iniciar o servidor
app.listen(5000, () => console.log('Server running on http://localhost:5000'));
