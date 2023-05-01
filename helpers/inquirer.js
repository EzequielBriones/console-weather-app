const inquirer = require("inquirer");
require("colors");

// This are the options the menu shows the user.
const preguntas = [
  {
    type: "list",
    name: "opcion",
    message: "What would you like to do?",
    choices: [
      {
        value: 1,
        name: `${"1.".green} Search city`,
      },
      {
        value: 2,
        name: `${"2.".green} History`,
      },
      {
        value: 0,
        name: `${"0.".green} Exit`,
      },
    ],
  },
];

// This function contains the menu
const inquirerMenu = async () => {
  console.clear();
  console.log("=====================".green);
  console.log("  Choose an option".white);
  console.log("=====================\n".green);

  // This shows the questions to the user.
  const { opcion } = await inquirer.prompt(preguntas);

  return opcion;
};

// This shows the user the pause message.
const pause = async () => {
  const question = [
    {
      type: "input",
      name: "enter",
      message: `Presione ${"ENTER".green} para continuar`,
    },
  ];

  console.log("\n");
  await inquirer.prompt(question);
};

// This reads the new task we just added.
const readInput = async (message) => {
  const question = [
    {
      type: "input",
      name: "desc",
      message,
      validate(value) {
        if (value.length === 0) {
          return "Por favor ingrese un valor";
        }
        return true;
      },
    },
  ];

  const { desc } = await inquirer.prompt(question);
  return desc;
};

// This gets the task we will delete based on ID
const listPlaces = async (places = []) => {
  const choices = places.map((place, i) => {
    const idx = `${i + 1}.`.green;
    return {
      value: place.id,
      name: `${idx} ${place.name}`,
    };
  });

  choices.unshift({
    value: "0",
    name: "0.".green + "Cancelar",
  });

  const questions = [
    {
      type: "list",
      name: "id",
      message: "Select place:",
      choices,
    },
  ];

  const { id } = await inquirer.prompt(questions);
  return id;
};

// This asks us if we are sure we want to delete the task.
const confirmar = async (message) => {
  const question = [
    {
      type: "confirm",
      name: "ok",
      message,
    },
  ];

  const { ok } = await inquirer.prompt(question);
  return ok;
};

// Shows the tasks list in a checkbox format, so we can complete them or not.
const mostrarListadoChecklist = async (tareas = []) => {
  const choices = tareas.map((tarea, i) => {
    const idx = `${i + 1}.`.green;
    return {
      value: tarea.id,
      name: `${idx} ${tarea.desc}`,
      checked: tarea.completadoEn ? true : false,
    };
  });

  const pregunta = [
    {
      type: "checkbox",
      name: "ids",
      message: "Seleccione",
      choices,
    },
  ];

  const { ids } = await inquirer.prompt(pregunta);
  return ids;
};

module.exports = { inquirerMenu, pause, readInput, listPlaces, confirmar, mostrarListadoChecklist };
