const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;


app.get('/api/hello', async (req, res) => {
  const visitorName = req.query.visitor_name || 'Visitor';
  const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;


  try {
    const geoResponse = await axios.get(`http://ip-api.com/json/${clientIp}`);
    const { city } = geoResponse.data;


    const weatherResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
      params: {
        q: city,
        appid: 'YOUR_OPENWEATHERMAP_API_KEY', // Replace with your OpenWeatherMap API key
        units: 'metric'
      }
    });
    const { temp } = weatherResponse.data.main;

    res.json({
      client_ip: clientIp,
      location: city,
      greeting: `Hello, ${visitorName}!, the temperature is ${temp} degrees Celsius in ${city}`
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve data' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
