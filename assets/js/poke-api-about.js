const pokeApiDetails = {};

/**função usada para usar a classe modelo pokemon e com as referências da API do PokeAPI*/
function convertPokeApiDetailToPokemonDetailed() {

}


/*função responsável por puxar as informações de Breeding da API  PokeAPI */
pokeApiDetails.breedingInfo = (pokemonName) => {
    const url = `https://pokeapi.co/api/v2/pokemon-species/${pokemonName}`; 

    return fetch(url)    
        .then(function (response) {
            return response.json();
        })
        .then(function (responseJson) { 
        console.log(responseJson);
        const genderRate = responseJson.gender_rate;
        const groups = responseJson.egg_groups.map(groupSlot => groupSlot.name);
        
        const eggGroup = groups[0];
        const eggCicle = groups[1];

        const femaleRate = genderRate === -1 ? 0 : (genderRate / 8) * 100;
        const maleRate = genderRate === -1 ? 0 : 100 - femaleRate;
    
        const gender = `♀️ ${femaleRate.toFixed(1)}% / ♂️ ${maleRate.toFixed(1)}%`;
        // const eggCicle = eggGroups.map(group => group.name).join(", ");

        return {
            gender,
            eggGroup,
            eggCicle
        }
    })
}

pokeApiDetails.getSpecie = (urlSpecies) => {
    const url = urlSpecies;

    /**requisição HTTP para Poke APi retornar uma Promise com o corpo da requiseção(em JSON) */
    return fetch(url)
        /**tratamento da Promise para aconverte-la em um objeto javascript */
        .then(function (response) {
            return response.json();
        })
        .then(function (responseJson) {
            return responseJson.genera[7].genus;
        })
        .catch(function (error) {
            console.error(`Erro ao solicitar a specie de pokemon: ${error}`);
        })
}

pokeApiDetails.getDetailsPokemon = (nameParam) => {
    const url = `https://pokeapi.co/api/v2/pokemon/${nameParam}`;

    return fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (responseJson) {

            /**buscando a altura do poekmon */
            const heightPokemon = responseJson.height;

            /**buscando o peso do poekmon */
            const weightPokemon = responseJson.weight;

            /**buscando o nome do poekmon */
            const namePokemon = responseJson.name;

            /**buscando a ID do pokemon */
            const idPokemon = responseJson.id

            /**buscando a imagem frontal do pokemon no json da Poke API */
            console.log(responseJson);
            const spritePokemon = responseJson.sprites.front_default;
 
            /**buscando os tipos do pokemon */
            const typesPokemon = responseJson.types.map((typeSlot) => typeSlot.type.name); 

            /**selecionando o tipo principal do pokemon para definir a cor de fundo da página */
            const [type] = typesPokemon;

            /**buscando as habilidades do pokemon */
            const abilitiesPokemon = responseJson.abilities.map(abilitieSlot => abilitieSlot.ability.name);          
           
            /**buscando a informação da specie de pokemon em outra url do Poke API*/
            return pokeApiDetails.getSpecie(responseJson.species.url)
                .then(function (response) {
                    const speciePokemon = response;
                    
                    console.log(`Specie: ${speciePokemon}`);
                    console.log(`Name: ${namePokemon}`);
                    console.log(`Sprite: ${spritePokemon}`);
                    console.log(`Types: ${typesPokemon}`); 
                    console.log(`Type: ${type}`);
                    console.log(`ID: ${idPokemon}`); 
                    console.log(`Height: ${heightPokemon}`); 
                    console.log(`Weight: ${weightPokemon}`); 
                    console.log(`Abilities: ${abilitiesPokemon}`);
                }),
                pokeApiDetails.breedingInfo(namePokemon)
                .then(function (response) {
                    const genderPokemon = response.gender;
                    const eggGroups = response.eggGroup;
                    const eggCicle = response.eggCicle;

                    console.log(`Gender: ${genderPokemon}`);
                    console.log(`Egg Groups: ${eggGroups}`);
                    console.log(`Egg Cicle: ${eggCicle}`);  
                })
        })
}
