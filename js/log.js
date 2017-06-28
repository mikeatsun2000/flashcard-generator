const mainConsole= new nodeConsole.Console(process.stdout, process.stderr);
let defaultLevel = 0;
module.exports = {
    DEBUG: 0,
    INFO: 1,
    WARN: 2,

    // log message to console
    log: function(mess, level) {
        if (!level) {
            level = 0;
        }

        if (level >= defaultLevel) {
            mainConsole.log(__filename + '\n' + mess);
        }  else {
            //TODO
        }  
    },

    printStackTrace: function(e, level ) {
        if (!level) {
            level = 0;
        }

        if (level >= defaultLevel) {
            mainConsole.log(__filename + '\n' +  e.stack);
        }  else  {
            //TODO
        }
    },

    setLevel: function(level) {
        defaultLevel = level;
    }
}

