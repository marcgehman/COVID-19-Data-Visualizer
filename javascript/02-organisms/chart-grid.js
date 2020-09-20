"use strict"

export class ChartGrid extends HTMLElement {
    constructor(){
        super();
        this._root = null;
        this.addChartButton = null;
    }

    // Browser calls this method when the element is added to the document
    // (can be called many times if an element is repeatedly added/removed)
    connectedCallback(){
        this._root = this.attachShadow({mode: 'open'});
       
        this.addChartButton = document.createElement('add-chart-button');
        this.addChartButton.dispatchEvent(new Event('click', {bubbles: true, composed: true}));

        this._root.appendChild(this.addChartButton);

        this.addChartButton.addEventListener("click", e => this.onAddChartButtonClick(e)); 
        this._root.addEventListener("remove-chart-module", e => this.onRemoveChartModule(e));

    }

    // Browser calls this method when the element is removed from the document
    // (Can be called many times if an element is repeatedly added/removed)
    disconnectedCallback() {
        
      }

    // When the "Add Chart Button" is clicked, a new chart is created.
    onAddChartButtonClick(e){
        if(this._root){
            const chart_item = document.createElement('chart-module');
        
            this._root.insertBefore(chart_item, this.addChartButton);
        }
                
    }

    // Deletes the chart module when the "X" is clicked.
    onRemoveChartModule(e){
        this._root.removeChild(e.target);
    }


}

window.customElements.define("chart-grid", ChartGrid);