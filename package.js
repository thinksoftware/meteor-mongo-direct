Package.describe({
  name: 'thinksoftware:mongo-direct',
  summary: 'Meteor MongoDB Direct Collection Extension',
  version: '1.0.0',
  git: ' /* Fill me in! */ '
});

Package.onUse(function(api) {
  api.versionsFrom('1.0');
  api.use(['underscore', 'mongo']);
  api.addFiles('thinksoftware:mongo-direct.js', ['server']);
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('thinksoftware:mongo-direct');
  api.addFiles('thinksoftware:mongo-direct-tests.js');
});
