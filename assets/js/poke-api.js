
const pokeApi = {}

function convertPokeApiDetailToPokemonSimple(pokeDetail) {
    const pokemon = new PokemonSimple()
    pokemon.number = pokeDetail.id
    pokemon.name = pokeDetail.name

    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)
    const [type] = types

    pokemon.types = types
    pokemon.type = type
    
    pokemon.sprite = pokeDetail.sprites.other.dream_world.front_default

    return pokemon
}

pokeApi.getPokemonDetail = (arrayPokemons) => {
    return fetch(arrayPokemons.url)
        .then((response) => response.json())
        .then(convertPokeApiDetailToPokemonSimple)
}
/*asdasd
/**função responsável por puxar as informações dos pokemons da API Poke API */
pokeApi.getPokemons = (offset, limit) => {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;
    //utilizando a biblioteca client http "FETCH API" para receber os dados da requiseção e, poeteriormente, converter o que é de enteresse em ".json".
    //fazedo requisição utilizando o "fetch"  
    return fetch(url)
    //o then permite manipularmos a "response" da requisição que realizamos. Obs.: o ".then",".catch" e ".finally" são usados para trabalhar com a resposta do "fetch(url),  que é uma "promisse". "
        .then(function (response) {
            //usando o ".json()" na response para visualizar o body, que retornou como readablestream no passo anterior, em formato ".json".
            return response.json();
        })
        .then((jsonBody) => jsonBody.results)
        .then((arrayPokemons) => arrayPokemons.map(pokeApi.getPokemonDetail))
        .then((promises) => Promise.all(promises))
        // .then(pokemonDetails => pokemonDetails)
        .then(pokemonDetails => {
            return pokemonDetails})
        .catch(function (error) {
            console.log(error);
        })
    } 

