const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const getArticles = require('./articles');

const PORT = process.env.PORT || 3000;

global._url = 'https://www.bbc.co.uk/news/live/world-europe-60923158';

const app = express();

app.get('/', (req, res) => {
  res.json('Welcome to my Climate Change News API');
});

app.get('/news', async (req, res) => {
  try {
    const articles = await getArticles();
    res.json(articles);
  } catch (e) {
    throwError(res);
  }
});

app.get('/news-latest', async (req, res) => {
  try {
    const articles = await getArticles();

    res.json(articles[0]);
  } catch (e) {
    throwError(res);
  }
});

app.get('/summary', async (req, res) => {
  try {
    const response = await axios.get(global._url);
    const html = response.data;
    const $ = cheerio.load(html);

    const summary = [];

    $('ol.lx-c-summary-points li').each(function () {
      summary.push($(this).text());
    });

    res.json(summary);
  } catch (e) {
    throwError(res);
  }
});

function throwError(res) {
  console.error("Couldn't load the BBC website.");
  res.status(400);
  res.json("Couldn't load the BBC website.");
}

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
