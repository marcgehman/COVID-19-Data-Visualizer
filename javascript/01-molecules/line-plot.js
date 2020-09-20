
"use strict";
const d3 = require("d3");
import * as utils from '../utilities/utils.js';
let template = `<svg> </svg>`;
export class LinePlot extends HTMLElement {
    constructor(){
        super();
        this._root = null;
        this.data = null;
        this.d3_svg = null;
        this.bgColor = null;
        this.marginLeft = null;
        this.marginRight = null;
        this.marginTop = null;
        this.marginBottom = null;
    }

    // Browser calls this method when the element is added to the document
    // (Can be called many times if an element is repeatedly added/removed)
    connectedCallback(){
        this._root = this.attachShadow({mode: 'open'});
        this._root.innerHTML = template;
        
        let sheet = utils.CSSToStyleSheet('./css/01-molecules/line-plot.css');
        this._root.adoptedStyleSheets = [sheet];
        
        // Get the values out of the CSS Custom Properties that the line-plot needs.
        this.height = utils.getCSSPropertyValueInt('--chart-height')[0];
        this.width = utils.getCSSPropertyValueInt('--chart-width')[0];
        var margins = utils.getCSSPropertyValueInt('--chart-margins');
        this.bgColor = utils.getCSSPropertyValue('--grey-300');
        
        this.marginTop = margins[0],
        this.marginRight = margins[1],
        this.marginBottom = margins[2],
        this.marginLeft = margins[3];
        this.width -= this.marginLeft + this.marginRight;
        this.height -= this.marginTop + this.marginBottom;


        // Append the svg object to the body of the page
        this.d3_svg = d3.select(this._root).select("svg")
        .attr("style", "background-color:" + this.bgColor + ";")
        .append("g")
        .attr("transform",
            "translate(" + this.marginLeft + "," + this.marginTop + ")");

    }

    // Browser calls this method when the element is removed from the document
    // (can be called many times if an element is repeatedly added/removed)
    disconnectedCallback() {
        
      }

    // Clear the SVG element's contents.
    resetSVG(){

        this.d3_svg.selectAll("*").remove();
        this.d3_svg = d3.select(this._root).select("svg")
        .attr("style", "background-color:" + this.bgColor + ";")
        .append("g")
        .attr("transform",
            "translate(" + this.marginLeft + "," + this.marginTop + ")");
    }

    set data(data){
        if(data){
            this.onDataUpdated(data);
        }
    }

    onDataUpdated(data){
        
        // Reset the SVG component every time the data is updated.
        this.resetSVG();

        var sumstat = d3.group(data, d => d.states); // nest function allows to group the calculation per level of a factor

        // Add X axis --> it is a date format
        var x = d3.scaleTime()
            .domain(d3.extent(data, function (d) { return new Date(d.date); }))
            .range([0, this.width]);
        this.d3_svg.append("g")
            .attr("transform", "translate(0," + this.height + ")")
            .call(d3.axisBottom(x).ticks(5).tickFormat(d3.timeFormat("%m-%d-%Y")));

        // Add Y axis
        var y = d3.scaleLinear()
            .domain([d3.min(data, function (d) { return +d.typeValue; }), d3.max(data, function (d) { return +d.typeValue; })])
            .range([this.height, 0]);
        this.d3_svg.append("g")
            .call(d3.axisLeft(y));

        // Color palette
        var res = Array.from(sumstat.keys()); // list of group names
        var color = d3.scaleOrdinal()
            .domain(res)
            .range(['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33', '#a65628', '#f781bf', '#999999'])

        // Get the data into the proper form.
        var finalData = [];
        for (var [key, value] of sumstat.entries()){
            let entry = {
                key: key,
                values: value
            };
            finalData.push(entry);
        }
        

        // Draw the line
        this.d3_svg.selectAll(".line")
            .data(finalData)
            .enter()
            .append("path")
            .attr("fill", "none")
            .attr("stroke", function (d) {return color(d.key); })
            .attr("stroke-width", 1.5)
            .attr("d", function (d) {
                return d3.line()
                    .x(function (d) { return x(new Date(d.date)); })
                    .y(function (d) { return y(+d.typeValue); })
                    (d.values) 
            })
            

    }

}

window.customElements.define("line-plot", LinePlot);