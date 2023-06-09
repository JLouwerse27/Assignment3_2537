const PAGE_SIZE = 10;
let currentPage = 1;
let pokemons = [];

const updatePaginationDiv = (currentPage, numPages) => {
    $("#pagination").empty();

    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(currentPage + 2, numPages);

    if (currentPage !== 1) {
        $("#pagination").append(
            `<button class="btn btn-primary previousButton" value="${
                currentPage - 1
            }" );">previous</button>`
        );
    }
    for (let i = startPage; i <= endPage; i++) {
        if (i == currentPage) {
            $("#pagination").append(`
      <button class="btn btn-primary page ml-1 numberedButtons" style = "background-color: #99ac21;" value="${i}">${i}</button>
      `);
        } else {
            $("#pagination").append(`
      <button class="btn btn-primary page ml-1 numberedButtons" value="${i}">${i}</button>
      `);
        }
    }

    if (currentPage !== 81) {
        $("#pagination").append(
            `<button class="btn btn-primary page ml-1 nextButton" value="${
                currentPage + 1
            }" );">next</button>`
        );
    }
};

const paginate = async (currentPage, PAGE_SIZE, pokemons) => {
    selected_pokemons = pokemons.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    );

    $("#pokeCards").empty();
    selected_pokemons.forEach(async (pokemon) => {
        const res = await axios.get(pokemon.url);
        $("#pokeCards").append(`
      <div class="pokeCard card" pokeName=${res.data.name}   >
        <h3>${res.data.name.toUpperCase()}</h3> 
        <img src="${res.data.sprites.front_default}" alt="${res.data.name}"/>
        <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#pokeModal">
          More
        </button>
        </div>  
        `);
    });
};

async function fetchPokemonTypes() {
    console.log("gonna fetch");
    let response = await axios.get(
        "https://pokeapi.co/api/v2/type/"
    );
    types = response.data.results;

    let container = document.getElementById('checkboxContainer');
    $(container).empty();
    
    for (i = 0; i < types.length; i++) {
        let checkBox = document.createElement('input');
        checkBox.type = "checkbox";

        let label = document.createElement('label');
        label.textContent = types[i].name + " ";

        container.appendChild(label);
        container.appendChild(checkBox);
    }

}

fetchPokemonTypes();

const setup = async () => {
    // test out poke api using axios here

    $("#pokeCards").empty();
    let response = await axios.get(
        "https://pokeapi.co/api/v2/pokemon?offset=0&limit=810"
    );
    pokemons = response.data.results;

    paginate(currentPage, PAGE_SIZE, pokemons);
    //numPages should be 81
    const numPages = Math.ceil(pokemons.length / PAGE_SIZE);
    updatePaginationDiv(currentPage, numPages);

    //TODO: make into fn
    //$("info").empty();
    //$('info').add(`<h1> Showing ${PAGE_SIZE} out of ${pokemons.length} pokemon. </h1>`);
    $("#info").html(`<h1> Showing ${PAGE_SIZE} out of ${pokemons.length} pokemon. </h1>`);

    // pop up modal when clicking on a pokemon card
    // add event listener to each pokemon card
    $("body").on("click", ".pokeCard", async function (e) {
        const pokemonName = $(this).attr("pokeName");
        // console.log("pokemonName: ", pokemonName);
        const res = await axios.get(
            `https://pokeapi.co/api/v2/pokemon/${pokemonName}`
        );
        // console.log("res.data: ", res.data);
        const types = res.data.types.map((type) => type.type.name);
        // console.log("types: ", types);
        $(".modal-body").html(`
        <div style="width:200px">
        <img src="${
            res.data.sprites.other["official-artwork"].front_default
        }" alt="${res.data.name}"/>
        <div>
        <h3>Abilities</h3>
        <ul>
        ${res.data.abilities
            .map((ability) => `<li>${ability.ability.name}</li>`)
            .join("")}
        </ul>
        </div>

        <div>
        <h3>Stats</h3>
        <ul>
        ${res.data.stats
            .map((stat) => `<li>${stat.stat.name}: ${stat.base_stat}</li>`)
            .join("")}
        </ul>

        </div>

        </div>
          <h3>Types</h3>
          <ul>
          ${types.map((type) => `<li>${type}</li>`).join("")}
          </ul>
      
        `);
        $(".modal-title").html(`
        <h2>${res.data.name.toUpperCase()}</h2>
        <h5>${res.data.id}</h5>
        `);
    });

    // add event listener to pagination buttons
    $("body").on("click", ".numberedButtons", async function (e) {
        currentPage = Number(e.target.value);
        paginate(currentPage, PAGE_SIZE, pokemons);

        //update pagination buttons
        updatePaginationDiv(currentPage, numPages);
    });

    $("body").on("click", ".previousButton", async function (e) {
        currentPage = Number(e.target.value);
        paginate(currentPage, PAGE_SIZE, pokemons);

        //update pagination buttons
        updatePaginationDiv(currentPage, numPages);
    });

    $("body").on("click", ".nextButton", async function (e) {
        currentPage = Number(e.target.value);
        paginate(currentPage, PAGE_SIZE, pokemons);

        //update pagination buttons
        updatePaginationDiv(currentPage, numPages);
    });
};

$(document).ready(setup);
