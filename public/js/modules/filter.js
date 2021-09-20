import { Template } from "./template.js";

export { Filter };

class Filter {

    constructor (name, options, parentTagElement, className) {
        this.name = name;
        this.item = name.toLowerCase().slice(0, name.length -1);
        this.options = options;
        this.parentTagElement = parentTagElement;
        this.className = className;
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
        
        listFilters.style.display = 'none';
        btnOpenFilter.style.display= "block";

        // add listener events to filter
        btnOpenFilter.addEventListener("click", function (event) { this.openFilter(event)}.bind(this));
        btnCloseFilter.addEventListener("click", function(event) { this.closeFilter(event)}.bind(this));
        for (let option of options) {
            option.addEventListener("click", function(event) { this.selectOption(event)}.bind(this));
        }
        
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
        selectedOption.classList.add('filter--option--hide');

        // create option button in DOM
        let tagObject = { optionName : optionName , className : this.className };
        this.parentTagElement.insertAdjacentHTML('beforeend', Template.fillTemplate('tag', tagObject));

        let optionButton = this.parentTagElement.querySelector('[data-option="'+optionName+'"]');
        optionButton.addEventListener("click", function(event) { this.removeOption(event)}.bind(this));
    }

    removeOption (event) {
        let optionName = event.target.dataset.option;
        
        // remove option button from DOM
        event.target.remove();

        // display option in filter
        const options = document.querySelectorAll('#'+this.name+' .filter--option');
        for (let option of options) {
            if (option.dataset.option === optionName) {
                option.classList.remove('filter--option--hide');
                break;
            }
        }
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