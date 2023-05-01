const fs = require("fs");
const axios = require("axios");

class Searches {
  history = [];

  dbPath = "./db/database.json";

  constructor() {
    //TODO: leer db si existe
    this.readDB();
  }

  // These getters allow for a more readable and clean code
  get capitalizedHistory() {
    return this.history.map((place) => {
      // first we separate the cities per word
      let words = place.split(" ");
      // then we iterate trough them, add the toUpperCase to the first letter, then concate the rest of the word to it
      words = words.map((w) => w[0].toUpperCase() + w.substring(1));

      // we return the jointed words
      return words.join(" ");
    });
  }

  get paramsMapbox() {
    return {
      access_token: process.env.MAPBOX_KEY,
      limit: 5,
      // proximity: ip,
      language: "es",
    };
  }

  get paramsWeather() {
    return {
      appid: process.env.OPENWEATHER_KEY,
      units: "metric",
    };
  }

  async city(place = "") {
    try {
      // Peticion http
      const instance = axios.create({
        baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${place}.json`,
        params: this.paramsMapbox,
      });

      const res = await instance.get();
      return res.data.features.map((place) => ({
        id: place.id,
        name: place.place_name,
        lng: place.center[0],
        lat: place.center[1],
      }));
    } catch (error) {
      console.log(error);
    }
  }

  async weather(lat, lon) {
    try {
      const instance = axios.create({
        baseURL: "https://api.openweathermap.org/data/2.5/weather",
        params: { ...this.paramsWeather, lat, lon },
      });

      const res = await instance.get();
      const { weather, main } = res.data;
      return {
        desc: weather[0].description,
        max: main.temp_max,
        min: main.temp_min,
        temp: main.temp,
      };
    } catch (error) {
      console.log(error);
    }
  }

  addHistory(places = "") {
    //TODO prevent duplicates

    if (this.history.includes(places.toLowerCase())) {
      return;
    }
    this.history = this.history.splice(0, 5);

    this.history.unshift(places.toLowerCase());

    // save in db
    this.saveDB();
  }

  saveDB() {
    const payload = {
      history: this.history,
    };

    fs.writeFileSync(this.dbPath, JSON.stringify(payload));
  }

  readDB() {
    if (!fs.existsSync(this.dbPath)) return null;

    const info = fs.readFileSync(this.dbPath, { encoding: "utf-8" });
    const data = JSON.parse(info);

    this.history = data.history;
  }
}

module.exports = Searches;
