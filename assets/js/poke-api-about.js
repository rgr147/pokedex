const pokeApiDetails = {};

//Função responsável por criar o o objeto pokemon com todas as informações necessárias, usando como base o objeto json recebido da função que a chamou.
function convertPokeApiDetailToPokemonDetailed(jsonBody /**name,id,types,type,sprite,height,weight,abilities*/) {
    const poke = new PokemonDetailed()
    
    poke.name = jsonBody.name;//buscando o nome do pokemon no PokeApi; 
    poke.id = jsonBody.id;//buscando o ID do pokemon no PokeApi;
    const types = jsonBody.types.map((typeSlot) => typeSlot.type.name);//buscando os tipos do pokemon no PokeAPi;
    const [type] = types;//identificando o tipo principal do pokemon
    poke.types = types;
    poke.type = type; 
    poke.sprite = jsonBody.sprites.other.dream_world.front_default; //busanco a imagem do pokemon no PokeApi;
    poke.height = jsonBody.height; //buscando a altura do pokemon no PokeAPI;
    poke.weight = jsonBody.weight;//buscando o peso do pokemon no PokeAPI;
    poke.abilities = jsonBody.abilities.map((abilitiesSlot) => abilitiesSlot.ability.name);//buscando as habilidades do pokemon no pokeApi
    
    // poke.gender = gender;
    // poke.eggGroups = eggGroups;
    // poke.eggCicle = eggCicle;

    return poke;
}

// /*função responsável por puxar as informações de Breeding da API  PokeAPI */
// pokeApiDetails.breedingInfo = (pokemonName) => {
//     const url = `https://pokeapi.co/api/v2/pokemon-species/${pokemonName}`; 

//     return fetch(url)    
//         .then(function (response) {
//             return response.json();
//         })
//         .then(function (responseJson) { 
//         const genderRate = responseJson.gender_rate;
//         const groups = responseJson.egg_groups.map(groupSlot => groupSlot.name);
        
//         const eggGroup = groups[0];
//         const eggCicle = groups[1];

//         const femaleRate = genderRate === -1 ? 0 : (genderRate / 8) * 100;
//         const maleRate = genderRate === -1 ? 0 : 100 - femaleRate;
    
//         const gender = `♀️ ${femaleRate.toFixed(1)}% / ♂️ ${maleRate.toFixed(1)}%`;
//         // const eggCicle = eggGroups.map(group => group.name).join(", ");

//         return {
//             gender,
//             eggGroup,
//             eggCicle
//         }
//     })
// }

// pokeApiDetails.getSpecie = (urlSpecies) => {
//     const url = urlSpecies;

//     /**requisição HTTP para Poke APi retornar uma Promise com o corpo da requiseção(em JSON) */
//     return fetch(url)
//         /**tratamento da Promise para aconverte-la em um objeto javascript */
//         .then(function (response) {
//             return response.json();
//         })
//         .then(function (responseJson) {
//             return responseJson.genera[7].genus;
//         })
//         .catch(function (error) {
//             console.error(`Erro ao solicitar a specie de pokemon: ${error}`);
//         })
// }

// //função reponsável por realizar o get via http com a API PokeAPI e tratar a promise recebida para json
// function getApiDetailsPokemon(namePokemonParam) {
//     const url = `https://pokeapi.co/api/v2/pokemon/${namePokemonParam}`;

//     return fetch(url)
//         .then(function (response) {
//             return response.json();
//         })
//         .then(convertPokeApiDetailToPokemonDetailed)
// }

//função responsável por receber o parametro "name" com o nome do pokemon passado via url e realizar o get via http com a API PokeAPI
pokeApiDetails.getNameParam = (nameParam) => {
    const url = `https://pokeapi.co/api/v2/pokemon/${nameParam}`;
    
    return fetch(url)
    .then(function (response) {

        return response.json();
    })
    .then(function (jsonBody) { 
        return convertPokeApiDetailToPokemonDetailed(jsonBody);
    })
    .then(function (poke) {
        inputDetailsInHtml(poke);
    })
}