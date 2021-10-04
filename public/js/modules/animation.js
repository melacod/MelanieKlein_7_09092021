export { Animation };

class Animation {
    
    // Make element appear with fade
    static fadeIn (element, duration = 500, delay = 0) {
        element.style.opacity = 0;
        var keyframes = [
            { opacity: "0", display:"none", offset: 0 },
            { opacity: "1", display:"block", offset: 1 },
        ];
        var timing = { duration: duration, iterations: 1, delay: delay, fill: "forwards" };
        return element.animate(keyframes, timing);
    }

    // Make element disappear with fade
    static fadeOut (element, duration = 500,  delay = 0) {
        var keyframes = [
            { opacity: "1", display:"block", offset: 0 },
            { opacity: "0", display:"none", offset: 1 },
        ];
        var timing = { duration: duration, iterations: 1, delay: delay, fill: "forwards" };
        return element.animate(keyframes, timing);
    }
}