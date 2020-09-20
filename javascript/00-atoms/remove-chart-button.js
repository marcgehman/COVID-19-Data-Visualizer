"use strict";

import * as utils from '../utilities/utils.js';


let template = `<svg id="container"> </svg>`;
var svgns = "http://www.w3.org/2000/svg";

// Simple "X" button that removes the target chart from the chart-grid.
export class RemoveChartButton extends HTMLElement {
    constructor(){
        super();
        this._root = null;
    }

    // Browser calls this method when the element is added to the document
    // (Can be called many times if an element is repeatedly added/removed)
    connectedCallback(){
        this._root = this.attachShadow({mode: 'open'});

        let sheet = utils.CSSToStyleSheet('./css/00-atoms/remove-chart-button.css');
        this.adoptedStyleSheets = [sheet];
        this._root.adoptedStyleSheets = [sheet];

        // Construct button's main SVG element.
        this._root.innerHTML = template;

       
        let viewBox_width = 100;
        let viewBox_height = 100;
        let x_position = viewBox_width / 2;
        let y_position = viewBox_height / 2;
        let rectWidth = 8;
        let rectHeight = 75;


        var svg = this._root.getElementById("container");
        svg.setAttribute('viewBox', '0 0 100 100');

        // Construct and style the SVG's rotated rectangles to form the "X" component.
        let rect_right = this.buildCenteredRotatedRectangle('rectRight', 45, x_position, y_position, rectWidth, rectHeight)
        
        let rect_left = this.buildCenteredRotatedRectangle('rectLeft', -45, x_position, y_position, rectWidth, rectHeight)
        svg.append(rect_right);
        svg.append(rect_left);

       svg.addEventListener("click", e => this.onClick(e));
        
    }

    // Browser calls this method when the element is removed from the document
    // (Can be called many times if an element is repeatedly added/removed)
    disconnectedCallback() {
        
      }

    // Center a rectangle in an SVG by calculating the X,Y positions
    // using the width,height dimensions.
    buildCenteredRotatedRectangle(id, degrees, x_pos, y_pos, rectWidth, rectHeight){
        let rect = document.createElementNS(svgns, 'rect');
        let transformString = "translate(-" + rectWidth/2 + ", -" + rectHeight/2 + ") rotate(" + degrees + " " + (x_pos + rectWidth / 2).toString() + " " + (y_pos + rectHeight / 2).toString() + ")";

        rect.setAttribute('id', id);
        rect.setAttribute('width', rectWidth);
        rect.setAttribute('height', rectHeight);
        rect.setAttribute('x', "50%");
        rect.setAttribute('y', "50%");
        rect.setAttribute("transform", transformString);
        return rect;
    }

    onClick(e){
      let event = new CustomEvent("remove-chart-click", {bubbles: true, composed: true});
      this._root.dispatchEvent(event);
    }
            
}

window.customElements.define("remove-chart-button", RemoveChartButton);