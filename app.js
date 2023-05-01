require("dotenv").config();
const { inquirerMenu, pause, readInput, listPlaces } = require("./helpers/inquirer");
const Searches = require("./models/searches");

const main = async () => {
  const searches = new Searches();
  let opt;

  do {
    // Prints the tasks menu
    opt = await inquirerMenu();

    switch (opt) {
      case 1:
        // Mostrar mensaje
        const terms = await readInput("City: ");

        // Buscar los lugares
        const places = await searches.city(terms);

        // Seleccione el lugar
        const id = await listPlaces(places);
        console.log("Searching...".green);

        if (id === "0") continue;

        // get the selected place id
        const selPlace = places.find((p) => p.id === id);

        // Guardar en DB
        searches.addHistory(selPlace.name);

        // Clima
        const weatherLike = await searches.weather(selPlace.lat, selPlace.lng);

        // Desestructuracion de informacion
        let { name, lng, lat } = selPlace;
        let { temp, min, max, desc } = weatherLike;

        // Mostrar resultados
        console.clear();
        console.log("\nCity info\n".green);
        console.log("City:", name.green);
        console.log("Lat:", lat);
        console.log("Lng:", lng);
        console.log("Temperature:", temp);
        console.log("Min:", min);
        console.log("Max:", max);
        console.log("Looks like:", desc.green);

        break;

      case 2:
        // agregar historial
        searches.capitalizedHistory.forEach((places, i) => {
          const idx = `${i + 1}`.green;
          console.log(`${idx} ${places}`);
        });

        break;
    }

    await pause();
  } while (opt !== 0);
};

main();
