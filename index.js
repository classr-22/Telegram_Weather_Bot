const axios = require("axios");
const { Telegraf } = require("telegraf");
const { message } = require('telegraf/filters');
require('dotenv').config()


const TOKEN = process.env.TOK;
const bot = new Telegraf(TOKEN);
const Url =
  `http://api.weatherstack.com/current?access_key=${process.env.ACESS_KEY}&query="`;

const fetchData = async (cityName) => {
  const res = await axios.get(`${Url + cityName}`);
  return res;
};

bot.on(message('sticker'), (ctx) => ctx.reply('👍'));

bot.start((ctx) => {
  ctx.reply("Hello im weather bot ! Just write your city name ......");
});

bot.hears('hi', (ctx) => ctx.reply('Hey there ! Hello im weather bot ! Just write your city name ......'));

bot.on("text", async (ctx) => {

  fetchData(ctx.message.text)
  .then(function({data})
  {
    if (data.success === false) {
        ctx.reply("Enter a valid city name:");
      } else {
        const { current, location } = data;
        const weatherStatus = current.weather_descriptions[0];
    
        ctx.reply(
          `🌆 City:${location.name}\n-\n 🌡 Temperature ${
            current.temperature
          }°\n-\n❓ Weather status: ${
            (weatherStatus.toLowerCase().includes("clear") === true && "☀️") ||
            (weatherStatus.toLowerCase().includes("sunny") === true && "☀️") ||
            (weatherStatus.toLowerCase().includes("cloud") === true && "☁️") ||
            (weatherStatus.toLowerCase().includes("overcast") === true && "☁️") ||
            (weatherStatus.toLowerCase().includes("rain") === true && "🌧") ||
            (weatherStatus.toLowerCase().includes("snow") === true && "❄️")
          } ${current.weather_descriptions[0]}`
        );
      }
  })
  
});

bot.launch();