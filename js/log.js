const mainConsole= new nodeConsole.Console(process.stdout, process.stderr);

module.exports = {
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    defaultLevel: 0,

    // log message to console
    log: function(mess, level) {
        if (level && level >= defaultLevel) {
            mainConsole.log(__filename + '\n\n' + mess);
        }  else {
            //TODO
        }  
    },

    printStackTrace: function(e, level ) {
        if (this.level >= level) {
            mainConsole.log(__filename + '\n\n' +  e.stack);
        }  else  {
            //TODO
        }
    }
}

