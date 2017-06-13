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
  cd: function (anchor) {
    anchor = $(anchor);

    $('#sidebar li').removeClass('active');
    $('#sidebar i').removeClass('icon-white');

    anchor.closest('li').addClass('active');
    anchor.find('i').addClass('icon-white');

    this.setPath(anchor.attr('nw-path'));
  },

  // set path for file explorer
  setPath: function (path) {
    if (path.indexOf('~') == 0) {
      path = path.replace('~', process.env['HOME']);
    }
    this.folder.open(path);
    this.addressbar.set(path);
  }
};


function getAppIcon(name, appurl) {
  favicon(appurl, (err, iconUrl)=>{

    if (err) {
      App.log('error');
      throw err;
    } else {
      App.log(iconUrl);
      let data = '';
      http.get(iconUrl, (res) => {
        let buf = Buffer('', 'utf8');
        res.on('data', (buf)=> {
          data += buf.toString();
        });
        
        res.on('end', ()=> {
          //construct listiem
          // <i> element
          const iconData = (new Buffer(data)).toString('base64');
          const iElement = document.createElement('i');
        
          for (propName in appitem_style) {
            if (appitem_style.hasOwnProperty(propName)) {
              iElement.style[propName] = appitem_style[propName];
            }
          }
          //App.log(iElement.style);
          //iElement.style.backgroundImage = 'url(data:image/x-icon;base64,' + iconData + ')'
          iElement.style.background = 'rgba(0, 0, 0, 0) url("' + iconUrl + '") no-repeat left top)';
          iElement.style.backgroundImage = 'url("' + iconUrl + '")';

          // <a> element
          const aElement = document.createElement('a');
          aElement.setAttribute('href', '#');
          aElement.setAttribute('app-url', appurl);
        
          aElement.appendChild(iElement);
          aElement.appendChild(document.createTextNode(name));
          //App.log(aElement.innerHTML)

          // <li> item
          const liElement = document.createElement('li');
          liElement.appendChild(aElement);
          //App.log(liElement.innerHTML);

          document.getElementById('sidebar').appendChild(liElement);

        });

       
      });
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
  });

  addressbar.on('navigate', function(dir) {
    folder.open(dir);
  });
  */
  // sidebar favorites
  $('[nw-path]').bind('click', function (event) {
    event.preventDefault();
    App.cd(this);
  });
});





