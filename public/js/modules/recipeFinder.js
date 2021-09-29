import { Filter } from "./filter.js";

export { RecipeFinder };

class RecipeFinder {

    constructor (recipes, genFilters, genTags, genRecipes) {
        this.recipes = recipes;
        this.genFilters = genFilters;
        this.genTags = genTags;
        this.genRecipes = genRecipes;
        this.searchText = "";
        this.createFilterIngredients();
        this.createFilterAppliances();
        this.createFilterUstensils();
    }
    
    addStaticEvents () {
        const navSearch = document.querySelector('#navSearch');
        navSearch.addEventListener("keyup", function(event) { this.changeSearchText(event)}.bind(this));
    } 

    changeSearchText (event) {
        this.searchText = event.target.value;
        this.searchRecipes();
    } 

    searchRecipes () {
        console.log("Search recipes with parameters");
        console.log(" - Search text: " + this.searchText);

        let selectedIngredients = this.filterIngredients.getSelectedOptions();
        console.log(" - Ingredients: ", selectedIngredients);

        let selectedAppliances = this.filterAppliances.getSelectedOptions();
        console.log(" - Appliances: ", selectedAppliances);

        let selectedUstensils = this.filterUstensils.getSelectedOptions();
        console.log(" - Ustensils: ", selectedUstensils);
        
    }

    // compute ingredients
    getUniqueIngredients () {
        let ingredients = new Set ();
        for (let recipe of this.recipes) {
            for (let ingredient of recipe.ingredients) {
                ingredients.add(ingredient.name);
            }
        }
        return ingredients;
    }

    // compute appliance 
    getUniqueAppliances () {
        let appliances = new Set();
        for (let recipe of this.recipes) {
            appliances.add(recipe.appliance);
        }
        return appliances;
    }

    // compute ustensils
    getUniqueUstensils () {
        let ustensils = new Set ();
        for (let recipe of this.recipes) {
            for ( let ustensil of recipe.ustensils) {
                ustensils.add(ustensil);
            }
        }
        return ustensils;
    }

    createFilterIngredients () {
        let ingredients = this.getUniqueIngredients();
        this.filterIngredients = new Filter("Ingrédients", ingredients, this.genTags, 'primary');
        this.filterIngredients.linkRecipeFinder(this);
    }
    
    displayFilterIngredients () {
        this.genFilters.insertAdjacentHTML('beforeend', this.filterIngredients.displayFilter());
        this.filterIngredients.addStaticEvents();
    }

    createFilterAppliances () {
        let appliances = this.getUniqueAppliances();
        this.filterAppliances = new Filter("Appareils", appliances, this.genTags, 'success');
        this.filterAppliances.linkRecipeFinder(this);
    }
    
    displayFilterAppliances () {
        this.genFilters.insertAdjacentHTML('beforeend', this.filterAppliances.displayFilter());
        this.filterAppliances.addStaticEvents();
    }
    
    createFilterUstensils () {
        let ustensils = this.getUniqueUstensils();
        this.filterUstensils = new Filter( "Ustensils", ustensils, this.genTags, 'danger');
        this.filterUstensils.linkRecipeFinder(this);
    }

    displayFilterUstensils () {
        this.genFilters.insertAdjacentHTML('beforeend', this.filterUstensils.displayFilter());
        this.filterUstensils.addStaticEvents();
    }

    displayFilters () {
        this.displayFilterIngredients();
        this.displayFilterAppliances();
        this.displayFilterUstensils();
    }

    displayRecipes () {
        for (let recipe of this.recipes) {
            this.genRecipes.insertAdjacentHTML('beforeend', recipe.displayRecipe());
        }
    }
}