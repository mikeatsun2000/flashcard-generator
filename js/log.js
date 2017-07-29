
const console = require('console');
const mainConsole= new console.Console(process.stdout, process.stderr);

const electron = require('electron');
const app = electron.app;
const ipcRenderer = electron.ipcRenderer;



class Logger {
    
    constructor(defaultLevel) {
        
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
            this.writer(new Date().toString() + ' : ' + 
                parseException(new Error()) + ' : ' 
                + mess );
            
        }
    }

    printStackTrace(e, level) {
        if (level === undefined) {
            level = 0;
        }

        if (level >= this.defaultLevel) {
            this.writer(  e.stack + '\n\n');
        } 
    }
}


function parseException(e) {

	frame = e.stack.split("\n")[2];
	fileAndLineField = frame.split(/\s*at\s\S*\s/)[1];
	return fileAndLineField.substring(1, fileAndLineField.length - 1).split('flashcard-generator/')[1]
}


module.exports = Logger;



