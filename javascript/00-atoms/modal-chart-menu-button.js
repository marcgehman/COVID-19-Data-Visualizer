// This button is used to open the modal chart menu.
"use strict";

import * as utils from '../utilities/utils.js';

// Menu Button in the header to open a modal form.
// This allows you to configure various parameters of the chart.
export class ModalChartMenu extends HTMLElement {
    constructor(){
        super();
        this._root = null;

    }

    // Browser calls this method when the element is added to the document
    // (Can be called many times if an element is repeatedly added/removed)
    connectedCallback(){
        this._root = this.attachShadow({mode: 'open'});

        let sheet = utils.CSSToStyleSheet('./css/00-atoms/modal-chart-menu-button.css');
        this._root.adoptedStyleSheets = [sheet];
        
        let div = document.createElement('div');
        this._root.appendChild(div);

        let button = document.createElement('button');
        button.innerText = "Menu";
        div.appendChild(button);

    }

    // Browser calls this method when the element is removed from the document
    // (Can be called many times if an element is repeatedly added/removed)
    disconnectedCallback() {
        
      }
    
}

window.customElements.define("modal-chart-menu-button", ModalChartMenu);
