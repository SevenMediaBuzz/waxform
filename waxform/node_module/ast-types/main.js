"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.visit = exports.use = exports.Type = exports.someField = exports.PathVisitor = exports.Path = exports.NodePath = exports.namedTypes = exports.getSupertypeNames = exports.getFieldValue = exports.getFieldNames = exports.getBuilderName = exports.finalize = exports.eachField = exports.defineMethod = exports.builtInTypes = exports.builders = exports.astNodesAreEquivalent = void 0;
var tslib_1 = require("tslib");
var fork_1 = tslib_1.__importDefault(require("./fork"));
var core_1 = tslib_1.__importDefault(require("./def/core"));
var es6_1 = tslib_1.__importDefault(require("./def/es6"));
var es2016_1 = tslib_1.__importDefault(require("./def/es2016"));
var es2017_1 = tslib_1.__importDefault(require("./def/es2017"));
var es2018_1 = tslib_1.__importDefault(require("./def/es2018"));
var es2019_1 = tslib_1.__importDefault(require("./def/es2019"));
var es2020_1 = tslib_1.__importDefault(require("./def/es2020"));
var jsx_1 = tslib_1.__importDefault(require("./def/jsx"));
var flow_1 = tslib_1.__importDefault(require("./def/flow"));
var esprima_1 = tslib_1.__importDefault(require("./def/esprima"));
var babel_1 = tslib_1.__importDefault(require("./def/babel"));
var typescript_1 = tslib_1.__importDefault(require("./def/typescript"));
var es_proposals_1 = tslib_1.__importDefault(require("./def/es-proposals"));
var namedTypes_1 = require("./gen/namedTypes");
Object.defineProperty(exports, "namedTypes", { enumerable: true, get: function () { return namedTypes_1.namedTypes; } });
var _a = fork_1.default([
    // This core module of AST types captures ES5 as it is parsed today by
    // git://github.com/ariya/esprima.git#master.
    core_1.default,
    // Feel free to add to or remove from this list of extension modules to
    // configure the precise type hierarchy that you need.
    es6_1.default,
    es2016_1.default,
    es2017_1.default,
    es2018_1.default,
    es2019_1.default,
    es2020_1.default,
    jsx_1.default,
    flow_1.default,
    esprima_1.default,
    babel_1.default,
    typescript_1.default,
    es_proposals_1.default,
]), astNodesAreEquivalent = _a.astNodesAreEquivalent, builders = _a.builders, builtInTypes = _a.builtInTypes, defineMethod = _a.defineMethod, eachField = _a.eachField, finalize = _a.finalize, getBuilderName = _a.getBuilderName, getFieldNames = _a.getFieldNames, getFieldValue = _a.getFieldValue, getSupertypeNames = _a.getSupertypeNames, n = _a.namedTypes, NodePath = _a.NodePath, Path = _a.Path, PathVisitor = _a.PathVisitor, someField = _a.someField, Type = _a.Type, use = _a.use, visit = _a.visit;
exports.astNodesAreEquivalent = astNodesAreEquivalent;
exports.builders = builders;
exports.builtInTypes = builtInTypes;
exports.defineMethod = defineMethod;
exports.eachField = eachField;
exports.finalize = finalize;
exports.getBuilderName = getBuilderName;
exports.getFieldNames = getFieldNames;
exports.getFieldValue = getFieldValue;
exports.getSupertypeNames = getSupertypeNames;
exports.NodePath = NodePath;
exports.Path = Path;
exports.PathVisitor = PathVisitor;
exports.someField = someField;
exports.Type = Type;
exports.use = use;
exports.visit = visit;
// Populate the exported fields of the namedTypes namespace, while still
// retaining its member types.
Object.assign(namedTypes_1.namedTypes, n);
