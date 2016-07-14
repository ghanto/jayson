var jayson = require(__dirname);
var utils = require('./utils');
var _ = require('lodash');
var Method = jayson.Method;

/**
 * @summary Constructor for a Jayson ContextualMethod
 * @class Method
 * @param {Function} [handler] - Function to set as handler
 * @param {Object} [options] 
 * @param {Function} [options.handler] - Same as separate handler
 * @param {Boolean} [options.collect=true] - Params to the handler are collected in one object
 * @param {Array|Object} [options.params] - Defines params that the handler accepts
 */
var ContextualMethod = function(handler, options) {
  Method.call(this, handler, options);
};

ContextualMethod.prototype = Object.create(Method.prototype);

module.exports = ContextualMethod;

/**
 * @summary Executes this method in the context of a handler and passes server to its constructor
 * @param {Server} server
 * @param {Array|Object} requestParams
 * @param {Function} callback
 */
ContextualMethod.prototype.execute = function(server, requestParams, callback) {
  var options = this.options;
  var handler = this.getHandler();
  var params = this._getHandlerParams(requestParams);

  if(options.collect) {
    return new handler(server, params, callback);
  }

  // Params is optional according to the JSON-RPC 2.0 spec so if it doesnt
  // exist create an empty array.
  if (!params) {
    params = [];
  }

  // compare without the callback
  if(handler.length !== (params.length + 1)) {
    callback(server.error(jayson.Server.errors.INVALID_PARAMS));
    return;
  }

  return new handler(server, _.flatten([params, callback]));
};
