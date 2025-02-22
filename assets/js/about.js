
/**teste para saber se a página está lendo o arquivo about.js*/
console.log(">>> ...rodando about.js. Olá Mundo!");



/** receebendo o nome do pokemon que está contido no url como string */
const url = new URLSearchParams(window.location.search);
const nameParam = url.get("name");

console.log(nameParam);

pokeApiDetails.getDetailsPokemon(nameParam);