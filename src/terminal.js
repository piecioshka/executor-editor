terminal = (function () {
    
    var delay = 100,
        
        id = "terminal";
    
    return {
        obj: null,
        
        prompt: "> ",
        
        init: function () {
            this.obj = utils.byId(id);
            this.obj.focus();
            
            this.setSizes();
            this.clear();
            this.addPrompt();
        },
        write: function (text) {
            this.obj.value += text;
        },
        
        clear: function () {
            this.obj.value = "";
        },
        addPrompt: function () {
            this.write(this.prompt);
        },
        addNewLine: function () {
            this.write("\n");
            this.addPrompt();
        },
        
        setSizes: function () {
            this.obj.style.height = pklib.utils.size.window("height") - 21 + "px";
            this.obj.style.width = pklib.utils.size.window("width") + "px";
        }
    };
    
})();
