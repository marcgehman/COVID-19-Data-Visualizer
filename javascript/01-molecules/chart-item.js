"use strict";

import * as utils from '../utilities/utils.js';

export const charts = {
    LINE_PLOT: 'line-plot',
    HISTOGRAM: 'histogram'
}

// An object that acts as a container for the actual chart element.
// ChartItem is used to abstract away the details of the individual
// chart custom element types that are developed with D3.
export class ChartItem extends HTMLElement {
    constructor(){
        super();

        this.chart_type = "";
        this._chart = null;
        this._root = null;
        this.data = null;

    }

    // Browser calls this method when the element is added to the document
    // (Can be called many times if an element is repeatedly added/removed)
    connectedCallback(){
        this._root = this.attachShadow({mode: 'open'});
        let sheet = utils.CSSToStyleSheet('./css/01-molecules/chart-item.css');
        this._root.adoptedStyleSheets = [sheet];

       this._root.addEventListener("chart-type-change", e => this.onChartTypeChange(e));

        let event = new CustomEvent("chart-type-change", {bubbles: true, composed: true, detail: "line-plot"});
        this._root.dispatchEvent(event);

       
    }

    // Browser calls this method when the element is removed from the document
    // (Can be called many times if an element is repeatedly added/removed)
    disconnectedCallback() {
        
      }
      

    // Updates the chart component when the chart-type changes.
    // E.g. From Line-Plot to Histogram, etc.
    onChartTypeChange(e){

        let chart_type = e.detail;
        const chartTypeExists = Object.values(charts).includes(chart_type)
        if(chartTypeExists){
            // Don't update the chart object unless the chart type has changed.
            if(chart_type != this.chart_type){
                if(this._chart != null){
                    this._root.removeChild(this._chart);   
                }
    
                this.chart_type = chart_type;
                this._chart = document.createElement(chart_type);
                this._root.appendChild(this._chart);
            }
            
        }
        else{
            console.log("ERROR: Chart type does not exist!");
        }

    }

    // Pass data to the chart.
    set data(data){
        if (this._chart){
            this._chart.data = data;
        }
    }

    
}

window.customElements.define("chart-item", ChartItem);