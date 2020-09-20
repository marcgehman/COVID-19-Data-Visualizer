    

export function connectToCovidTracking(onloadCallback, request){
        // Create a request variable and assign a new XMLHttpRequest object to it.


        // Open a new connection, using the GET request on the URL endpoint
        request.open('GET', 'https://api.covidtracking.com/v1/us/daily.json', true);
    
        request.onload = function() {
            onloadCallback(request.response);
        }
    
        // Send request
        request.send();
}



    