import { Data } from "./modules/data.js";
import { Factory } from "./modules/factory.js";
import { RecipeFinder } from "./modules/recipeFinder.js";
import { Template } from "./modules/template.js";

// dom elements
const genNavbar = document.querySelector('#gen-navbar');
const genFilters = document.querySelector('#gen-filters');
const genTags = document.querySelector('#gen-tags');
const genRecipes = document.querySelector('#gen-recipes');

// recipe finder object
let recipeFinder = undefined;

Template.loadTemplates().then( () => {
    Data.loadJsonData().then( (jsonData) => {

        let recipes = Factory.createRecipes(jsonData.recipes);
        
        recipeFinder = new RecipeFinder(recipes, genNavbar, genFilters, genTags, genRecipes);

        console.log(recipes);
    });
});
