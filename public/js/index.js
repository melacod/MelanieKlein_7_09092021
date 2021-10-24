import { Data } from "./modules/data.js";
import { Recipe } from "./modules/recipe.js";
import { RecipeFinder } from "./modules/recipeFinder.js";
import { Template } from "./modules/template.js";

// dom elements
const genNavbar = document.querySelector('#gen-navbar');
const genFilters = document.querySelector('#gen-filters');
const genTags = document.querySelector('#gen-tags');
const genRecipes = document.querySelector('#gen-recipes');

Template.loadTemplates().then( () => {
    Data.loadJsonData().then( (jsonData) => {

        let recipes = jsonData.recipes.map(jsonRecipe => new Recipe (jsonRecipe));
        
        new RecipeFinder(recipes, genNavbar, genFilters, genTags, genRecipes);

    });
});
