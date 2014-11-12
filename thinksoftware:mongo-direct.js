Future = Npm.require('fibers/future');

var MongoDirect = {
  
  directFind: function(selector, options) {
    return doFindRecords(this._name, selector, options);
  },
  directFindOne: function(selector, options) {
    return doFindOneRecord(this._name, selector, options);
  },
  directInsert: function(doc) {
    return doInsertRecord(this._name, doc);
  },
  directUpdate: function(selector, modifier, options) {
    return doUpdateRecord(this._name, selector, modifier, options);
  },
  directExists: function(selector) {
    return checkRecordExists(this._name, selector);
  },
  directRemove: function(selector, options) {
    return doDeleteRecord(this._name, selector, options);
  }
  
};

if (!constr) constr = typeof Mongo !== "undefined" ? Mongo.Collection : Meteor.Collection;

_.extend(constr.prototype, MongoDirect);

// ---------------------------------------//

doInsertRecord = function(file, data) {

  var fut = new Future();

  var returnId = new constr.ObjectID();

  if (Object.prototype.toString.call(data) === '[object Array]') {
    returnId = [];
    data.forEach(function (doc) {
      doc._id = doc._id || new constr.ObjectID()._str;
      returnId.push(doc._id);
    });
  } else {
    var mid = new constr.ObjectID()
    data._id = data._id || mid._str;
    returnId = data._id;
  }

  MongoInternals.defaultRemoteCollectionDriver().mongo.db.collection(file).insert(data, function(err,res) {
    if(err)
      console.log("insert "+err);

    if (err)
      fut.return(null)
    else
      fut.return(returnId);
  });
          
  return fut.wait();
  
};

doUpdateRecord = function(file, criteria, data, options) {

  if (!options)
    options = {};

  var fut = new Future();

  MongoInternals.defaultRemoteCollectionDriver().mongo.db.collection(file).update(criteria, data, options, function(err,res) {
    if(err)
      console.log("update "+err);

    if (err)
      fut.return(null)
    else
      fut.return(res);   
  });
          
  return fut.wait();
  
};

checkRecordExists = function(file, criteria) {

  var fut = new Future();

  MongoInternals.defaultRemoteCollectionDriver().mongo.db.collection(file).findOne(criteria, function(err,res) {
    if (err)
      fut.return(false)
    else
      if (res)
        fut.return(true);
      else
        fut.return(false); 
  });
          
  return fut.wait();
  
};

doFindOneRecord = function(file, criteria, fields) {

  if (!fields)
    fields = {};

  var fut = new Future();

  MongoInternals.defaultRemoteCollectionDriver().mongo.db.collection(file).findOne(criteria, fields, function(err,res) {
    if (err)
      fut.return(null)
    else
      if (res)
        fut.return(res);
      else
        fut.return(null); 
  });
          
  return fut.wait();
  
};

doFindRecords = function(file, criteria, fields) {

  if (!fields)
    fields = {};
    
  var fut = new Future();

  MongoInternals.defaultRemoteCollectionDriver().mongo.db.collection(file).find(criteria, fields).toArray(function(err,res) {
    if (err)
      fut.return(null)
    else
      if (res)
        fut.return(res);
      else
        fut.return(null); 
  });
          
  return fut.wait();
  
};

doDeleteRecord = function(file, criteria, options) {

  if (!options)
    options = {};

  var fut = new Future();

  MongoInternals.defaultRemoteCollectionDriver().mongo.db.collection(file).remove(criteria, options, function(err, res) {
    if (err)
      fut.return(false)
    else
      fut.return(res);

  });
          
  return fut.wait();
  
};
