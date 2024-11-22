const offset = 0;
const limit = 10;
const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;

//função para converter a lista de 
function convertPokemonToHtml(pokemon) {
    return `
        <li class="pokemon">
                <span class="number">#001</span>
                <span class="name">${pokemon.name}</span>
                <div class="detail">
                    <ol class="types">
                        <li class="type">grass</li>
                        <li class="type">poison</li>
                    </ol>
                    <img src="https://img.pokemondb.net/sprites/home/normal/bulbasaur.png" alt="${pokemon.name}">
                </div>
            </li>
    `
}


//utilizando a biblioteca client http FETCH API para trabalhar com o json do endpoint POKEAPI
//fazedo requisição utilizando o fetch  
fetch(url)
    //o then permite manipularmos a "response" da requisição que realizamos. Obs.: o ".then",".catch" e ".finally" são usados para trabalhar com a resposta do "fetch(url),  que é uma "promisse". "
    .then(function (response) {
        //usando o ".json()" na response para visualizar o stream em formato "json"
        return response.json()
    })
    .then(function (jsonBody) {
        return jsonBody.results
    })
    //este ".then" está utlizando o return do ".then" acima que retornou o body em fromato "json"
    .then(function (pokemonList) { 
        console.log(pokemonList);

        for(let i = 0;i < pokemonList.length; i++) {
            const pokemon = pokemonList[i];
            const LiPokemon = convertPokemonToHtml(pokemon);
            const OlPokemon = document.getElementById("pokemonList");
            OlPokemon.innerHTML += LiPokemon;
        }

    })
    // o ".catch" está capturando possivel resposta de erro para manipularmos 
    .catch(function (error) {
        console.log(error);
    })
    //o ".finally" indica o fim da requisição com, ou sem, erro.
    .finally(function () {
        console.log("requisição concluída");
    })

const x = 10 + 10;
console.log(x);