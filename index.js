const electron = require('electron');

const app = electron.app;
const ipcMain = electron.ipcMain;
const clipboard = electron.clipboard;

const console = require('console');
const mainConsole= new console.Console(process.stdout, process.stderr);

const Logger = require('./js/log');
const logger = new Logger();



// adds debug features like hotkeys for triggering dev tools and reload
require('electron-debug')();

// prevent window being garbage collected
let mainWindow;
let translateWindow;
let addEditWindow;


function onClosed() {
	// dereference the window
	// for multiple windows store them in an array
	mainWindow = null;
	global.mainWindow = null;
}

function createMainWindow() {
	const win = new electron.BrowserWindow({
		width: 1200,
		height: 800
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
		mainWindow = createMainWindow()
		global.mainWindow = mainWindow;
	}
});

app.on('ready', () => {
	mainWindow = createMainWindow();
	global.mainWindow = mainWindow;
});

ipcMain.on('show-translate-dialog', (event, arg) => {

	const params = {toolbar: false, 
					parent:mainWindow, 
					modal:true,
					frame: false, 
					resizable: true, 
					show: false, 
					height: 250, //190
					width: 500}; //360
					
	translateWindow = new electron.BrowserWindow(params);
	translateWindow.loadURL('file://' + __dirname + '/translate.html');
	translateWindow.once('ready-to-show', () => {
			translateWindow.show();
		});

	translateWindow.webContents.on('did-finish-load', () => {
		//clipboard.readText('selection') returns clipboard content even
		// if nothing is selected.  We only want to supply a default translate
		// phrase if there is a bonafide selection.
		let content;
		const clip = clipboard.readText();
		const selection = clipboard.readText('selection');

		if (clip != selection || clip == '') {
			content = selection;
		} else {
			content = "";
		}
		translateWindow.webContents.send('clipboard-content', content);
	})
  


});

ipcMain.on('dismiss-translate-dialog', (event, arg) => {
	if (!(arg === "")) {
		 mainWindow.webContents.send('load-translate-phrase', arg);
	}

	translateWindow.close();
	translateWindow = null;

});



ipcMain.on('show-addedit-dialog', (event, arg) => {
	
	logger.log('showing addeditapp dialog');
	const params = {toolbar: false, 
					parent:mainWindow, 
					modal:true,
					frame: false, 
					resizable: true, 
					show: false, 
					height: 250, 
					width: 500};
			
	let url = 'file://' + __dirname + '/addedit.html';
	if (arg) {
		if (arg['id']) /*edit dialog*/	{
				url += ('?id=' + arg['id'] + '&name=' + arg['name'] + '&url=' + arg['url']);
		}

		if (arg['eBook']) {
			url += '?eBook=true';
		} 
	}



	addEditWindow = new electron.BrowserWindow(params);
	addEditWindow.loadURL(url);
	addEditWindow.once('ready-to-show', () => {
		addEditWindow.show();
	});
});



ipcMain.on('dismiss-addedit-dialog', (event, arg)=> {
	logger.log('dismiss-addedit-dialog - arg=' + arg);
	logger.log('name=' + arg['name'] + ' url=' + arg['url']);
	logger.log('isEbook=' + arg['isEbook']);
	
	if (arg != "") {
		mainWindow.webContents.send('load-addedit-args', arg);
	}
	addEditWindow.close();
	addEditWindow = null;
});



/* Support logging from renderer process */

ipcMain.on('log-message', (event, arg) => {
	mainConsole.log(arg);
});