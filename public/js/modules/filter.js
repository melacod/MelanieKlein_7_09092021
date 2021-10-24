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
        this.computeHtmlForOptions();
        return Template.fillTemplate('filter', this);
    }

    computeHtmlForOptions () {
        this.htmlOptions = Array.from(this.options)
            .map(option => Template.fillTemplate('filter-option', {optionName : option}))
            .join("");
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
        options.forEach(option => option.addEventListener("click", function(event) { this.selectOption(event)}.bind(this)));
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
        Array.from(this.genTags.children)
            .filter(tagButton => tagButton.innerText.trim() === optionName)
            .forEach(tagButton => tagButton.addEventListener("click", function(event) { this.removeOption(event)}.bind(this)));
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

    // Filter options consists in
    // - Display all options (previously hidden or not)
    // - Hide needed options
    filterOptions () {
        let options = document.querySelectorAll('#'+this.name+' .filter--option');
        let optionsToHide = this.getOptionsToHide();

        options.forEach(option => option.classList.remove('filter--option--hide'));
        optionsToHide.forEach(option => option.classList.add('filter--option--hide'));

        const btnFilter = document.querySelector('#'+this.name+' .btn');
        if (options.length === optionsToHide.length) {
            btnFilter.classList.add('disabled');
        } else {
            btnFilter.classList.remove('disabled');
        }

    }

    // Hide an option if
    // - the option is already selected
    // - the option name does not match the search input text
    getOptionsToHide () {
        const options = document.querySelectorAll('#'+this.name+' .filter--option');
        return Array.from(options)
            .filter(option => this.selectedOptions.has(option.textContent.trim()) || !this.doesTextMatchOption(option));
    }

    // An option match the search input text if all
    // - the search input text is empty
    // - all words of search input text are present in the option name
    doesTextMatchOption (option) {
        const searchText = document.querySelector('#'+this.name+' .filter--input').value;
        let optionNameCleaned = Utils.cleanText(option.textContent.trim());
        const searchWords = Utils.cleanText(searchText).split(" ");
        return searchText == "" || searchWords.every(word => optionNameCleaned.indexOf(word) >= 0);
    }

    hideAllFilters () {
        document.querySelectorAll('.filter--selection')
            .forEach(element => element.style.display = 'none');

        document.querySelectorAll('.filter--button')
            .forEach(element => element.style.display = 'block');
    }

}