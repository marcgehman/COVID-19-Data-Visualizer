
import * as utils from '../utilities/utils.js';


let template = "<div id='header'> </div>"

// Header component of the chart module.
export class ChartHeader extends HTMLElement {
    constructor(){
        super();
        this._root = null;
    }

    // Browser calls this method when the element is added to the document
    // (can be called many times if an element is repeatedly added/removed)
    connectedCallback(){
        this._root = this.attachShadow({mode: 'open'});

        let sheet = utils.CSSToStyleSheet('./css/02-organisms/chart-header.css');
        this.adoptedStyleSheets = [sheet];
        this._root.adoptedStyleSheets = [sheet];

        this._root.innerHTML = template;
        let div = this._root.getElementById("header");
     

        // Remove Button 
        let removeButton = document.createElement('remove-chart-button');
        let menu = document.createElement('modal-chart-menu'); 
        div.appendChild(removeButton);
        div.appendChild(menu);

    }

    // Browser calls this method when the element is removed from the document
    // (Can be called many times if an element is repeatedly added/removed)
    disconnectedCallback() {
        
      }


}

window.customElements.define("chart-header", ChartHeader);