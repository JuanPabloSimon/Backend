const { generarNumeros } = require("./src/utils/getRandomNumber");

process.on("message", (num) => {
  let numeros = generarNumeros(1000000);
  process.send(numeros);
});
