import { Template } from "./template.js";
import { Utils } from "./utils.js";

export { Filter };

class Filter {

    constructor (name, options, parentTagElement, className) {
        this.name = name;
        this.item = name.toLowerCase().slice(0, name.length -1);
        this.options = options;
        this.parentTagElement = parentTagElement;
        this.className = className;
        this.selectedOptions = new Set ();
    }

    updateOptions (newOptions) {
        this.options = newOptions;
    }

    linkRecipeFinder (recipeFinder) {
        this.recipeFinder = recipeFinder;
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

    // Add static event: html elements not re generated
    addStaticEvents () {
        // DOM elements
        const btnOpenFilter = document.querySelector('#'+this.name+' .btn');
        const listFilters = document.querySelector('#'+this.name+' .filter--selection');
        const btnCloseFilter = document.querySelector('#'+this.item+'--icon');
        const options = document.querySelectorAll('#'+this.name+' .filter--option');
        const searchOptions = document.querySelector('#'+this.name+' .filter--input');
        
        listFilters.style.display = 'none';
        btnOpenFilter.style.display= "block";

        // add listener events to filter
        btnOpenFilter.addEventListener("click", function (event) { this.openFilter(event)}.bind(this));
        btnCloseFilter.addEventListener("click", function(event) { this.closeFilter(event)}.bind(this));
        for (let option of options) {
            option.addEventListener("click", function(event) { this.selectOption(event)}.bind(this));
        }
        searchOptions.addEventListener('keyup', function(event) { this.searchOptions(event)}.bind(this));
    }

    // open to filter
    openFilter (){ 
        this.hideAllFilters();

        // DOM elements
        const btnOpenFilter = document.querySelector('#'+this.name+' .btn');
        const listFilters = document.querySelector('#'+this.name+' .filter--selection');

        listFilters.style.display = 'block';
        btnOpenFilter.style.display='none';
    }

    //close to filter
    closeFilter (){
        //dom elements
        const btnOpenFilter = document.querySelector('#'+this.name+' .btn');
        const listFilters = document.querySelector('#'+this.name+' .filter--selection');

        listFilters.style.display = "none";
        btnOpenFilter.style.display = "block";
    }

    // select an item
    selectOption (event) {
        let selectedOption = event.target;
        let optionName = selectedOption.textContent;

        // hide option from filter
        selectedOption.classList.add('filter--option--selected');

        // create option button in DOM
        let tagObject = { optionName : optionName , className : this.className };
        this.parentTagElement.insertAdjacentHTML('beforeend', Template.fillTemplate('tag', tagObject));

        let optionButton = this.parentTagElement.querySelector('[data-option="'+optionName+'"]');
        optionButton.addEventListener("click", function(event) { this.removeOption(event)}.bind(this));

        this.searchOptions();
        
    }

    removeOption (event) {
        let optionName = event.target.dataset.option;
        
        // remove option button from DOM
        event.target.remove();

        // display option in filter
        const options = document.querySelectorAll('#'+this.name+' .filter--option');
        for (let option of options) {
            if (option.dataset.option === optionName) {
                option.classList.remove('filter--option--selected');
                break;
            }
        }
        this.searchOptions();
    }

    searchOptions () {
        this.selectedOptions.clear();

        const text = document.querySelector('#'+this.name+' .filter--input').value;
        const options = document.querySelectorAll('#'+this.name+' .filter--option');
        const words = text.split(" ");
        
        for (let option of options) {
            let cleanOption = Utils.cleanText(option.dataset.option);
            const isWordPresent = (word) => cleanOption.indexOf(word) >= 0;

            // Hide option is already selected
            let isOptionSelected = option.classList.contains('filter--option--selected');
            if (isOptionSelected) {
                this.selectedOptions.add(option.dataset.option);
                option.classList.add ('filter--option--hide');

            // Display option if searched text in option or no searched text
            } else if (text == "" || words.every(isWordPresent)) { 
                option.classList.remove('filter--option--hide');

            // Hide option in other case
            } else {
                option.classList.add ('filter--option--hide');
            }
        }
        this.recipeFinder.searchRecipesWithFilters();
    }

    getSelectedOptions () {
        return this.selectedOptions;
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