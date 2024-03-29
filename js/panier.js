document.addEventListener('DOMContentLoaded', () => {

    //animations sur les boutons du header
    const headerActions = document.querySelectorAll('.actionContainer');
    headerActions.forEach(selectedAction => {
        selectedAction.addEventListener('mouseover', () => {
            selectedAction.classList.add("selectedAction");
            selectedAction.addEventListener('mouseleave', () => {
                selectedAction.classList.remove("selectedAction");
            })
        })
    })
    
    const fullTeam = JSON.parse(localStorage.getItem("teamList"));
    const fullCart = document.querySelector("#fullCart")
    const releaseAllButton = document.querySelector("#releaseAll");

    //si l'équipe est vide, afficher un message
    if (fullTeam === null || fullTeam.length === 0 ){
        releaseAllButton.style.display = "none";
        const emptyCard = document.createElement('div')
        emptyCard.classList.add("emptyCard")
        emptyCard.innerHTML = "<h2> Vous n'avez pas encore de pokémon dans votre équipe !</h2> <img src='assets/cryingPokemon.webp' alt='Pokémon en train de pleurer'>"
        fullCart.appendChild(emptyCard);

    } else { //générer les cartes de chaque pokémon de l'équipe et afficher certaines de leurs informations

        //retirer tous les pokemons de l'équipe et rafraichir la page au click du bouton "Tout relacher"
        releaseAllButton.addEventListener("click", () => {
            localStorage.removeItem("teamList");
            location.reload();
        })

        //animations sur le bouton "Tout relacher"
        releaseAllButton.addEventListener('mouseover', () => {
            releaseAllButton.classList.add('accentActionsOnPokemon');
            releaseAllButton.addEventListener('mouseleave', () => {
                releaseAllButton.classList.remove('accentActionsOnPokemon');
                releaseAllButton.classList.add('accentActionsOnPokemonEnd');
                releaseAllButton.addEventListener('animationend', () => {
                    releaseAllButton.classList.remove('accentActionsOnPokemonEnd');
                })
            })
        })
        
        fullTeam.forEach((pokemon, i) => {
            fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`)
            .then(response => response.json())
            .then((pokemon) => {
                const indivCard = document.createElement('div')
                indivCard.classList.add("indivCard")
                indivCard.innerHTML = `
                <img src="${pokemon.sprites.front_default}" alt="image de ${pokemon.name}" class="imgPokemon">
                    <div class="pokemonCartInfo">
                        <h2>${pokemon.name} (#${pokemon.id})</h2>
                        <h3>${pokemon.types.map((type) => type.type.name).join(" & ")}</h3>
                        <div class="statsRecap">
                            ${pokemon.stats.map((stat) => `${stat.stat.name} : ${stat.base_stat}`).join("<p>")}
                        </div>
                    </div>
                `
                const actionsOnPokemonInCart = document.createElement("div");
                actionsOnPokemonInCart.classList.add("actionsOnPokemonInCart");
                
                //retirer le pokémon de l'équipe et rafraichir la page au click du bouton "Relacher"
                const releaseButton = document.createElement("button");
                releaseButton.classList.add("removePokemon");
                releaseButton.classList.add("indivActionOnPokemon");
                releaseButton.id = i;
                releaseButton.textContent = "Relacher";
                releaseButton.addEventListener("click", () => {
                    const removePokemon = (index) => {
                        const pokemonList = JSON.parse(localStorage.getItem("teamList")) || [];
                        pokemonList.splice(index, 1);
                        localStorage.setItem("teamList", JSON.stringify(pokemonList));
                        location.reload();
                    };
                    removePokemon(i);
                });
                
                //aller sur la page spécifique du pokémon demandé après avoir cliqué sur le bouton "Voir les informations"
                const goToIndivPage = document.createElement("button");
                goToIndivPage.classList.add("seeMore");
                goToIndivPage.classList.add("indivActionOnPokemon");
                goToIndivPage.textContent = "Voir les informations";
                goToIndivPage.addEventListener("click", () => {
                    localStorage.setItem("pokemonSearched", pokemon.name);
                    window.location.href = `produit.html`;
                });
                
                actionsOnPokemonInCart.appendChild(goToIndivPage);
                actionsOnPokemonInCart.appendChild(releaseButton);
                indivCard.appendChild(actionsOnPokemonInCart);
                releaseAllButton.before(indivCard);

                //animations sur les boutons "Relacher" et "Voir les informations"
                document.querySelectorAll(".indivActionOnPokemon").forEach((action) => {
                    action.addEventListener("mouseover", () => {
                        action.classList.add("accentIndivActionsOnPokemon");
                        action.addEventListener("mouseleave", () => {
                            action.classList.remove("accentIndivActionsOnPokemon");
                            action.classList.add("accentIndivActionsOnPokemonEnd");
                            action.addEventListener("animationend", () => {
                                action.classList.remove("accentIndivActionsOnPokemonEnd");
                            })
                        })
                    })
                })
            })
        })
    }

    //fonction de recherche
    const searchInput = document.querySelector("#searchInput");
    const searchButton = document.querySelector("#searchButton")
    const errorMessage = document.createElement("p");
    errorMessage.classList.add("errorMessage");

    const search = () => {
        const userInput = document.querySelector("#searchInput").value.toLowerCase();
        
        fetch(`https://pokeapi.co/api/v2/pokemon/${userInput}`)
        .then((response) => {
            if (!response.ok) {
                errorMessage.textContent = `Aucun Pokémon ne semble s'appeler "${userInput}".`;
                document.querySelector("#searchSection").appendChild(errorMessage);
                throw new Error(`Aucun Pokémon ne semble s'appeler "${userInput}".`);
            }
            return response.json();
         })
        .then((pokemonSearched) => {
            localStorage.setItem("pokemonSearched", pokemonSearched.name);
            window.location.href = `produit.html`;
            return pokemonSearched.name;
        })
    }

    searchInput.addEventListener("change", () => {
        localStorage.removeItem("pokemonSearched");
    });

    searchButton.addEventListener("click", search);

    searchInput.addEventListener("keyup", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            search();
        }
    });
});