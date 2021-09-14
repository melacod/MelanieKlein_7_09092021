export { Template };

class Template {

     // load all template HTML files
     static async loadTemplates () {
        Template.templates = {};
        for (let templateName of ['filter', 'filter-option']) {
            Template.templates[templateName] = await Template.loadTemplate(templateName);
        }
     }

    
    // load template HTML file
    static async loadTemplate (templateName) {
        return fetch('./public/templates/' + templateName + '.html')
            
            .then(function(response) {
                if (response.status !== 200) {
                    console.log('Bad response from server! Status Code: ' + response.status);
                    return;
                }
                return response.text();
            
            }).catch(function(err) {
                console.log('Error occurred!', err);
            });
    }

    // load template HTML file and replace {attribute} tags
    static fillTemplate ( templateName, object ) {
        const templateContent = Template.templates[templateName];
        return templateContent.replace(
            /{(\w*)}/g, 
            function( m, key ) {
                if (Object.prototype.hasOwnProperty.call(object, key)) {
                    return object[key];
                } else {
                    return "";
                }
            }
        );
    }
}
