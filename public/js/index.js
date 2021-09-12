import { Data } from "./modules/data.js";
import { Factory } from "./modules/factory.js";

// created recipes
let recipes = [] ;

Data.loadJsonData().then( (jsonData) => {

    recipes = Factory.createRecipes(jsonData.recipes);

    console.log(recipes);
});
