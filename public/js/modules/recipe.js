import { Ingredient } from "./ingredient.js";
import { Template } from "./template.js";
import { Utils } from "./utils.js";

export { Recipe };

//class with recipe attributes

class Recipe {

    constructor ({id, name, servings, ingredients, time, description, appliance, ustensils}){
        this.id = id;
        this.name = name;
        this.servings = servings;
        this.ingredients = ingredients.map(ingredient => new Ingredient (ingredient));
        this.time = time;
        this.description = description;
        this.appliance = appliance;
        this.ustensils = ustensils;
    }

    displayRecipe () {
        this.computeHtmlForIngredients();
        return Template.fillTemplate('recipe', this);
    }

    computeHtmlForIngredients () {
        this.htmlIngredients = this.ingredients
            .map(ingredient => Template.fillTemplate('recipe-ingredient', ingredient))
            .join("");
    }

    getText () {
        let text = this.name + " " + this.description + " ";
        text += this.ingredients
            .map(ingredient => ingredient.name)
            .join(" ");
        return Utils.cleanText(text);
    }

    getIngredientsNames () {
        return this.ingredients.map(ingredient => ingredient.name);
    }
    
}