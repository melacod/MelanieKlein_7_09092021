export { Ingredient };

//class with ingredient attributes

class Ingredient {

    constructor ({ingredient, quantity, unit}) {
        this.name = ingredient;
        this.quantity = quantity;
        this.unit = unit;
        this.separator = '';
        if (this.quantity !== undefined){
            this.separator = ': ';
        }
    }
}