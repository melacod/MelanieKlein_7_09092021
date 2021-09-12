export { Data };

// data manager
class Data {

    // load JSON data file
    static async loadJsonData () {

        return fetch('./public/data/data.json')

        .then(function(response) {
            if (response.status !== 200) {
                console.log('Bad response from server! Status Code: ' + response.status);
                return;
            }
            return response.json();
            
        }).catch(function(err) {
            console.log('Error occurred!', err);
        });
    }

}