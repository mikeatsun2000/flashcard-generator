global.$ = $;

const {remote} = require('electron');
const {Menu, BrowserWindow, MenuItem, shell} = remote;
const favicon = require('favicon');
const nodeConsole = require('console');
const appitem_style = require('./js/appitem_style');
const http = require('http');
const mainConsole= new nodeConsole.Console(process.stdout, process.stderr);
let aboutWindow = null;

const App = {
  // log to console
  log: function(mess) {
    mainConsole.log(mess);
  },

  // show "about" window
  about: function () {
    var params = {toolbar: false, resizable: false, show: true, height: 150, width: 400};
    aboutWindow = new BrowserWindow(params);
    aboutWindow.loadURL('file://' + __dirname + '/about.html');
  },

  addApp: function(name, appUrl) {
  
    
    getAppIcon(name, appUrl);
  },
  
  // change folder for sidebar links
  activate: function (anchor) {
    anchor = $(anchor);

    $('#sidebar li').removeClass('active');
    $('#sidebar i').removeClass('icon-white');

    anchor.closest('li').addClass('active');
    anchor.find('i').addClass('icon-white');

    this.setApp(anchor.attr('app-url'));
  },

  // set path for file explorer
  setApp: function (url) {
    $('#app-container').attr('src', url);
  }
};


function getAppIcon(name, appurl) {
    favicon(appurl, (err, iconUrl)=>{

    if (err) {
      App.log(err);
      //TODO - give feedback
    } else {
       
      //construct listiem
      // <i> element
      const iElement = document.createElement('i');
    
      for (propName in appitem_style) {
        if (appitem_style.hasOwnProperty(propName)) {
          iElement.style[propName] = appitem_style[propName];
        }
      }
      
      iElement.style.background = 'rgba(0, 0, 0, 0) url("' + iconUrl + '") no-repeat 0px 0px)';
      iElement.style.backgroundImage = 'url("' + iconUrl + '")';
      iElement.style.backgroundOrigin = 'padding-box';
      iElement.style.backgroundPosition = '0px 0px';
      iElement.style.backgroundPositionX = '0px';
      iElement.style.backgroundPositionY = '0px';

      // <a> element
      const aElement = document.createElement('a');
      aElement.setAttribute('href', '#');
      aElement.setAttribute('app-url', appurl);
      aElement.appendChild(iElement);
      aElement.appendChild(document.createTextNode(name));


     $(aElement).on('click', function (event) {
        event.preventDefault();
        App.activate(aElement);
     });
     

      // <li> item
      const liElement = document.createElement('li');
      liElement.appendChild(aElement);

      $(liElement).insertBefore($('#applist-end'));
    }
  });
}

$(document).ready(function() {

  //initMenu();
  //App.addApp('Duolingo', 'http://www.duolingo.com/');

  /*
  var folder = new folder_view.Fo.lder($('#files'));
  var addressbar = new abar.AddressBar($('#addressbar'));

  folder.open(process.cwd());
  addressbar.set(process.cwd());

  App.folder = folder;
  App.addressbar = addressbar;

  folder.on('navigate', function(dir, mime) {
    if (mime.type == 'folder') { 
      addressbar.enter(mime);
    } else {
      shell.openItem(mime.path);
    }
  });00000

  addressbar.on('navigate', function(dir) {
    folder.open(dir);
  });
  */
  // sidebar favorites
  /*
  $('[app-url]').on('click', function (event) {
    App.log('clicked');
    event.preventDefault();
    App.activate(this);
  });
  */
});





