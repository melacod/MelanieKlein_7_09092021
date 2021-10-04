import { Filter } from "./filter.js";
import { Utils } from "./utils.js";

export { RecipeFinder };

class RecipeFinder {

    constructor (recipes, genFilters, genTags, genRecipes) {
        this.recipes = recipes;
        this.genFilters = genFilters;
        this.genTags = genTags;
        this.genRecipes = genRecipes;
        this.searchText = "";
        this.matchRecipes = [];
        this.createFilters();
    }
    
    addStaticEvents () {
        const navSearch = document.querySelector('#navSearch');
        navSearch.addEventListener("keyup", function(event) { this.changeSearchText(event)}.bind(this));
    } 

    changeSearchText (event) {
        this.searchText = event.target.value;
        this.searchRecipesWithNavbar();
    } 

    searchRecipesWithNavbar () {

        console.log("Search recipes with navbar");
        console.log(" - Search text: " + this.searchText);

        this.matchRecipes = [];
        const moreThanThreeCharacters = this.searchText.length >= 3;
        const searchWords = Utils.cleanText(this.searchText).split(" "); 

        for (let recipe of this.recipes) {
            
            if (moreThanThreeCharacters) {
                const isWordPresent = (word) => recipe.getText().indexOf(word) >= 0;
                if (searchWords.every(isWordPresent)) {
                    this.matchRecipes.push(recipe);
                }
            } else {
                this.matchRecipes.push(recipe);
            }
           
        }

        let newIngredients = this.getUniqueIngredients(this.matchRecipes);
        let newAppliances = this.getUniqueAppliances(this.matchRecipes);
        let newUstensils = this.getUniqueUstensils(this.matchRecipes);
        
        this.filterIngredients.updateOptions(newIngredients);
        this.filterAppliances.updateOptions(newAppliances);
        this.filterUstensils.updateOptions(newUstensils);

        this.displayFilters();
        this.displayRecipes(this.matchRecipes);
    }

    searchRecipesWithFilters () {
        console.log("Search recipes with filters");
        
        let selectedIngredients = this.filterIngredients.getSelectedOptions();
        let selectedAppliances = this.filterAppliances.getSelectedOptions();
        let selectedUstensils = this.filterUstensils.getSelectedOptions();

        console.log(" - Appliances: ", selectedAppliances);
        console.log(" - Ingredients: ", selectedIngredients);
        console.log(" - Ustensils: ", selectedUstensils);

        // array for filtered recipes
        let filterRecipes = [];

        // loop on each matching recipe
        for (let matchRecipe of this.matchRecipes) {
            
            // indicate if the recipe check all filters
            let isFilter = true;
        
            // check if all selected ingredients are present in ingredients of recipe
            let ingredientsNames = matchRecipe.getIngredientsNames();
            for (let selectedIngredient of selectedIngredients) {
                let found = false;
                for (let ingredientName of ingredientsNames) {
                    if (selectedIngredient == ingredientName) {
                        found = true;
                        break;
                    }
                }
                if (!found) {
                   isFilter = false;
                   break;
                }
            }
            
            // check if all selected appliances are present in appliance of recipe
            if (isFilter) {
                for (let selectedAppliance of selectedAppliances) {
                    if (selectedAppliance !== matchRecipe.appliance) {
                        isFilter = false;
                        break;
                    }
                }
            }

            // check if all selected ustensils are present in ustensils of recipe
            if (isFilter) {
                for (let selectedUstensil of selectedUstensils) {
                    let found = false;
                    for (let ustensil of matchRecipe.ustensils) {
                        if (selectedUstensil == ustensil) {
                            found = true;
                            break;
                        }
                    }
                    if (!found) {
                        isFilter = false;
                        break;
                    }
                }
            }

            // if recipe check all filters, add it to filtered recipes
            if (isFilter) {
                filterRecipes.push(matchRecipe);
            }

        }

        // display all filtered recipes
        this.displayRecipes(filterRecipes);

        // display new filters based on filtered recipes

    }

    // Get unique options ****************************************************************************
    
    getUniqueIngredients (recipes) {
        let ingredients = new Set ();
        for (let recipe of recipes) {
            for (let ingredient of recipe.ingredients) {
                ingredients.add(ingredient.name);
            }
        }
        return ingredients;
    }
    
    getUniqueAppliances (recipes) {
        let appliances = new Set();
        for (let recipe of recipes) {
            appliances.add(recipe.appliance);
        }
        return appliances;
    }

    getUniqueUstensils (recipes) {
        let ustensils = new Set ();
        for (let recipe of recipes) {
            for ( let ustensil of recipe.ustensils) {
                ustensils.add(ustensil);
            }
        }
        return ustensils;
    }

    // Create filters ****************************************************************************

    createFilters () {
        this.createFilterIngredients();
        this.createFilterAppliances();
        this.createFilterUstensils();
    }

    createFilterIngredients () {
        let ingredients = this.getUniqueIngredients(this.recipes);
        this.filterIngredients = new Filter("Ingrédients", ingredients, this.genTags, 'primary');
        this.filterIngredients.linkRecipeFinder(this);
    }
    
    createFilterAppliances () {
        let appliances = this.getUniqueAppliances(this.recipes);
        this.filterAppliances = new Filter("Appareils", appliances, this.genTags, 'success');
        this.filterAppliances.linkRecipeFinder(this);
    }
    
    createFilterUstensils () {
        let ustensils = this.getUniqueUstensils(this.recipes);
        this.filterUstensils = new Filter( "Ustensils", ustensils, this.genTags, 'danger');
        this.filterUstensils.linkRecipeFinder(this);
    }

    // Display filters ****************************************************************************
    
    displayFilters () {
        this.genTags.innerHTML = "";
        this.genFilters.innerHTML = "";
        this.displayFilterIngredients();
        this.displayFilterAppliances();
        this.displayFilterUstensils();
    }

    displayFilterIngredients () {
        this.genFilters.insertAdjacentHTML('beforeend', this.filterIngredients.displayFilter());
        this.filterIngredients.addStaticEvents();
    }

    displayFilterAppliances () {
        this.genFilters.insertAdjacentHTML('beforeend', this.filterAppliances.displayFilter());
        this.filterAppliances.addStaticEvents();
    }

    displayFilterUstensils () {
        this.genFilters.insertAdjacentHTML('beforeend', this.filterUstensils.displayFilter());
        this.filterUstensils.addStaticEvents();
    }

    // Display recipes ****************************************************************************

    displayAllRecipes () {
        this.displayRecipes(this.recipes);
    }

    displayRecipes (recipes) {
        this.genRecipes.innerHTML = "";
        for (let recipe of recipes) {
            this.genRecipes.insertAdjacentHTML('beforeend', recipe.displayRecipe());
        }
        this.noRecipeFoundDisplay(recipes);
    }

    noRecipeFoundDisplay (recipes) {
        const msg = document.querySelector('#noRecipeMessage');
        msg.style.display = "none";
        if (recipes.length === 0) {
            msg.style.display = "block";
        }        
    }

}