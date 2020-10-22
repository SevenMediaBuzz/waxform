"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schematics_1 = require("@angular-devkit/schematics");
const node_1 = require("@angular-devkit/schematics/tasks/node");
const tools_1 = require("@angular-devkit/schematics/tools");
const of_1 = require("rxjs/observable/of");
const path = require("path");
const chalk_1 = require("chalk");
const config_1 = require("../models/config");
const operators_1 = require("rxjs/operators");
const schematics_2 = require("../utilities/schematics");
const { green, red, yellow } = chalk_1.default;
const Task = require('../ember-cli/lib/models/task');
exports.default = Task.extend({
    run: function (options) {
        const { taskOptions, workingDir, emptyHost, collectionName, schematicName, logger } = options;
        const ui = this.ui;
        const packageManager = config_1.CliConfig.fromGlobal().get('packageManager');
        const engineHost = schematics_2.getEngineHost();
        engineHost.registerTaskExecutor(node_1.BuiltinTaskExecutor.NodePackage, {
            rootDirectory: workingDir,
            packageManager: packageManager === 'default' ? 'npm' : packageManager,
        });
        engineHost.registerTaskExecutor(node_1.BuiltinTaskExecutor.RepositoryInitializer, { rootDirectory: workingDir });
        const collection = schematics_2.getCollection(collectionName);
        const schematic = schematics_2.getSchematic(collection, schematicName);
        const projectRoot = !!this.project ? this.project.root : workingDir;
        const preppedOptions = prepOptions(schematic, taskOptions);
        const opts = Object.assign({}, taskOptions, preppedOptions);
        const tree = emptyHost ? new schematics_1.EmptyTree() : new schematics_1.FileSystemTree(new tools_1.FileSystemHost(workingDir));
        const host = of_1.of(tree);
        const dryRunSink = new schematics_1.DryRunSink(workingDir, opts.force);
        const fsSink = new schematics_1.FileSystemSink(workingDir, opts.force);
        let error = false;
        const loggingQueue = [];
        const modifiedFiles = [];
        dryRunSink.reporter.subscribe((event) => {
            const eventPath = event.path.startsWith('/') ? event.path.substr(1) : event.path;
            switch (event.kind) {
                case 'error':
                    const desc = event.description == 'alreadyExist' ? 'already exists' : 'does not exist.';
                    ui.writeLine(`error! ${eventPath} ${desc}.`);
                    error = true;
                    break;
                case 'update':
                    loggingQueue.push({
                        color: yellow,
                        keyword: 'update',
                        message: `${eventPath} (${event.content.length} bytes)`
                    });
                    modifiedFiles.push(event.path);
                    break;
                case 'create':
                    loggingQueue.push({
                        color: green,
                        keyword: 'create',
                        message: `${eventPath} (${event.content.length} bytes)`
                    });
                    modifiedFiles.push(event.path);
                    break;
                case 'delete':
                    loggingQueue.push({
                        color: red,
                        keyword: 'remove',
                        message: `${eventPath}`
                    });
                    break;
                case 'rename':
                    const eventToPath = event.to.startsWith('/') ? event.to.substr(1) : event.to;
                    loggingQueue.push({
                        color: yellow,
                        keyword: 'rename',
                        message: `${eventPath} => ${eventToPath}`
                    });
                    modifiedFiles.push(event.to);
                    break;
            }
        });
        return new Promise((resolve, reject) => {
            schematic.call(opts, host, { logger }).pipe(operators_1.map((tree) => schematics_1.Tree.optimize(tree)), operators_1.concatMap((tree) => {
                return dryRunSink.commit(tree).pipe(operators_1.ignoreElements(), operators_1.concat(of_1.of(tree)));
            }), operators_1.concatMap((tree) => {
                if (!error) {
                    // Output the logging queue.
                    loggingQueue.forEach(log => ui.writeLine(`  ${log.color(log.keyword)} ${log.message}`));
                }
                if (opts.dryRun || error) {
                    return of_1.of(tree);
                }
                return fsSink.commit(tree).pipe(operators_1.ignoreElements(), operators_1.concat(of_1.of(tree)));
            }), operators_1.concatMap(() => {
                if (!opts.dryRun) {
                    return schematics_2.getEngine().executePostTasks();
                }
                else {
                    return [];
                }
            }))
                .subscribe({
                error(err) {
                    ui.writeLine(red(`Error: ${err.message}`));
                    reject(err.message);
                },
                complete() {
                    if (opts.dryRun) {
                        ui.writeLine(yellow(`\nNOTE: Run with "dry run" no changes were made.`));
                    }
                    resolve({ modifiedFiles });
                }
            });
        })
            .then((output) => {
            const modifiedFiles = output.modifiedFiles;
            const lintFix = taskOptions.lintFix !== undefined ?
                taskOptions.lintFix : config_1.CliConfig.getValue('defaults.lintFix');
            if (lintFix && modifiedFiles) {
                const LintTask = require('./lint').default;
                const lintTask = new LintTask({
                    ui: this.ui,
                    project: this.project
                });
                return lintTask.run({
                    fix: true,
                    force: true,
                    silent: true,
                    configs: [{
                            files: modifiedFiles
                                .filter((file) => /.ts$/.test(file))
                                .map((file) => path.join(projectRoot, file))
                        }]
                });
            }
        });
    }
});
function prepOptions(schematic, options) {
    const properties = schematic.description.schemaJson
        ? schematic.description.schemaJson.properties
        : options;
    const keys = Object.keys(properties);
    if (['component', 'c', 'directive', 'd'].indexOf(schematic.description.name) !== -1) {
        options.prefix = (options.prefix === 'false' || options.prefix === '')
            ? undefined : options.prefix;
    }
    let preppedOptions = Object.assign({}, options, readDefaults(schematic.description.name, keys, options));
    preppedOptions = Object.assign({}, preppedOptions, normalizeOptions(schematic.description.name, keys, options));
    return preppedOptions;
}
function readDefaults(schematicName, optionKeys, options) {
    return optionKeys.reduce((acc, key) => {
        acc[key] = options[key] !== undefined ? options[key] : readDefault(schematicName, key);
        return acc;
    }, {});
}
const viewEncapsulationMap = {
    'emulated': 'Emulated',
    'native': 'Native',
    'none': 'None'
};
const changeDetectionMap = {
    'default': 'Default',
    'onpush': 'OnPush'
};
function normalizeOptions(schematicName, optionKeys, options) {
    return optionKeys.reduce((acc, key) => {
        if (schematicName === 'application' || schematicName === 'component') {
            if (key === 'viewEncapsulation' && options[key]) {
                acc[key] = viewEncapsulationMap[options[key].toLowerCase()];
            }
            else if (key === 'changeDetection' && options[key]) {
                acc[key] = changeDetectionMap[options[key].toLowerCase()];
            }
        }
        return acc;
    }, {});
}
function readDefault(schematicName, key) {
    const jsonPath = `defaults.${schematicName}.${key}`;
    return config_1.CliConfig.getValue(jsonPath);
}
//# sourceMappingURL=/users/hansl/sources/hansl/angular-cli/tasks/schematic-run.js.map