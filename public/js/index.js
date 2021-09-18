import { Data } from "./modules/data.js";
import { Factory } from "./modules/factory.js";
import { Filter } from "./modules/filter.js";
import { Template } from "./modules/template.js";

// dom elements
const genFilters = document.querySelector('#gen-filters');
const genTags = document.querySelector('#gen-tags');
const genRecipes = document.querySelector('#gen-recipes');

// created recipes
let recipes = [] ;

Template.loadTemplates().then( () => {
    Data.loadJsonData().then( (jsonData) => {

        recipes = Factory.createRecipes(jsonData.recipes);
    
        displayIngredients();
        displayFilters();
        displayUstensils();

        displayRecipes();

        console.log(recipes);
    });
});

function displayRecipes () {
    for (let recipe of recipes) {
        genRecipes.insertAdjacentHTML('beforeend', recipe.displayRecipe());
    }
}

function displayIngredients () {
    let ingredients = getIngredients();
    let filterIngredients = new Filter("Ingrédients", ingredients, genTags, 'primary');
    genFilters.insertAdjacentHTML('beforeend', filterIngredients.displayFilter());
    filterIngredients.addStaticEvents();
}

function displayFilters () {
    let appliances = getAppliances();
    let filterAppliances = new Filter("Appareils", appliances, genTags, 'success');
    genFilters.insertAdjacentHTML('beforeend', filterAppliances.displayFilter());
    filterAppliances.addStaticEvents();
}

function displayUstensils () {
    let ustensils = getUstensils();
    let filterUstensils = new Filter("Ustensils", ustensils, genTags, 'danger');
    genFilters.insertAdjacentHTML('beforeend', filterUstensils.displayFilter());
    filterUstensils.addStaticEvents();
}

// compute appliance 
function getAppliances () {
    let appliances = new Set();
    for (let recipe of recipes) {
        appliances.add(recipe.appliance);
    }
    return appliances;
}

// compute ustensils
function getUstensils () {
    let ustensils = new Set ();
    for (let recipe of recipes) {
        for ( let ustensil of recipe.ustensils) {
            ustensils.add(ustensil);
        }
    }
    return ustensils;
}

// compute ingredients
function getIngredients () {
    let ingredients = new Set ();
    for (let recipe of recipes) {
        for ( let ingredient of recipe.ingredients) {
            ingredients.add(ingredient.name);
        }
    }
    return ingredients;
}
