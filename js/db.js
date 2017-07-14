// js/db.js

const Datastore = require('nedb');
const Logger = require('./log')
const logger = new Logger('js/db.js');

class Database {
    constructor(directory) {
        this.directory = directory;

        this.dbApps = new Datastore({filename: this.directory + 'apps.db'});
        this.dbApps.ensureIndex({ fieldName: 'name', unique: true }, ()=>{})
        ;
        this.dbApps.loadDatabase((err)=> {
            if (err) {
                logger.log(err.message);
            }
        })
    }

    addApp(name, url, html, callback /* args: (err, newDoc*/) {
        this.dbApps.insert({'name': name, 'url': url, 'html':html}, callback);
        this.dbApps.persistence.compactDatafile();
    }

    loadApps(callback /*args: (err, docs) */) {
        this.dbApps.find({}, callback);
    }

    getApp(name, callback /* args: (err, docs)*/) {
        this.dbApps.find({'name': name}, callback);
        this.dbApps.persistence.compactDatafile();
    }

    editApp(name, newName, newUrl, newHtml, callback /* args: (err, numAffected, affectedDocuments, upsert))*/) {
        this.dbApps.update({ 'name': name }, { $set: { 'name':newName , 'url': newUrl, 'html':newHtml } }, {}, callback);
        this.dbApps.persistence.compactDatafile();
    }

    deleteApp(name, callback /* args: (err, numRemoved)*/) {
        this.dbApps.remove({'name':name}, callback);
        this.dbApps.persistence.compactDatafile();
    }
}


module.exports = Database;