import { Template } from "./template.js";

export { Filter };

class Filter {

    constructor (name, options) {
        this.name = name;
        this.options = options;
    }

    displayFilter () {
        this.htmlOptions = this.displayFilterOptions();
        return Template.fillTemplate('filter', this);
    }

    displayFilterOptions () {
        let htmlOptions = "";
        for (let option of this.options) {
            htmlOptions += Template.fillTemplate('filter-option', {optionName : option});
        }
        return htmlOptions;
    }

}