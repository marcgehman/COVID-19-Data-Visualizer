"use strict";

import * as utils from '../utilities/utils.js';

// A simple button component that, when clicked on,
// is used to trigger the creation of new charts within
// a chart-grid component.
export class AddChartButton extends HTMLElement {
    constructor(){
        super();
        this._root = null;
    }

    // Browser calls this method when the element is added to the document
    // (Can be called many times if an element is repeatedly added/removed)
    connectedCallback(){ 

        this._root = this.attachShadow({mode: 'open'});

        let sheet = utils.CSSToStyleSheet('./css/00-atoms/add-chart-button.css');
        this.adoptedStyleSheets = [sheet];
        this._root.adoptedStyleSheets = [sheet];

        // Add div
        let div = document.createElement('div');
        div.id = "container";
        div.innerText = "+";
        this._root.appendChild(div);


    }

    // Browser calls this method when the element is removed from the document
    // (Can be called many times if an element is repeatedly added/removed)
    disconnectedCallback() {
        
      }


}

window.customElements.define("add-chart-button", AddChartButton);