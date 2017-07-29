//domfilter.js


const http = require('http');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

//const Logger = require('./log');
//const logger = new Logger();
//const logger = new Logger('js/domfilter.js');
//const logger = require('electron').remote.getGlobal('logger');


class Domfilter {

    
    constructor(port) {
        this.server = http.createServer(requestHandler);
        this.server.listen(port, 'localhost');
    }

    stop() {
        this.server.close();
    }
}

const readerRootDirectory = __dirname + '/../reader/';

function requestHandler(request, response)  {  
    logger.log('url = ' + request.url);
    if (request.url == '/favicon.ico') {
        serveStaticContent(__dirname + '/../img/', 'favicon.ico', response);
        
    } else if (request.url.startsWith('/translate/')) {
        const phrase = request.url.substring(11);
        loadAndTrim('http://www.spanishdict.com/translate/' + phrase, response);
      
    } else if (request.url.startsWith('/conjugate/')) {
        const phrase = request.url.substring(11);
        loadAndTrim('http://www.spanishdict.com/conjugate/' + phrase, response);

    } else if (request.url.startsWith('/reader/')) {
        const relativePath = request.url.substring(8);
       serveReaderContent(readerRootDirectory, relativePath, response);
    }
}

function spliceBetween(str, toinsert, start, end) {
    const startindex = str.search(start) + start.length ;
    const endindex = str.search(end);
    //console.log(`startindex = ${startindex} endindex = ${endindex}`);

    if (startindex != -1 && endindex != -1 && startindex <= endindex) {
        return str.substring(0, startindex) + toinsert + str.substring(endindex);
    }
}

function removeChildren(container, excludedClasses) {

    const containerChildren = container.children;
    const l = containerChildren.length;
    let nodesToRemove = [];
    if (excludedClasses) {
        for (var i = 0; i < l; i++) {
            const current = containerChildren[i];
            let excluded = false;
            for (var j = 0; j < excludedClasses.length; j++) {
                if (current.classList.contains(excludedClasses[j])) {
                   excluded = true;
                } 
            }
            if (!excluded) {
                nodesToRemove.push(current);
            }
        }
    } else {
        nodesToRemove = containerChildren;
    }
    
    nodesToRemove.forEach((node)=>{
        container.removeChild(node)
    });
}


function loadAndTrim(url, response) {
    JSDOM.fromURL(url).then((dom) => {
                    const body = dom.window.document.getElementsByTagName('body')[0]
                    const contentContainer = dom.window.document.getElementsByClassName('content-container')[0];
                    const mainContainer = dom.window.document.getElementsByClassName('main-container')[0];
                    const translateContainer = dom.window.document.getElementsByClassName('translate')[0]
                    const cardContainer = dom.window.document.getElementsByClassName('card')[0];

                    mainContainer.style.width = '900px';

                    removeChildren(body, ['content-container']);
                    removeChildren(contentContainer, ['main-container']);
                    removeChildren(mainContainer, ['translate', 'conjugation']);

                    if (translateContainer) {
                        removeChildren(translateContainer, ['card', ['tab-content']]) ;
                    }
                
                    const navElements = dom.window.document.getElementsByClassName('nav-content');
                    if (navElements) {
                        const l = navElements.length;
                        for (var i = 0; i < l; i++) {
                            const parent = navElements[i].parentElement;
                            parent.removeChild(navElements[i]);
                        }
                    }
                    
                    //cardContainer.removeChild(navElement);

                    response.end(dom.serialize());
                }).catch((e)=> {
                    logger.log(e.message);
                    logger.log(url);
                    logger.printStackTrace(e);
                }); 
}     

const extToMimeType = {
    '.eot': 'application/vnd.ms-fontobject',
    '.ttf': 'application/x-font-ttf',
    '.woff':'application/x-font-woff',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.js':  'text/javascript',
    '.css': 'text/css',
    '.ico': 'image/x-icon',
    '.html': 'text/html'
};


function serveStaticContent(appDirectory, relativePath, response) {
    logger.log('serving static file -- filename = ' + appDirectory + relativePath);
    try {
        //remove query string (if any) in relative path.  This is aimed at fontello icon
        //files where the query string is a timestamp identifying a particular version
        //of the file.  We probably don't need to worry about this as long as
        //we don't touch the css fileface definitions
        if (relativePath.includes('?')) {
            relativePath = relativePath.split('?')[0];
            logger.log('removing query string..relativePath = ' + relativePath);
        }
        const ext = require('path').extname(relativePath);
        const mimeType = extToMimeType[ext];
        logger.log('mimeType=' + mimeType);

        if (mimeType) {
            response.setHeader('content-type', mimeType);
        }


        const readStream = require('fs').createReadStream(appDirectory + relativePath);
        readStream.pipe(response);
        /*
        readStream.on('data', (chunk)=> {
            logger.log(chunk.toString());
        });
        */
        readStream.on('error', (err)=> {
            logger.log('error=' + err.message);
            logger.printStackTrace(err);
        });
        readStream.on('end', ()=> {
            logger.log('sending static content');
            response.end('');
        });
        
    } catch (e) {
        logger.printStackTrace(e);
    }
}

function serveReaderContent(readerRootDirectory, relativePath, response) {
    logger.log('serveReaderContent relativePath=' + relativePath);
    if (relativePath.startsWith('index.html?')) {
        const query = relativePath.split('?')[1];
        logger.log('query=' + query);
        const ebookFile = query.split('=')[1];
        JSDOM.fromURL('http://localhost:3001/reader/index.html').then((dom) => {

``          //logger.log('in success handler') ;

            const document = dom.window.document;
            const head = document.getElementsByTagName('head')[0];
            const body = document.getElementsByTagName('body')[0];
            const script = document.createElement('script');
            
            const code = 'var ebookFile = "ebooks/' + ebookFile + '/";';
            script.type = 'text/javascript';
        
            script.appendChild(document.createTextNode(code));
            head.appendChild(script);
            
            //logger.log('sendReaderContent returns' + dom.serialize());
            response.end(dom.serialize());
        }).catch((err)=> {
            logger.log(err.message);
        });
        

    } else {
        logger.log('serving static content - relativePath = ' + relativePath);
         serveStaticContent(readerRootDirectory, relativePath, response);
    }
}


module.exports = Domfilter;


















