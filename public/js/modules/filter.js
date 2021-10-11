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
        // get option clicked and its name
        let optionClicked = event.target;
        let nameOptionClicked = optionClicked.textContent.trim();

        // add option to selected options set
        this.selectedOptions.add(nameOptionClicked);

        // create tag button in dom
        this.displayTag(nameOptionClicked);

        // filter recipe with new selected option
        this.recipeFinder.filterMatchRecipes();
    }

    displayTag (optionName) {
        // create option button tag in dom
        let tagObject = { optionName : optionName , className : this.className };
        this.genTags.insertAdjacentHTML('beforeend', Template.fillTemplate('tag', tagObject));

        // add click event for remove tag
        for (let tagButton of this.genTags.children) {
            if (tagButton.innerText.trim() === optionName) {
                tagButton.addEventListener("click", function(event) { this.removeOption(event)}.bind(this));
                break;
            }
        }
    }

    removeOption (event) {
        // get option button clicked and its name
        let buttonOptionClicked = event.target;
        let nameOptionClicked = buttonOptionClicked.textContent.trim();
        
        // remove tag button from DOM
        buttonOptionClicked.remove();

        // remove option from selected options set
        this.selectedOptions.delete(nameOptionClicked);

        // filter recipe with removed option
        this.recipeFinder.filterMatchRecipes();
    }

    filterOptions () {

        // Display all options
        const options = document.querySelectorAll('#'+this.name+' .filter--option');
        for (let option of options) {
            option.classList.remove('filter--option--hide');
        }
    
        // Hide selected or not matched options
        let optionsToHide = this.getOptionsToHide();
        for (let option of optionsToHide) {
            option.classList.add('filter--option--hide');
        }   
    }

    getOptionsToHide () {
        let optionsToHide = [];

        const options = document.querySelectorAll('#'+this.name+' .filter--option');

        for (let option of options) {
            let optionName = option.textContent.trim();

            let hide = false;
            
            // Hide option is already selected
            if (this.selectedOptions.has(optionName)) {
                hide = true;
            
            // Display option if option name match text
            } else if (this.doesTextMatchOption(option)) {
                hide = false;

            // Hide option if option name does not match text
            } else {
                hide = true;
            }
            
            // Add option to array
            if (hide === true) {
                optionsToHide.push(option);
            }
        }
        return optionsToHide;
    }

    doesTextMatchOption (option) {
        const searchText = document.querySelector('#'+this.name+' .filter--input').value;
        
        // If text is empty, option match!
        if (searchText == "") {
            return true;
        }

        let optionNameCleaned = Utils.cleanText(option.textContent.trim());
        
        const searchWords = Utils.cleanText(searchText).split(" ");
        for (let searchWord of searchWords) {

            // If one word not found, option does not match !
            if (optionNameCleaned.indexOf(searchWord) === -1) {
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