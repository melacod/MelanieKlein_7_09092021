import { Data } from "./modules/data.js";
import { Factory } from "./modules/factory.js";

// created recipes
let recipes = [] ;

Data.loadJsonData().then( (jsonData) => {

    recipes = Factory.createRecipes(jsonData.recipes);

    console.log(recipes);
});


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