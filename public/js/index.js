import { Data } from "./modules/data.js";
import { Factory } from "./modules/factory.js";
import { Filter } from "./modules/filter.js";
import { RecipeFinder } from "./modules/recipeFinder.js";
import { Template } from "./modules/template.js";

// dom elements
const genFilters = document.querySelector('#gen-filters');
const genTags = document.querySelector('#gen-tags');
const genRecipes = document.querySelector('#gen-recipes');

// created recipes
let recipes = [] ;
let recipeFinder = undefined;

Template.loadTemplates().then( () => {
    Data.loadJsonData().then( (jsonData) => {

        recipes = Factory.createRecipes(jsonData.recipes);
        
        recipeFinder = new RecipeFinder(recipes, genFilters, genTags, genRecipes);
        recipeFinder.displayFilters();
        recipeFinder.displayRecipes();
        recipeFinder.addStaticEvents();

        console.log(recipes);
    });
});
