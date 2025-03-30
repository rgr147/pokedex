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
    poke.sprite = await pokeApiDetails.getPokemonSprite(poke.name); //busanco a imagem do pokemon no PokeApi;
    
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

    poke.evolves = await pokeApiDetails.checkEvolution(jsonBody.species.url);
    
    return poke;
}


pokeApiDetails.getPokemonSprite = (name) => {
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
//função que formata e retorna os dados sobre evolução de pokemon que tem apenas 1 forma 
pokeApiDetails.getDataEvolves = async (responseJsonEvolves, howManyEvolves) => {
    const data = responseJsonEvolves;

    const howManyEvolvesHas = howManyEvolves;
    const chainEvolves = [];

    let pokemonName = data.chain.species.name;
    let pokemonSprite = await pokeApiDetails.getPokemonSprite(pokemonName);
    let typeEvolves = null;

    if(howManyEvolvesHas == 0) {
        chainEvolves.push({'name':pokemonName,'sprite':pokemonSprite,});
    } else if(howManyEvolvesHas > 1) {

        let levelEvolves = data.chain.evolves_to[0].min_level == undefined ? null : data.chain.evolves_to[0].min_level;

        chainEvolves.push({'name':pokemonName,'sprite':pokemonSprite,'levelEvolves': levelEvolves, typeEvolves,});
        
        for(let i = 0; i < howManyEvolvesHas; i++) {
            pokemonName = data.chain.evolves_to[i].species.name;
            pokemonSprite = await pokeApiDetails.getPokemonSprite(pokemonName);
            levelEvolves = levelEvolves = data.chain.evolves_to[i].min_level == undefined ? null : data.chain.evolves_to[0].min_level;
            
            chainEvolves.push({'name':pokemonName,'sprite':pokemonSprite,'levelEvolves': levelEvolves, 'typeEvolves': typeEvolves,});
        }
    }
    
    return chainEvolves;
}
pokeApiDetails.getDataEvolvesChain = async (responseJsonEvolves) => {
    
    const hasTreeEvolution = responseJsonEvolves.chain.evolves_to[0].evolves_to[0] != undefined;
    const chainEvolves = [];

    let pokemonName = responseJsonEvolves.chain.species.name;
    let pokemonLevelEvolution = responseJsonEvolves.chain.evolves_to[0].evolution_details[0].min_level;
    let pokemonSprite = await pokeApiDetails.getPokemonSprite(pokemonName);
    
    if(hasTreeEvolution) {
        chainEvolves.push({'name':pokemonName,'sprite':pokemonSprite,'levelEvolves':pokemonLevelEvolution});

        pokemonName = responseJsonEvolves.chain.evolves_to[0].species.name;
        pokemonLevelEvolution = responseJsonEvolves.chain.evolves_to[0].evolves_to[0].evolution_details[0].min_level;
        pokemonSprite = await pokeApiDetails.getPokemonSprite(pokemonName);
    
        chainEvolves.push({'name':pokemonName,'sprite':pokemonSprite,'levelEvolves':pokemonLevelEvolution});

        pokemonName = responseJsonEvolves.chain.evolves_to[0].evolves_to[0].species.name;
        pokemonLevelEvolution = null;
        pokemonSprite = await pokeApiDetails.getPokemonSprite(pokemonName);

        chainEvolves.push({'name':pokemonName,'sprite':pokemonSprite,'levelEvolves':pokemonLevelEvolution});
    } else {
        chainEvolves.push({'name':pokemonName,'sprite':pokemonSprite,'levelEvolves':pokemonLevelEvolution});

        pokemonName = responseJsonEvolves.chain.evolves_to[0].species.name;
        pokemonLevelEvolution = null;
        pokemonSprite = await pokeApiDetails.getPokemonSprite(pokemonName);
    
        chainEvolves.push({'name':pokemonName,'sprite':pokemonSprite,'levelEvolves':pokemonLevelEvolution});
    }

    return chainEvolves;
}

//função que analisa as evoluções do pokemon.
pokeApiDetails.identifiesEvolutions = async (linkChainEvolution) => {
    const url = linkChainEvolution;

    return fetch(url)
        .then(function(response) {
            return response.json();
        })
        .then(async function(responseJsonEvolves) {

            const hasEvolution = responseJsonEvolves.chain.evolves_to.length ? true : false;
            const howManyEvolves = responseJsonEvolves.chain.evolves_to.length;

            if(!hasEvolution) {
                return await pokeApiDetails.getDataEvolves(responseJsonEvolves, howManyEvolves);
                
            } else if(hasEvolution && howManyEvolves == 1) {
                return await pokeApiDetails.getDataEvolvesChain(responseJsonEvolves);
            } else if(hasEvolution && howManyEvolves > 1) {
   
                return await pokeApiDetails.getDataEvolves(responseJsonEvolves, howManyEvolves);
            }
        })
}



//função que retorna informações sobre evoluções do pokemon
pokeApiDetails.checkEvolution = (urlEspecie) => {
    const url = urlEspecie;

    return fetch(url)
        .then(function(response) {
            return response.json();
        })
        .then(function(responseJson) {
            //passa a url que contém, informações sobre evoluções do pokemon para a função que identifica as evoluções
            return pokeApiDetails.identifiesEvolutions(responseJson.evolution_chain.url);
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

