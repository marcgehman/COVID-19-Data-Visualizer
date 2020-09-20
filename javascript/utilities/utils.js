
const fs = require('fs');
// Given a string name of a CSS Custom Property,
// Return the associated parsed integer value(s) as an array.
export function getCSSPropertyValueInt(property_name){
    var CSSvalues = getComputedStyle(document.documentElement,null).getPropertyValue(property_name);
    // Parse ints from every item in the CSS variable, map to an array, and filter out any "NaN"s.
    return CSSvalues.split(' ').map(x=>parseInt(x)).filter(x => !Number.isNaN(x));
}

export function getCSSPropertyValue(property_name){
    var CSSvalues = getComputedStyle(document.documentElement,null).getPropertyValue(property_name);
    return CSSvalues;
}


// Converts a CSS file to a CSSStyleSheet object.
export function CSSToStyleSheet(filepath){
    // Read in CSS file as text.
    let styleText = fs.readFileSync(filepath);

    // Constructable Stylesheet
    // The constructable stylesheet helps prevent flash-of-unstyled-content (FOUC)
    // and also will lead to better performance.
    let sheet = new CSSStyleSheet();
    sheet.replace(styleText);
    return sheet;
}