const pokeApiDetails = {};

//Função responsável por criar o o objeto pokemon com todas as informações necessárias, usando como base o objeto json recebido da função que a chamou.
async function convertPokeApiDetailToPokemonDetailed(jsonBody /**name,id,types,type,sprite,height,weight,abilities*/) {
    const poke = new PokemonDetailed();
    //dados utilizados na pagina-about
    const types = jsonBody.types.map((typeSlot) => typeSlot.type.name);//buscando os tipos do pokemon no PokeAPi;
    const [type] = types;//identificando o tipo principal do pokemon
    const breeding = await pokeApiDetails.breedingInfo(jsonBody.name);
    const specie = await pokeApiDetails.getSpecie(jsonBody.id);
    poke.name = jsonBody.name;//buscando o nome do pokemon no PokeApi; 
    poke.id = jsonBody.id;//buscando o ID do pokemon no PokeApi;
    poke.types = types;
    poke.type = type; 
    poke.sprite = await pokeApiDetails.getSpritePokemon(poke.name); //busanco a imagem do pokemon no PokeApi;
    
    //dados utilizados na div about    
    poke.height = jsonBody.height; //buscando a altura do pokemon no PokeAPI;
    poke.weight = jsonBody.weight;//buscando o peso do pokemon no PokeAPI;
    poke.abilities = jsonBody.abilities.map((abilitiesSlot) => abilitiesSlot.ability.name);
    poke.gender = breeding.gender;
    poke.eggGroups = breeding.eggGroup;
    poke.eggCicle = breeding.eggCicle;
    poke.specie = specie;

    //dados utilizados na div base stats
    const stats = await pokeApiDetails.calculateTotalBaseStats(jsonBody);
    poke.stats = stats;
    poke.totalPercentage = ((poke.stats.total / 600) * 100).toFixed();
    poke.defenses = await pokeApiDetails.getDataAboutDefenses(jsonBody.types[0].type.url)   

    poke.evolutionChain = await pokeApiDetails.checkEvolution(jsonBody.species.url);

    return poke;
}


pokeApiDetails.getSpritePokemon = (name) => {
    const url = `https://pokeapi.co/api/v2/pokemon/${name}`;

    return fetch(url)
        .then(function(response) {
            return response.json();
        })
        .then(function(responseJson) {
                const hasImage = responseJson.sprites.other.dream_world.front_default;

                if(hasImage) {
                    return responseJson.sprites.other.dream_world.front_default;
                } else {
                    return responseJson.sprites.front_default;
                }
        })
}

//função responsável apenas por criar um objeto apenas com o nome e level do poekmon
pokeApiDetails.describePokemonLevelEvolution = (formName, nivelEvolution, urlSprite) => {
    const pokemonLevel = new Object();

    pokemonLevel["stage"] = formName;
    pokemonLevel["nivel_evolution"] = nivelEvolution;
    pokemonLevel["url_sprite"] = urlSprite;
    
    return pokemonLevel;
}
pokeApiDetails.evolutionStageData = async (hasTreeEvolution, dataPokemon) => {
    const list = [];

    if(dataPokemon.chain.evolves_to == 0) {
        let formName = dataPokemon.chain.species.name;
        let minLevelEvolution = 0;
        let urlSprite = await pokeApiDetails.getSpritePokemon(formName);
        list.push(pokeApiDetails.describePokemonLevelEvolution(formName, minLevelEvolution, urlSprite));    
    } else {

        let formName = dataPokemon.chain.species.name;
        let minLevelEvolution = dataPokemon.chain.evolves_to[0].evolution_details[0].min_level;
        let urlSprite = await pokeApiDetails.getSpritePokemon(formName);
        list.push(pokeApiDetails.describePokemonLevelEvolution(formName, minLevelEvolution, urlSprite));

        try {
            formName = dataPokemon.chain.evolves_to[0].species.name;
            minLevelEvolution = dataPokemon.chain.evolves_to[0].evolves_to[0].evolution_details[0].min_level;
            urlSprite = await pokeApiDetails.getSpritePokemon(formName);  
            list.push(pokeApiDetails.describePokemonLevelEvolution(formName, minLevelEvolution, urlSprite));
        } catch {
            formName = dataPokemon.chain.evolves_to[0].species.name;
            minLevelEvolution;
            urlSprite = await pokeApiDetails.getSpritePokemon(formName);  
            list.push(pokeApiDetails.describePokemonLevelEvolution(formName, minLevelEvolution, urlSprite));

        } finally {
            if(hasTreeEvolution) {
                formName = dataPokemon.chain.evolves_to[0].evolves_to[0].species.name;
                minLevelEvolution;
                urlSprite = await pokeApiDetails.getSpritePokemon(formName);
                list.push(pokeApiDetails.describePokemonLevelEvolution(formName, minLevelEvolution,urlSprite));
            }
        }
    }
        return list;
}
pokeApiDetails.modelEvolutionOtherReasons = async (formName, spriteForm) => {
    const pokemon = new Object();

    pokemon["name"] = formName;
    pokemon["sprite"] = spriteForm;

    return pokemon;
}

pokeApiDetails.randomAountEvolutionStageData = async (dataPokemon, howManyEvolution) => {
    const evolutions = dataPokemon;
    const amount = howManyEvolution;
    const list = [];

    let formName = evolutions.chain.species.name;
    let spriteForm = await pokeApiDetails.getSpritePokemon(formName);
    list.push(await pokeApiDetails.modelEvolutionOtherReasons(formName, spriteForm));

    for(let i = 0; i < amount; i++){
        formName =  evolutions.chain.evolves_to[i].species.name;
        spriteForm = await pokeApiDetails.getSpritePokemon(formName);
        list.push(await pokeApiDetails.modelEvolutionOtherReasons(formName, spriteForm));
    }

    return list;
};

//função que verifica se o pokemon tem evolução e como a evolução acontece
pokeApiDetails.checkIfHasEvolution = async (responseLinkEvolution) => {
    const dataPokemon = responseLinkEvolution;
    const hasEvolution = dataPokemon.chain.evolves_to != "";
    const howManyEvolution = dataPokemon.chain.evolves_to.length;
    try {
        const hasTreeEvolution = dataPokemon.chain.evolves_to[0].evolves_to != "";
        const evolutionByMinLevel = dataPokemon.chain.evolves_to[0].evolution_details[0].min_level != null;
        
        if(hasEvolution) {
            if(evolutionByMinLevel) {
                const evolutionStageData = await pokeApiDetails.evolutionStageData(hasTreeEvolution, responseLinkEvolution);
                console.log(evolutionStageData)
                if(evolutionStageData.length == 3){
                    
                    return insertHtmlWithTreeEvolution(evolutionStageData);
    
                } else if(evolutionStageData.length == 2) {
                    
                    return insertHtmlWithTwoEvolution(evolutionStageData);
                }            
            } else {
                const evolutionStageData = await pokeApiDetails.randomAountEvolutionStageData(dataPokemon, howManyEvolution);
    
                return insertHtmlRandomAmountEvolutions(evolutionStageData);
            }
        }
    } catch {
        const noHasEvolution = responseLinkEvolution.chain.evolves_to.length == 0;
        const evolutionStageData = await pokeApiDetails.evolutionStageData(0, responseLinkEvolution);
        if(noHasEvolution) {
            return insertHtmlRandomAmountEvolutions(evolutionStageData);
        }
    }     
}

//função responsável por retornar o link que contem informações sobre a sequência evolutiva do pokemon
pokeApiDetails.getLinkEvolution = (urlEvolutionChain) => {
    const url = urlEvolutionChain;

    return fetch(url)
        .then(function(response){
            return response.json();
        })
        .then(function(responseJson) {
            return responseJson;
        })
}

//função que retorna informações sobre evoluções do pokemon
pokeApiDetails.checkEvolution = (urlEspecie) => {
    const url = urlEspecie;

    return fetch(url)
        .then(function(response) {//transforma a response do link da specie em json
            return response.json();
        })
        .then(function(responseJson) {//retorna o link que contém informações sobre evoluções do pokemon
            return pokeApiDetails.getLinkEvolution(responseJson.evolution_chain.url);
        })
        .then(function(responseLinkEvolution){//verifica se o pokemon possui evoluções
            return pokeApiDetails.checkIfHasEvolution(responseLinkEvolution);
        })
        
}


//função responsável por receber o dicionário com a lista de relaçãoes sobre as defesas do pokemon e retornar um texto formatado com as informações para ser usado no HTML
pokeApiDetails.formatTextAboutDefenses = (dictRelations) => {
    const dicionario = dictRelations;

    textFormattedForHtml = ``;

    const linesList = [];
    for(let key in dicionario) {
        if(key == "double_damage_from" && dicionario["double_damage_from"] != "") {
            linesList.push("Weak against: "+ dicionario[key])

        } else if (key == "half_damage_from" && dicionario["half_damage_from"] != "") {
            linesList.push("half damage against: "+ dicionario[key])

        } else if (key == "no_damage_from" && dicionario["no_damage_from"] != "")
            linesList.push("Resist against: "+ dicionario[key]);
    }

    for(let i = 0; i < linesList.length; i++) {
        textFormattedForHtml += `<p id="p${i+1}">${linesList[i].split(",").join(", ")}</p> \n`;
    }

    return textFormattedForHtml;
}

//função responsável por puxar do PokeAPI as informações sobre a defesa do pokemon, fraquesas e resistrencias
pokeApiDetails.getDataAboutDefenses = (urlType) => {
    const url = `${urlType}`;

    return fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (responseJson) {
            const relations = responseJson.damage_relations; //variável que recebe o objeto com os dados referente a dano/defesa. 
            
            const dictRelations = [] //dicionário com o nome da key como chave, e a lista de tipos relaciona a key como valor
            const listValidation = []; //lista para armazenar o nome de cada key analisada para tomada de decisão
            // Object.entries para iterar sobre todas as chaves e valoes
            Object.entries(relations).forEach(([key, value]) => {
                if(key in listValidation == false) {
                    const typsList = [] //recebe os tipos relacionados a cada key
                    for(let i = 0; i < value.length; i++) { 
                        typsList.push(value[i].name)
                    }
                    dictRelations[key] = typsList
                }
            })
            textFormattedForHtml = pokeApiDetails.formatTextAboutDefenses(dictRelations)


            return textFormattedForHtml
        })
}

//função para calcular o total do Status Base do pokemon
pokeApiDetails.calculateTotalBaseStats = (jsonBody) => {
    let stats = Object.fromEntries(
        jsonBody.stats.map(statsSlot => [statsSlot.stat.name, statsSlot.base_stat])
    );
    
    let total = 0;
    Object.values(stats).forEach(value => total += value);

    stats["total"] = total;

    return stats;
}

/*função responsável por puxar as informações de Breeding da API  PokeAPI */
pokeApiDetails.breedingInfo = (pokemonName) => {
    const url = `https://pokeapi.co/api/v2/pokemon-species/${pokemonName}`; 

    return fetch(url)    
        .then(function (response) {
            return response.json();
        })
        .then(function (responseJson) {
            //dados utilizados na div about            
            const genderRate = responseJson.gender_rate;
            const groups = responseJson.egg_groups.map(groupSlot => groupSlot.name);
            const eggGroup = groups[0];
            const eggCicle = groups[1];
            const femaleRate = genderRate === -1 ? 0 : (genderRate / 8) * 100;
            const maleRate = genderRate === -1 ? 0 : 100 - femaleRate;
            const gender = `♀️ ${femaleRate.toFixed(1)}% / ♂️ ${maleRate.toFixed(1)}%`;

            return {
                gender,
                eggGroup,
                eggCicle
            }
        })
}

pokeApiDetails.getSpecie = (idPokemon) => {
    const url = `https://pokeapi.co/api/v2/pokemon-species/${idPokemon}/`;
    
    // requisição HTTP para Poke APi retornar uma Promise com o corpo da requiseção(em JSON)
    return fetch(url)
        // tratamento da Promise para aconverte-la em um objeto javascript 
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

//função responsável por receber o parametro "name" com o nome do pokemon passado via url e realizar o get via http com a API PokeAPI
pokeApiDetails.getDataPokeApi = (nameParam) => {
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

