export { Utils };

// utility functions
class Utils {

    static cleanText (inputText) {
        let cleanText = inputText.toLowerCase().trim();

        cleanText = cleanText.replaceAll("à","a");
        cleanText = cleanText.replaceAll("â","a");
        cleanText = cleanText.replaceAll("è","e");
        cleanText = cleanText.replaceAll("é","e");
        cleanText = cleanText.replaceAll("ê","e");
        cleanText = cleanText.replaceAll("ë","e");
        cleanText = cleanText.replaceAll("ç","c");
        cleanText = cleanText.replaceAll("ï","i");
        cleanText = cleanText.replaceAll(/ {2,}/g," ");
        
        return cleanText;
    }

}