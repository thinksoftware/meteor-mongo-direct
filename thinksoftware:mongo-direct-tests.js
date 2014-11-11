if (Meteor.isServer) {
  // var collectionName = 'mongo_direct_tests';
  TestCollection = new Mongo.Collection('mongo_direct_tests');

  Tinytest.add('mongo-direct - directInsert - Inserting an object yields a Meteor style ID', function (test) {
    var coll = TestCollection;
    coll.remove({});

    var oneDoc = {field: 'data'};

    coll.directInsert(oneDoc);

    test.equal(coll.find().count(), 1, 'There should be one document')
    test.length(coll.findOne()._id, 
                new Mongo.Collection.ObjectID()._str.length, 
                'The ID should be a string');
  });


  Tinytest.add('mongo-direct - directInsert - Inserting a document returns the ID', function (test) {
    var coll = TestCollection;
    coll.remove({});

    var oneDoc = {field: 'data'};

    var result = coll.directInsert(oneDoc);

    test.equal(coll.find().count(), 1, 'There should be one document')
    test.length(result, new Mongo.Collection.ObjectID()._str.length, 'The ID should be a string');
  });
 
  Tinytest.add('mongo-direct - directInsert - Inserting an array of objects yields Meteor style IDs', function (test) {
    var coll = TestCollection;
    coll.remove({});

    var severalDocs = [
      {field: 'data'},
      {field: 'data'}
    ];

    coll.directInsert(severalDocs);

    test.equal(coll.find().count(), 2, 'There should be only two documents')
    test.length(coll.findOne()._id, 
                new Mongo.Collection.ObjectID()._str.length, 
                'The ID of those should be a string');
  });


  Tinytest.add('mongo-direct - directInsert - Inserting an array of objects return an array of IDs', function (test) {
  
    var coll = TestCollection;
    coll.remove({});

    var severalDocs = [
      {field: 'data'},
      {field: 'data'}
    ];

    var result = coll.directInsert(severalDocs);

    test.equal(coll.find().count(), 2, 'There should be only two documents')
    test.equal(result.length, 2, 'There should be two IDs')
    test.length(result[0], 
                new Mongo.Collection.ObjectID()._str.length, 
                'The ID of those should be a string');
  });


  Tinytest.add('mongo-direct - directInsert - Inserting with an ID should keep that ID', function (test) {
    var coll = TestCollection;
    coll.remove({});

    var docWithID = {field: 'data', _id: {customId: 'custom'}};

    var result = coll.directInsert(docWithID);

    test.equal(coll.find().count(), 1, 'There should be one document');
    test.equal(typeof coll.directFindOne()._id, "object", 'The ID should be an object');
    test.equal(coll.directFindOne()._id.customId, 'custom', 'The ID should have a nested field');
  });

}