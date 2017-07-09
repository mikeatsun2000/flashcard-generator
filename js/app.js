//app.js
const favicon = require('favicon');
const nodeConsole = require('console');
const {remote, ipcRenderer,clipboard} = require('electron');
const {Menu, BrowserWindow, MenuItem, shell} = remote;
const http = require('http');
const {normalize} = require('path');
const Logger = require('./js/log');
const Domfilter = require('./js/domfilter');
const appItemStyle= require('./js/appitem-style');
const logger = new Logger('js/app.js');

let domfilter = new Domfilter(3001);
let activeApp = 'home';
let activeUrl = 'home.html';

App =  {

  activeApp: 'home',
  activeUrl: 'home.html',
  // show "about" window
  about: function() {
    const params = {toolbar: false, resizable: false, show: true, height: 150, width: 400};
    const aboutWindow = new BrowserWindow(params);

    //at the moment, about.html lives in the parent directory
    //const directory = normalize(__dirname + '/..'..........);
    //alert('file://' + directory + '/about.html');

    aboutWindow.loadURL('file://' + __dirname + '/about.html');
  },

  translate: function(params) {
    ipcRenderer.send('show-translate-dialog', 'ping');
  },

  // change application for sidebar link
  activate: function(anchor) {
    anchor = $(anchor);

    $('#sidebar li').removeClass('active');
    $('#sidebar i').removeClass('icon-white');

    anchor.closest('li').addClass('active');
    anchor.find('i').addClass('icon-white');

    this.setApp(anchor.attr('name'), anchor.attr('app-url'));
  },

  
  setApp: function(name, url) {    
    if (this.activeApp != name) {
      this.activeApp = name;
      this.activeUrl = url;
      $('#app-view').attr('src', url);
    }

    $('#app-view').removeClass('hide' );3
    $('#dict-view').addClass('hide');
    $('#button-bar').hide();
    
  },

  addAppItem: function() {
    ipcRenderer.send('show-addedit-dialog');
  },

  editAppItem:  function(name, url) {
    const id = 'id-' + name.replace(/ /g, '-');
    logger.log('in App.editApp id=' + id);
    ipcRenderer.send('show-addedit-dialog', {'id': id,'name': name, 'url': url});
  }, 

  addApp: function(args) {
    const name = args['name'];
    const appUrl = args['url'];

    favicon(appUrl, (err, iconUrl)=>{

      if (err) {
        logger.log(err.message);
        //TODO - give feedback
      } else {
        
        //construct listiem
        // <i> element
        const iElement = document.createElement('i');
      

        
        let propName;
        for (propName in appItemStyle) {
          if (appItemStyle.hasOwnProperty(propName)) {
            iElement.style[propName] = appItemStyle[propName];
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
        aElement.setAttribute('app-url', appUrl);
        aElement.setAttribute('name', name);
        aElement.appendChild(iElement);
        aElement.appendChild(document.createTextNode(name)); 
        $(aElement).on('click', function (event) {
          event.preventDefault();
          App.activate(aElement);
      });

    
        // <li> item
        const liElement = document.createElement('li');
        liElement.setAttribute('id', 'id-' + name);
        liElement.className = "context-menu-editapp"
        liElement.appendChild(aElement);

        $(liElement).insertBefore($('#applist-end'));
     }
    });
  },

  editApp: function(args) {
    //logger.log('editApp -- name = ' + args['name']);
    //logger.log('editApp -- url = ' + args['url']);
    //logger.log('editApp -- id = ' + args['id']);

    const liElement = document.getElementById(args['id']);
    liElement.setAttribute('id', 'id-' + args['name'].replace(/ /g, "-"));
    
    const aElement = liElement.firstChild;
    aElement.setAttribute('name', args['name']);
    aElement.setAttribute('app-url',args['url']);

    aElement.childNodes[1].textContent = args['name'];

  },


  deleteAppItem: function(element) {
    element.parentNode.removeChild(element);
  }
}






















module.exports = App;