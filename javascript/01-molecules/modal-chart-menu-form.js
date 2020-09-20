"use strict";

import * as utils from '../utilities/utils.js';

// A form that is opened by the modal chart menu button.
// This allows you to configure various parameters of the chart.
export class ModalChartMenu extends HTMLElement {
    constructor(){
        super();
        this._root = null;
        this.menuContainer = null;
        this.menuForm = null;
        // Form components
        this.startDateCalendar = null;
        this.endDateCalendar = null;
        this.dataTypeDropDown = null;
        this.applyButton = null;


    }

    // Browser calls this method when the element is added to the document
    // (Can be called many times if an element is repeatedly added/removed)
    connectedCallback(){
        this._root = this.attachShadow({mode: 'open'});


        let sheet = utils.CSSToStyleSheet('./css/01-molecules/modal-chart-menu-form.css');
        this._root.adoptedStyleSheets = [sheet];

        // Outermost container of the menu component.
        this.menuContainer = document.createElement('div');
        

        // Form element that houses all the form components.
        this.menuForm = document.createElement('form');
        this.menuForm.onchange = this.checkForm.bind(this);

        // Create outer label.
        let startDateLabel = document.createElement("label");
        startDateLabel.id = "start";
        startDateLabel.innerText = "Start Date:";
        // Create inner calendar object.
        this.startDateCalendar = document.createElement('input');
        this.startDateCalendar.type = "date";
        this.startDateCalendar.oninput = this.onStartDateInput.bind(this);
        startDateLabel.appendChild(this.startDateCalendar);

        // Create outer label.
        let endDateLabel = document.createElement("label");
        endDateLabel.id = "end";
        endDateLabel.innerText = "End Date:";
        // Create inner calendar object.
        this.endDateCalendar = document.createElement('input');
        this.endDateCalendar.type = "date";
        this.endDateCalendar.oninput = this.onEndDateInput.bind(this);
        endDateLabel.appendChild(this.endDateCalendar);

        // Drop down menu for selecting data type. 
        this.dataTypeDropDown = document.createElement("select");
        
        // Apply button to update the chart according to the configuration
        // that the user has specified with the form.
        this.applyButton = document.createElement("button");
        this.applyButton.innerText = "Apply";
        this.applyButton.onclick = this.onApplyButtonClicked.bind(this);
        this.applyButton.type = "button";
        this.applyButton.disabled = true;


        this._root.appendChild(this.menuContainer);
        this.menuContainer.appendChild(this.menuForm);
        this.menuForm.appendChild(startDateLabel);
        this.menuForm.appendChild(endDateLabel);
        this.menuForm.appendChild(this.dataTypeDropDown);

        this.menuForm.appendChild(this.applyButton);
        document.addEventListener("covid-data-load", e => this.onCovidDataLoad(e), true);
            

    }
    
    // Checks the status of the form.
    // If it has been filled out, the Apply button will become active.
    // Otherwise, the apply button will be disabled.
    checkForm(e){
        if ((this.startDateCalendar.value.length > 0) &&
           (this.endDateCalendar.value.length > 0) &&
           (this.dataTypeDropDown.value.length > 0)){
               this.applyButton.disabled = false;
           }
           else{
               this.applyButton.disabled = true;
           }
    }

    // Browser calls this method when the element is removed from the document
    // (Can be called many times if an element is repeatedly added/removed)
    disconnectedCallback() {
        
      }
    
    // When the apply button is clicked,
    // the form data is dispatched as an event to the Chart Module.
    // The Chart Module will then send the appropriate data to the chart element
    // for rendering.
    onApplyButtonClicked(e){
       if(this.applyButton.disabled == false){
           this.applyButton.disabled = true;
       }
       var eventObject = {startDate: this.startDateCalendar.value, endDate: this.endDateCalendar.value, dataType: this.dataTypeDropDown.value};
       // Create event to update the modal-chart-menu with data.
       let event = new CustomEvent("menu-form-submit", {bubbles:true, composed: true, detail: eventObject});
       this._root.dispatchEvent(event);
    }

    // Initialize the form elements.
    // Set the minimum and maximum dates of the calendar inputs.
    // Load the dropdown menu options for the "select" element.
    onCovidDataLoad(e){
        let maxDate = e.detail.maxDate;
        let minDate = e.detail.minDate;

        this.endDateCalendar.setAttribute('min',minDate);
        this.endDateCalendar.setAttribute('max',maxDate);

        this.startDateCalendar.setAttribute('min', minDate);
        this.startDateCalendar.setAttribute('max', maxDate);

        let dataKeys = e.detail.keys;
        dataKeys.forEach(element => {
            let newOption = new Option(element);
            this.dataTypeDropDown.add(newOption, undefined);
        });

    }

    onStartDateInput(e){
        if(this.startDateCalendar.value > this.endDateCalendar.value){
            this.endDateCalendar.value = this.startDateCalendar.value
        }
    }
    onEndDateInput(e){
        if(this.endDateCalendar.value < this.startDateCalendar.value){
            this.startDateCalendar.value = this.endDateCalendar.value
        }
    }
}

window.customElements.define('modal-chart-menu-form', ModalChartMenu);