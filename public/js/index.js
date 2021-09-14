import { Data } from "./modules/data.js";
import { Factory } from "./modules/factory.js";
import { Filter } from "./modules/filter.js";
import { Template } from "./modules/template.js";

// dom elements
const genFilters = document.querySelector('#gen-filters');

// created recipes
let recipes = [] ;

Template.loadTemplates().then( () => {
    Data.loadJsonData().then( (jsonData) => {

        recipes = Factory.createRecipes(jsonData.recipes);
    
        displayFilters();

        console.log(recipes);
    });
});

function displayFilters () {
    let appliances = getAppliances();
    let filterAppliances = new Filter("Appareils", appliances);
    genFilters.insertAdjacentHTML('beforeend', filterAppliances.displayFilter());
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