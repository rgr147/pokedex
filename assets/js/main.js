const IdPokemonListFromHtml = document.getElementById("pokemonList");
const loadMoreButton = document.getElementById("loadMoreButton");
/**trazendo todas as <li> que foram geradas dinamicamente dentro da <ol> através da ID da <ol> */
const openAboutPokemon = document.getElementById("pokemonList");

const maxRecortds = 151
let limit = 10;
let offset = 0;

function loadPokemonItens(offset,limit) {
    //função para converter a lista com os detalhes dos pokemons da função "getPokemons()" para converter em trecho HTML
    function convertPokemonToHtml(pokemon) {
        return `
            <li class="pokemon ${pokemon.type}">
                <span class="number">#${pokemon.number}</span>
                <span class="name">${pokemon.name}</span>
                <div class="detail">
                    <ol class="types">
                        ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                    </ol>
                    <img src="${pokemon.sprite}" alt="${pokemon.name}">
                </div>
            </li>
        `
    }

    //chamando a função "pokeApi.getPokemons" e passando o Array de retorno da função para a lista "pokemonList", que está definida por default como uma lista vazia
    pokeApi.getPokemons(offset,limit).then(function (pokemonList = []) {         
        //Usando a função "map()" para converter o atual array "pokemonList", que recebeus o dados do Array retornado da função "getPokemons()", em uma nova Array "newHtml" com um trecho HTML editado. No caso, com a função "map()", substituímos a necessidade de usar o "for" para iterar cada item do Array, o "map() já faz essa iteração para cada item por traz dos panos.     
        const newHtml = pokemonList.map(convertPokemonToHtml).join("");
        //chamando a variável que contem o caminho para o elemento HTML que queremos manipular para acrescentar o newHtml
        IdPokemonListFromHtml.innerHTML += newHtml;
    })    
}

loadPokemonItens(offset, limit);

loadMoreButton.addEventListener('click', () => {
    offset += limit;
    
    let maxNextPag = offset+limit;

    if (maxNextPag >= maxRecortds) {

        const newLimit =  maxRecortds - offset;

        loadPokemonItens(offset, newLimit);

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit);
    }
})

/**Identifica qual tag LI foi clicada e para puxar o nome do pokemon e redirecionar para a página-about*/
openAboutPokemon.addEventListener("click", (event) => {
    /**identificando o event do click com o TARGET para saber qual LI que possui a CLASSE POKEMON foi a clicada. CLOSEST identifica a LI mais próxima do click */
    if (event.target.closest("li.pokemon")){
        const pokemon = event.target.closest("li.pokemon");
        /**Guardando apenas o nome do pokemon existente na LI.POKEMON que foi clicada */
        const pokemonName = pokemon.querySelector(".name").textContent;
        /**abrindo uma página nova e passando um parametro que recebera o nome do pokemon como string */
        window.location.href = `pagina-about.html?name=${pokemonName}`;
    }
});
