import { Filter } from "./filter.js";
import { Template } from "./template.js";
import { Utils } from "./utils.js";

export { RecipeFinder };

class RecipeFinder {

    constructor (recipes, genNavbar, genFilters, genTags, genRecipes) {
        this.recipes = recipes;
        this.matchRecipes = this.recipes;
        this.genNavbar = genNavbar;
        this.genFilters = genFilters;
        this.genTags = genTags;
        this.genRecipes = genRecipes;
        this.searchText = "";
        this.displayNavbar();
        this.addNavbarEvent();
        this.createFilters();
        this.displayFilters();
        this.displayRecipes(this.recipes);
    }
    
    // Search recipe with navbar ****************************************************************************

    searchRecipesWithNavbar () {
        console.log("Search recipes with navbar");
        console.log(" - Search text: " + this.searchText);

        // If searched text contains more than 3 characters: search match recipes else display all recipes
        const moreThanThreeCharacters = this.searchText.length >= 3;
        if (moreThanThreeCharacters) {

            // Clean and cut the searched text into words 
            const searchWords = Utils.cleanText(this.searchText).split(" "); 
            this.matchRecipes = this.recipes.filter(recipe => searchWords.every(word => recipe.getText().indexOf(word) >= 0));
    
        } else {
            this.matchRecipes = this.recipes;
        }
        console.log("Found "+this.matchRecipes.length+" match recipes");

        // Display matched recipes 
        this.displayRecipes(this.matchRecipes);

        // display new filters based on matched recipes
        this.computeNewFilters(this.matchRecipes, true);
    }

    // Filter match recipes ****************************************************************************

    filterMatchRecipes () {
        console.log("Filter match recipes");
        
        let selectedIngredients = this.filterIngredients.getSelectedOptions();
        let selectedAppliances = this.filterAppliances.getSelectedOptions();
        let selectedUstensils = this.filterUstensils.getSelectedOptions();

        console.log(" - Appliances: ", selectedAppliances);
        console.log(" - Ingredients: ", selectedIngredients);
        console.log(" - Ustensils: ", selectedUstensils);

        let filterRecipes = this.matchRecipes.filter(matchRecipe => 
                Array.from(selectedIngredients).every(selectedIngredient => matchRecipe.getIngredientsNames().includes(selectedIngredient))
            &&  Array.from(selectedAppliances).every(selectedAppliance => matchRecipe.appliance === selectedAppliance)
            &&  Array.from(selectedUstensils).every(selectedUstensil => matchRecipe.ustensils.includes(selectedUstensil))
        );
        console.log("Found " + filterRecipes.length + " filter recipes");

        // display all filtered recipes
        this.displayRecipes(filterRecipes);

        // display new filters based on filtered recipes
        this.computeNewFilters(filterRecipes, false);
    }

   // Compute new filters from recipes ****************************************************************************
   
   computeNewFilters (recipes, deleteSelectedOptions) {

        // Clean tags if delete selected options
        if (deleteSelectedOptions === true) {
            this.genTags.innerHTML = "";
        }

        // Compute unique ingrendiens/applicances/ustensils from match recipes
        let newIngredients = this.getUniqueIngredients(recipes);
        let newAppliances = this.getUniqueAppliances(recipes);
        let newUstensils = this.getUniqueUstensils(recipes);

        // Update filters with new options
        this.filterIngredients.updateOptions(newIngredients, deleteSelectedOptions);
        this.filterAppliances.updateOptions(newAppliances, deleteSelectedOptions);
        this.filterUstensils.updateOptions(newUstensils, deleteSelectedOptions);

        // Display filters with new options
        this.genFilters.innerHTML = "";
        this.displayFilters();
    }

    // Get unique options ****************************************************************************
    
    getUniqueIngredients (recipes) {
        return new Set(recipes
            .map(recipe => recipe.ingredients)
            .flat()
            .map(ingredient => ingredient.name)
        );
    }
    
    getUniqueAppliances (recipes) {
        return new Set(recipes
            .map(recipe => recipe.appliance)
        );
    }

    getUniqueUstensils (recipes) {
        return new Set(recipes
            .map(recipe => recipe.ustensils)
            .flat()
        );
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

    // Display navbar ****************************************************************************

    displayNavbar () {
        this.genNavbar.insertAdjacentHTML('beforeend', Template.fillTemplate('navbar', {}));
    }

    // Add navbar event ****************************************************************************

    addNavbarEvent () {
        const navSearch = document.querySelector('#navSearch');
        navSearch.addEventListener("keyup", function(event) { this.changeSearchText(event)}.bind(this));
    } 

    changeSearchText (event) {
        this.searchText = event.target.value;
        this.searchRecipesWithNavbar();
    } 

    // Display filters ****************************************************************************
    
    displayFilters () {
        this.displayFilterIngredients();
        this.displayFilterAppliances();
        this.displayFilterUstensils();
    }

    displayFilterIngredients () {
        this.genFilters.insertAdjacentHTML('beforeend', this.filterIngredients.displayFilter());
        this.filterIngredients.addStaticEvents();
        this.filterIngredients.filterOptions();
    }

    displayFilterAppliances () {
        this.genFilters.insertAdjacentHTML('beforeend', this.filterAppliances.displayFilter());
        this.filterAppliances.addStaticEvents();
        this.filterAppliances.filterOptions();
    }

    displayFilterUstensils () {
        this.genFilters.insertAdjacentHTML('beforeend', this.filterUstensils.displayFilter());
        this.filterUstensils.addStaticEvents();
        this.filterUstensils.filterOptions();
    }

    // Display recipes ****************************************************************************

    displayRecipes (recipes) {
        let htmlRecipes = recipes
            .map(recipe => recipe.displayRecipe())
            .join("");
        this.genRecipes.innerHTML = "";
        this.genRecipes.insertAdjacentHTML('beforeend', htmlRecipes);
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