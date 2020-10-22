#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const build_optimizer_1 = require("./build-optimizer");
if (process.argv.length < 3 || process.argv.length > 4) {
    throw new Error(`
    build-optimizer should be called with either one or two arguments:

      build-optimizer input.js
      build-optimizer input.js output.js
  `);
}
const currentDir = process.cwd();
const inputFile = process.argv[2];
const tsOrJsRegExp = /\.(j|t)s$/;
if (!inputFile.match(tsOrJsRegExp)) {
    throw new Error(`Input file must be .js or .ts.`);
}
// Use provided output file, or add the .bo suffix before the extension.
const outputFile = process.argv[3] || inputFile.replace(tsOrJsRegExp, (subStr) => `.bo${subStr}`);
const boOutput = build_optimizer_1.buildOptimizer({
    inputFilePath: path_1.join(currentDir, inputFile),
    outputFilePath: path_1.join(currentDir, outputFile),
    emitSourceMap: true,
});
if (boOutput.emitSkipped) {
    console.log('Nothing to emit.');
}
else {
    fs_1.writeFileSync(path_1.join(currentDir, outputFile), boOutput.content);
    fs_1.writeFileSync(path_1.join(currentDir, `${outputFile}.map`), JSON.stringify(boOutput.sourceMap));
    console.log('Emitted:');
    console.log(`  ${outputFile}`);
    console.log(`  ${outputFile}.map`);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpLmpzIiwic291cmNlUm9vdCI6Ii4vIiwic291cmNlcyI6WyJwYWNrYWdlcy9hbmd1bGFyX2RldmtpdC9idWlsZF9vcHRpbWl6ZXIvc3JjL2J1aWxkLW9wdGltaXplci9jbGkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBUUEsMkJBQW1DO0FBQ25DLCtCQUE0QjtBQUM1Qix1REFBbUQ7QUFHbkQsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDdkQsTUFBTSxJQUFJLEtBQUssQ0FBQzs7Ozs7R0FLZixDQUFDLENBQUM7QUFDTCxDQUFDO0FBRUQsTUFBTSxVQUFVLEdBQUcsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBRWpDLE1BQU0sU0FBUyxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDbEMsTUFBTSxZQUFZLEdBQUcsV0FBVyxDQUFDO0FBRWpDLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDbkMsTUFBTSxJQUFJLEtBQUssQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDO0FBQ3BELENBQUM7QUFFRCx3RUFBd0U7QUFDeEUsTUFBTSxVQUFVLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxTQUFTLENBQUMsT0FBTyxDQUFDLFlBQVksRUFBRSxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsTUFBTSxNQUFNLEVBQUUsQ0FBQyxDQUFDO0FBRWxHLE1BQU0sUUFBUSxHQUFHLGdDQUFjLENBQUM7SUFDOUIsYUFBYSxFQUFFLFdBQUksQ0FBQyxVQUFVLEVBQUUsU0FBUyxDQUFDO0lBQzFDLGNBQWMsRUFBRSxXQUFJLENBQUMsVUFBVSxFQUFFLFVBQVUsQ0FBQztJQUM1QyxhQUFhLEVBQUUsSUFBSTtDQUNwQixDQUFDLENBQUM7QUFFSCxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztJQUN6QixPQUFPLENBQUMsR0FBRyxDQUFDLGtCQUFrQixDQUFDLENBQUM7QUFDbEMsQ0FBQztBQUFDLElBQUksQ0FBQyxDQUFDO0lBQ04sa0JBQWEsQ0FBQyxXQUFJLENBQUMsVUFBVSxFQUFFLFVBQVUsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUM5RCxrQkFBYSxDQUFDLFdBQUksQ0FBQyxVQUFVLEVBQUUsR0FBRyxVQUFVLE1BQU0sQ0FBQyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7SUFDekYsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUN4QixPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssVUFBVSxFQUFFLENBQUMsQ0FBQztJQUMvQixPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssVUFBVSxNQUFNLENBQUMsQ0FBQztBQUNyQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiIyEvdXNyL2Jpbi9lbnYgbm9kZVxuLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHsgd3JpdGVGaWxlU3luYyB9IGZyb20gJ2ZzJztcbmltcG9ydCB7IGpvaW4gfSBmcm9tICdwYXRoJztcbmltcG9ydCB7IGJ1aWxkT3B0aW1pemVyIH0gZnJvbSAnLi9idWlsZC1vcHRpbWl6ZXInO1xuXG5cbmlmIChwcm9jZXNzLmFyZ3YubGVuZ3RoIDwgMyB8fCBwcm9jZXNzLmFyZ3YubGVuZ3RoID4gNCkge1xuICB0aHJvdyBuZXcgRXJyb3IoYFxuICAgIGJ1aWxkLW9wdGltaXplciBzaG91bGQgYmUgY2FsbGVkIHdpdGggZWl0aGVyIG9uZSBvciB0d28gYXJndW1lbnRzOlxuXG4gICAgICBidWlsZC1vcHRpbWl6ZXIgaW5wdXQuanNcbiAgICAgIGJ1aWxkLW9wdGltaXplciBpbnB1dC5qcyBvdXRwdXQuanNcbiAgYCk7XG59XG5cbmNvbnN0IGN1cnJlbnREaXIgPSBwcm9jZXNzLmN3ZCgpO1xuXG5jb25zdCBpbnB1dEZpbGUgPSBwcm9jZXNzLmFyZ3ZbMl07XG5jb25zdCB0c09ySnNSZWdFeHAgPSAvXFwuKGp8dClzJC87XG5cbmlmICghaW5wdXRGaWxlLm1hdGNoKHRzT3JKc1JlZ0V4cCkpIHtcbiAgdGhyb3cgbmV3IEVycm9yKGBJbnB1dCBmaWxlIG11c3QgYmUgLmpzIG9yIC50cy5gKTtcbn1cblxuLy8gVXNlIHByb3ZpZGVkIG91dHB1dCBmaWxlLCBvciBhZGQgdGhlIC5ibyBzdWZmaXggYmVmb3JlIHRoZSBleHRlbnNpb24uXG5jb25zdCBvdXRwdXRGaWxlID0gcHJvY2Vzcy5hcmd2WzNdIHx8IGlucHV0RmlsZS5yZXBsYWNlKHRzT3JKc1JlZ0V4cCwgKHN1YlN0cikgPT4gYC5ibyR7c3ViU3RyfWApO1xuXG5jb25zdCBib091dHB1dCA9IGJ1aWxkT3B0aW1pemVyKHtcbiAgaW5wdXRGaWxlUGF0aDogam9pbihjdXJyZW50RGlyLCBpbnB1dEZpbGUpLFxuICBvdXRwdXRGaWxlUGF0aDogam9pbihjdXJyZW50RGlyLCBvdXRwdXRGaWxlKSxcbiAgZW1pdFNvdXJjZU1hcDogdHJ1ZSxcbn0pO1xuXG5pZiAoYm9PdXRwdXQuZW1pdFNraXBwZWQpIHtcbiAgY29uc29sZS5sb2coJ05vdGhpbmcgdG8gZW1pdC4nKTtcbn0gZWxzZSB7XG4gIHdyaXRlRmlsZVN5bmMoam9pbihjdXJyZW50RGlyLCBvdXRwdXRGaWxlKSwgYm9PdXRwdXQuY29udGVudCk7XG4gIHdyaXRlRmlsZVN5bmMoam9pbihjdXJyZW50RGlyLCBgJHtvdXRwdXRGaWxlfS5tYXBgKSwgSlNPTi5zdHJpbmdpZnkoYm9PdXRwdXQuc291cmNlTWFwKSk7XG4gIGNvbnNvbGUubG9nKCdFbWl0dGVkOicpO1xuICBjb25zb2xlLmxvZyhgICAke291dHB1dEZpbGV9YCk7XG4gIGNvbnNvbGUubG9nKGAgICR7b3V0cHV0RmlsZX0ubWFwYCk7XG59XG4iXX0=