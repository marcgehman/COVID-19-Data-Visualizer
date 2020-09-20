"use strict";

import * as utils from '../utilities/utils.js';

// Menu that is opened by the modal chart button.
// This allows you to configure various parameters of the chart.
export class ModalChartMenu extends HTMLElement {
    constructor(){
        super();
        this._root = null;

        this.menuButton = null;
        this.menuForm = null;
        this.formClosed = true;
    }

    // Browser calls this method when the element is added to the document
    // (Can be called many times if an element is repeatedly added/removed)
    connectedCallback(){
        this._root = this.attachShadow({mode: 'open'});


        let sheet = utils.CSSToStyleSheet('./css/02-organisms/modal-chart-menu.css');
        this._root.adoptedStyleSheets = [sheet];

        // Outermost container of the menu component.
        this.menuButton = document.createElement('modal-chart-menu-button');
        this.menuForm = document.createElement('modal-chart-menu-form');

        this._root.appendChild(this.menuButton);
        this._root.appendChild(this.menuForm);


        this.menuButton.addEventListener("click", e => this.onMenuButtonClick(e));
        // Captures event "covid-data-load" event that "trickles down" from chart-module parent.

        document.addEventListener("click", e => this.onClick(e));

    }

    // Browser calls this method when the element is removed from the document
    // (Can be called many times if an element is repeatedly added/removed)
    disconnectedCallback() {
        
      }


    onMenuButtonClick(e){
        if(this.formClosed){
            this.menuForm.style.display = "block";

            this.menuForm.style.zIndex = "1000";
            // let button = this.menuButton.getElementsByTagName('button')[0];
            // button.innerText = "Close";
            this.formClosed = false;
        }
        else{
            this.menuForm.style.display = "none";
            this.menuForm.style.zIndex = "-1";
            // let button = this.menuButton.getElementsByTagName('button')[0];
            // button.innerText = "Menu";
            this.formClosed = true;
        }
    }
    onClick(e){
        //console.log(e.target);
        // if(this.menuForm != e.target || this.menuButton != e.target){
        //     this.menuForm.style.display = "none";
        //     this.menuForm.style.zIndex = "-1";
        //     // let button = this.menuButton.getElementsByTagName('button')[0];
        //     // button.innerText = "Menu";
        //     this.formClosed = true;
        // }
    }
}

window.customElements.define("modal-chart-menu", ModalChartMenu);