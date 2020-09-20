
import * as utils from '../utilities/utils.js';
import * as covidTrack from '../utilities/covid-tracking.js';

// Web Component that contains a chart item and a chart header, acting as a self-contained module.
export class ChartModule extends HTMLElement {
    constructor(){
        super();
        this._root = null;
        this.covidData = null;
        this.chartItem = null;
        this.request = null;
        this.maxDate = null;
        this.minDate = null;
        this.dataKeys = [];
    }

    // Browser calls this method when the element is added to the document
    // (can be called many times if an element is repeatedly added/removed)
    connectedCallback(){
        this._root = this.attachShadow({mode: 'open'});

        let sheet = utils.CSSToStyleSheet('./css/02-organisms/chart-module.css');
        this.adoptedStyleSheets = [sheet];
        this._root.adoptedStyleSheets = [sheet];

        let header = document.createElement("chart-header");
        this.chartItem = document.createElement("chart-item");
        this._root.appendChild(header);
        this._root.appendChild(this.chartItem);
       
        this.request = new XMLHttpRequest();
        this.covidData = {};
        covidTrack.connectToCovidTracking(this.onCovidDataLoad.bind(this), this.request);

        this._root.addEventListener("remove-chart-click", e => this.onRemoveChart(e));
        this._root.addEventListener("menu-form-submit", e => this.onMenuFormSubmit(e));
    }

    // Browser calls this method when the element is removed from the document
    // (can be called many times if an element is repeatedly added/removed)
    disconnectedCallback() {
        
      }

    onRemoveChart(e){
        let event = new CustomEvent("remove-chart-module", {bubbles: true, composed: true});
        this._root.dispatchEvent(event);
    }

    // When the menu form is submitted,
    // extract the form data,
    // get the covid data, and send this to the chart for rendering.
    onMenuFormSubmit(e){
        let eventObj = e.detail;
        let startDate = eventObj.startDate;
        let endDate = eventObj.endDate;
        let dataType = eventObj.dataType;
        
        let data = [];
        this.covidData.forEach((element) => {
            let elementDate = this.convertIntDateToStringDate(element.date);
            if (elementDate >= startDate && elementDate <= endDate){
                let dataObject = {date: elementDate, typeName: dataType, typeValue: element[dataType], states: "All"};
                data.push(dataObject);
            }
            
        });

        this.sendDataToChart(data);

    }
    sendDataToChart(data){
        this.chartItem.data = data
    }

    // Converts a date in integer format to string.
    // Example - 20200917 to "2020-09-17"
    convertIntDateToStringDate(intDate){
        let tempDate = intDate.toString();
        let year = tempDate.substring(0,4);
        let month = tempDate.substring(4,6);
        let day = tempDate.substring(6,8);
        let stringDate = year + "-" + month + "-" + day;
        return stringDate;
    }
    // Callback used to store data from the Get request to the Covid Tracking API.
    onCovidDataLoad(response){
        // Begin accessing JSON data here
        this.covidData = JSON.parse(response);
        
        // Get the minimum and maximum dates in the dataset.
        let dates = [];
        this.covidData.forEach((object) =>{
            dates.push(object.date);
        });
        this.maxDate = this.convertIntDateToStringDate(Math.max.apply(null, dates));
        this.minDate = this.convertIntDateToStringDate(Math.min.apply(null, dates));

        // Get all the desired keys out of the JSON object.
        for(var k in this.covidData[0]){
            let excludedData = ['date', 'dateChecked', 'lastModified', 'hash']; 
            if (!excludedData.includes(k)){
                this.dataKeys.push(k);
            }
        }
        var eventObject = {keys: this.dataKeys, minDate: this.minDate, maxDate: this.maxDate};
        // Create event to update the modal-chart-menu with data.
        let event = new CustomEvent("covid-data-load", {capture:true, composed: true, detail: eventObject});
        document.dispatchEvent(event);
       
    }
}

window.customElements.define("chart-module", ChartModule);