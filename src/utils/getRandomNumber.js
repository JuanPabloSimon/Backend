function GetRandomNumber() {
  return Math.floor(Math.random() * (1000 - 1 + 1)) + 1;
}

function generarNumeros(cantidad) {
  let numeros = [];

  for (let index = 0; index < cantidad; index++) {
    let valor = GetRandomNumber();
    let numero = numeros.find((element) => element.numero == valor);
    if (numero) {
      let numeroUpdated = {
        numero: numero.numero,
        cantidadVeces: numero.cantidadVeces + 1,
      };
      let numerosUpdated = numeros.filter(
        (element) => element.numero !== valor
      );
      numerosUpdated.push({
        numero: numeroUpdated.numero,
        cantidadVeces: numeroUpdated.cantidadVeces,
      });
      numeros = numerosUpdated;
    } else {
      let newNumber = { numero: valor, cantidadVeces: 1 };

      numeros.push(newNumber);
    }
  }

  return numeros;
}

module.exports = { generarNumeros };
