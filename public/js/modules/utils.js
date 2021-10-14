export { Utils };

// utility functions
class Utils {

    // Clean a text consists in
    // - put text in lower case
    // - trim text (remove left/right spaces)
    // - replace special character by their corresponding standard character
    // - replace each group of 2 spaces or more by only one space
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