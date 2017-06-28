
const console = require('console');
const mainConsole= new console.Console(process.stdout, process.stderr);

const electron = require('electron');
const app = electron.app;
const ipcRenderer = electron.ipcRenderer;



class Logger {
    constructor(filename, defaultLevel) {
        this.filename = filename;
        if (defaultLevel) {
            this.defaultLevel = defaultLevel;
        } else {
            this.defaultLevel = 0;
        }

        if (process.type == 'renderer') {
            this.writer = (message) => {
                ipcRenderer.send('log-message', message);
            }
        } else {
            this.writer = mainConsole.log;
        }
    }

    static get DEBUG() {
        return 0;
    }

    static get WARN() {
        return 1;
    }

    static get INFO() {
        return 2;
    }

    log(mess, level) {
         if (level === undefined) {
            level = 0;
        }

        if (level >= this.defaultLevel) {
            this.writer(this.filename + '\n' + mess + '\n\n');
        }
    }

    printStackTrace(e, level) {
        if (level === undefined) {
            level = 0;
        }

        if (level >= this.defaultLevel) {
            this.writer(this.filename + '\n' +  e.stack + '\n\n');
        } 
    }
}

module.exports = Logger;

/*
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
            mainConsole.log(relativeFilename() + '\n' + mess);
        }  else {
            //TODO
        }  
    },

    printStackTrace: function(e, level ) {
        if (!level) {
            level = 0;
        }

        if (level >= defaultLevel) {
            mainConsole.log(relativeFilename() + '\n' +  e.stack);
        }  else  {
            //TODO
        }
    },

    setLevel: function(level) {
        defaultLevel = level;
    }
}

function relativeFilename() {
    const dirLength = app.getAppPath();
    return __filename.substring(dirLength);
}
*/
