'use strict';

var url = require('url');


var Aggregates = require('./AggregatesService');


module.exports.aggregatesGET = function aggregatesGET (req, res, next) {
  Aggregates.aggregatesGET(req.swagger.params, res, next);
};
