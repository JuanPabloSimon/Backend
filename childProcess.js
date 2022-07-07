const { generarNumeros } = require("./src/utils/getRandomNumber");

process.on("message", (cant) => {
  let numeros = generarNumeros(cant);
  process.send(numeros);
});
