const axios = require('axios');
const cheerio = require('cheerio');

const getArticles = async () => {
  const articles = [];

  const response = await axios.get(
    global._url
  );
  const html = response.data;

  const $ = cheerio.load(html);
  $('li.lx-stream__post-container', html).each(function () {
    const latestList = $('.lx-stream-post-body li', this);
    if(latestList.length > 0) {
      return;
    }
    const time = $('.qa-post-auto-meta', this).text();
    const title = $('h3 .lx-stream-post__header-text', this).text();
    const breaking = $('article.lx-stream-post--breaking', this).length;
    let body = [];

    $('.lx-stream-post-body p', this).each(function () {
      body.push($(this).text());
    });

    const link = $('.lx-stream-post-body a', this);
    if(link.text().includes('follow us')) {
      global._url = link.attr('href')
    }

    let images = [];

    $('.lx-media-asset__image', this).each(function () {
      let img = $('img', this);
      img = img[0].attribs;
      const imgWidths = JSON.parse(img['data-widths']);
      img = img['data-src'].replace('{width}', imgWidths[imgWidths.length - 1]);

      images.push(img);
    });

    articles.push({
      time,
      title,
      hasImages: Boolean(images.length),
      isBreaking: Boolean(breaking),
      body,
      images,
    });
  });

  return articles;
};

module.exports = getArticles;
