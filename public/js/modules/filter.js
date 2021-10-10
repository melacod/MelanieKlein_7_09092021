import { Animation } from "./animation.js";
import { Template } from "./template.js";
import { Utils } from "./utils.js";

export { Filter };

class Filter {

    constructor (name, options, genTags, className) {
        this.name = name;
        // Example: name = Ingrédients => item = ingrédient
        this.item = name.toLowerCase().slice(0, name.length -1);
        this.options = options;
        this.selectedOptions = new Set ();
        this.genTags = genTags;
        this.className = className;
    }

    getSelectedOptions () {
        return this.selectedOptions;
    }

    // Link recipe finder with filter ****************************************************************************

    linkRecipeFinder (recipeFinder) {
        this.recipeFinder = recipeFinder;
    }

    // Reset options ****************************************************************************

    updateOptions (newOptions, deleteSelectedOptions) {
        this.options = newOptions;
        if (deleteSelectedOptions === true) {
            this.selectedOptions.clear();
        }
    }

    // Display filter with options ****************************************************************************

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

    // Add static event: html elements not re generated ****************************************************************************

    addStaticEvents () {
        // DOM elements
        const btnOpenFilter = document.querySelector('#'+this.name+' .btn');
        const listFilters = document.querySelector('#'+this.name+' .filter--selection');
        const btnCloseFilter = document.querySelector('#'+this.item+'--icon');
        const options = document.querySelectorAll('#'+this.name+' .filter--option');
        const inputSearchOptions = document.querySelector('#'+this.name+' .filter--input');
        
        listFilters.style.display = 'none';
        btnOpenFilter.style.display= "block";

        // add listener events to filter
        btnOpenFilter.addEventListener("click", function (event) { this.openFilter(event)}.bind(this));
        btnCloseFilter.addEventListener("click", function(event) { this.closeFilter(event)}.bind(this));
        for (let option of options) {
            option.addEventListener("click", function(event) { this.selectOption(event)}.bind(this));
        }
        inputSearchOptions.addEventListener('keyup', function(event) { this.filterOptions(event)}.bind(this));
    }

    // Open/Close filter ****************************************************************************

    openFilter () { 
        this.hideAllFilters();

        // DOM elements
        const btnOpenFilter = document.querySelector('#'+this.name+' .btn');
        const listFilters = document.querySelector('#'+this.name+' .filter--selection');

        listFilters.style.display = 'block';
        btnOpenFilter.style.display = 'none';

        Animation.fadeIn(listFilters.querySelector('.filter--search'), 500, 0);
        Animation.fadeIn(listFilters.querySelector('.filter--options'), 600, 0);
    }

    closeFilter () {
        //dom elements
        const btnOpenFilter = document.querySelector('#'+this.name+' .btn');
        const listFilters = document.querySelector('#'+this.name+' .filter--selection');

        listFilters.style.display = "none";
        btnOpenFilter.style.display = "block";

        Animation.fadeIn(btnOpenFilter, 500, 0);
    }

    // Select/Remove an option from filter ****************************************************************************
    
    selectOption (event) {
        let selectedOption = event.target;
        let optionName = selectedOption.textContent;

        // hide option from filter
        selectedOption.classList.add('filter--option--selected');

        // add option to selected options set
        this.selectedOptions.add(optionName);

        // create tag button in dom
        this.displayTag(optionName);

        // display options
        this.filterOptions();

        // filter recipe with new selected option
        this.recipeFinder.filterMatchRecipes();
    }

    displayTag (optionName) {
        let tagObject = { optionName : optionName , className : this.className };
        this.genTags.insertAdjacentHTML('beforeend', Template.fillTemplate('tag', tagObject));

        let optionButton = this.genTags.querySelector('[data-option="' + optionName + '"]');
        optionButton.addEventListener("click", function(event) { this.removeOption(event)}.bind(this));
    }

    removeOption (event) {
        let optionName = event.target.dataset.option;
        
        // remove tag button from DOM
        event.target.remove();

        // remove option from selected options set
        this.selectedOptions.delete(optionName);

        // display options
        this.filterOptions();

        // filter recipe with removed option
        this.recipeFinder.filterMatchRecipes();
    }

    filterOptions () {

        const options = document.querySelectorAll('#'+this.name+' .filter--option');
        for (let option of options) {
            option.classList.remove('filter--option--hide');
        }
        
        let optionsToHide = this.getOptionsToHide();
        for (let option of optionsToHide) {
            option.classList.add('filter--option--hide');
        }   
    }

    getOptionsToHide () {
        let optionsToHide = [];
        const options = document.querySelectorAll('#'+this.name+' .filter--option');
        for (let option of options) {
            
            // Hide option is already selected
            let hide = this.selectedOptions.has(option.dataset.option);
            
            // Hide option if does not match text
            if (hide === false) {
                hide = this.doesTextMatchOption(option) === false;
            }

            // Add option to array
            if (hide === true) {
                optionsToHide.push(option);
            }
        }
        return optionsToHide;
    }

    doesTextMatchOption (option) {
        const text = document.querySelector('#'+this.name+' .filter--input').value;
        
        // If text is empty, option match!
        if (text == "") {
            return true;
        }

        const words = text.split(" ");
        let cleanOption = Utils.cleanText(option.dataset.option);
        for (let word of words) {

            // If one word not found, option does not match !
            if (cleanOption.indexOf(word) === -1) {
                return false;
            }
        }

        // all words found, option match !
        return true;
    }

    hideAllFilters () {
        let allFilterSelection = document.querySelectorAll('.filter--selection');
        for (let filterSelection of allFilterSelection) {
            filterSelection.style.display = 'none';
        }
        let allFilterButton = document.querySelectorAll('.filter--button');
        for (let filterButton of allFilterButton) {
            filterButton.style.display = 'block';
        }
    }

}