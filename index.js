const electron = require('electron');

const app = electron.app;
const ipcMain = electron.ipcMain;
const clipboard = electron.clipboard;

const console = require('console');
const mainConsole= new console.Console(process.stdout, process.stderr);

const Logger = require('./js/log');
const logger = new Logger('index.js');


// adds debug features like hotkeys for triggering dev tools and reload
require('electron-debug')();

// prevent window being garbage collected
let mainWindow;
let translateWindow;

function onClosed() {
	// dereference the window
	// for multiple windows store them in an array
	mainWindow = null;
}

function createMainWindow() {
	const win = new electron.BrowserWindow({
		width: 900,
		height: 600
	});

	win.loadURL(`file://${__dirname}/index.html`);
	win.on('closed', onClosed);

	return win;
}

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (!mainWindow) {
		mainWindow = createMainWindow();
	}
});

app.on('ready', () => {
	mainWindow = createMainWindow();
});

ipcMain.on('show-translate-dialog', (event, arg) => {

	const params = {toolbar: false, 
					parent:mainWindow, 
					modal:true,
					frame: false, 
					resizable: true, 
					show: false, 
					height: 190, 
					width: 360};
					
	translateWindow = new electron.BrowserWindow(params);
	translateWindow.loadURL('file://' + __dirname + '/translate.html');
	translateWindow.once('ready-to-show', () => {
			translateWindow.show();
		});

	translateWindow.webContents.on('did-finish-load', () => {
		translateWindow.webContents.send('clipboard-content', clipboard.readText());
	})
  
});

ipcMain.on('dismiss-translate-dialog', (event, arg)=> {
	logger.log('arg=' + arg);

	if (arg != "") {
		mainWindow.webContents.send('load-translate-phrase', arg);
	}
	translateWindow.close();
	translateWindow = null;
});

/* Support logging from renderer process */

ipcMain.on('log-message', (event, arg) => {
	mainConsole.log(arg);
});
