"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const ts = require("typescript");
function testPrefixClasses(content) {
    const exportVarSetter = /(?:export )?(?:var|const)\s+(\S+)\s*=\s*/;
    const multiLineComment = /\s*(?:\/\*[\s\S]*?\*\/)?\s*/;
    const newLine = /\s*\r?\n\s*/;
    const regexes = [
        [
            /^/,
            exportVarSetter, multiLineComment,
            /\(/, multiLineComment,
            /\s*function \(\) {/, newLine,
            multiLineComment,
            /function \1\([^\)]*\) \{/, newLine,
        ],
        [
            /^/,
            exportVarSetter, multiLineComment,
            /\(/, multiLineComment,
            /\s*function \(_super\) {/, newLine,
            /\w*__extends\(\w+, _super\);/,
        ],
    ].map(arr => new RegExp(arr.map(x => x.source).join(''), 'm'));
    return regexes.some((regex) => regex.test(content));
}
exports.testPrefixClasses = testPrefixClasses;
const superParameterName = '_super';
const extendsHelperName = '__extends';
function getPrefixClassesTransformer() {
    return (context) => {
        const transformer = (sf) => {
            const pureFunctionComment = '@__PURE__';
            const visitor = (node) => {
                // Add pure comment to downleveled classes.
                if (ts.isVariableStatement(node) && isDownleveledClass(node)) {
                    const varDecl = node.declarationList.declarations[0];
                    const varInitializer = varDecl.initializer;
                    // Update node with the pure comment before the variable declaration initializer.
                    const newNode = ts.updateVariableStatement(node, node.modifiers, ts.updateVariableDeclarationList(node.declarationList, [
                        ts.updateVariableDeclaration(varDecl, varDecl.name, varDecl.type, ts.addSyntheticLeadingComment(varInitializer, ts.SyntaxKind.MultiLineCommentTrivia, pureFunctionComment, false)),
                    ]));
                    // Replace node with modified one.
                    return ts.visitEachChild(newNode, visitor, context);
                }
                // Otherwise return node as is.
                return ts.visitEachChild(node, visitor, context);
            };
            return ts.visitEachChild(sf, visitor, context);
        };
        return transformer;
    };
}
exports.getPrefixClassesTransformer = getPrefixClassesTransformer;
// Determine if a node matched the structure of a downleveled TS class.
function isDownleveledClass(node) {
    if (!ts.isVariableStatement(node)) {
        return false;
    }
    if (node.declarationList.declarations.length !== 1) {
        return false;
    }
    const variableDeclaration = node.declarationList.declarations[0];
    if (!ts.isIdentifier(variableDeclaration.name)
        || !variableDeclaration.initializer) {
        return false;
    }
    let potentialClass = variableDeclaration.initializer;
    // TS 2.3 has an unwrapped class IIFE
    // TS 2.4 uses a function expression wrapper
    // TS 2.5 uses an arrow function wrapper
    if (ts.isParenthesizedExpression(potentialClass)) {
        potentialClass = potentialClass.expression;
    }
    if (!ts.isCallExpression(potentialClass) || potentialClass.arguments.length > 1) {
        return false;
    }
    let wrapperBody;
    if (ts.isFunctionExpression(potentialClass.expression)) {
        wrapperBody = potentialClass.expression.body;
    }
    else if (ts.isArrowFunction(potentialClass.expression)
        && ts.isBlock(potentialClass.expression.body)) {
        wrapperBody = potentialClass.expression.body;
    }
    else {
        return false;
    }
    if (wrapperBody.statements.length === 0) {
        return false;
    }
    const functionExpression = potentialClass.expression;
    const functionStatements = wrapperBody.statements;
    // need a minimum of two for a function declaration and return statement
    if (functionStatements.length < 2) {
        return false;
    }
    // The variable name should be the class name.
    const className = variableDeclaration.name.text;
    const firstStatement = functionStatements[0];
    // find return statement - may not be last statement
    let returnStatement;
    for (let i = functionStatements.length - 1; i > 0; i--) {
        if (ts.isReturnStatement(functionStatements[i])) {
            returnStatement = functionStatements[i];
            break;
        }
    }
    if (returnStatement == undefined
        || returnStatement.expression == undefined
        || !ts.isIdentifier(returnStatement.expression)) {
        return false;
    }
    if (functionExpression.parameters.length === 0) {
        // potential non-extended class or wrapped es2015 class
        return (ts.isFunctionDeclaration(firstStatement) || ts.isClassDeclaration(firstStatement))
            && firstStatement.name !== undefined
            && firstStatement.name.text === className
            && returnStatement.expression.text === firstStatement.name.text;
    }
    else if (functionExpression.parameters.length !== 1) {
        return false;
    }
    // Potential extended class
    const functionParameter = functionExpression.parameters[0];
    if (!ts.isIdentifier(functionParameter.name)
        || functionParameter.name.text !== superParameterName) {
        return false;
    }
    if (functionStatements.length < 3) {
        return false;
    }
    if (!ts.isExpressionStatement(firstStatement)
        || !ts.isCallExpression(firstStatement.expression)) {
        return false;
    }
    const extendCallExpression = firstStatement.expression;
    if (!ts.isIdentifier(extendCallExpression.expression)
        || !extendCallExpression.expression.text.endsWith(extendsHelperName)) {
        return false;
    }
    if (extendCallExpression.arguments.length === 0) {
        return false;
    }
    const lastArgument = extendCallExpression.arguments[extendCallExpression.arguments.length - 1];
    if (!ts.isIdentifier(lastArgument) || lastArgument.text !== functionParameter.name.text) {
        return false;
    }
    const secondStatement = functionStatements[1];
    return ts.isFunctionDeclaration(secondStatement)
        && secondStatement.name !== undefined
        && className.endsWith(secondStatement.name.text)
        && returnStatement.expression.text === secondStatement.name.text;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlZml4LWNsYXNzZXMuanMiLCJzb3VyY2VSb290IjoiLi8iLCJzb3VyY2VzIjpbInBhY2thZ2VzL2FuZ3VsYXJfZGV2a2l0L2J1aWxkX29wdGltaXplci9zcmMvdHJhbnNmb3Jtcy9wcmVmaXgtY2xhc3Nlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7R0FNRztBQUNILGlDQUFpQztBQUdqQywyQkFBa0MsT0FBZTtJQUMvQyxNQUFNLGVBQWUsR0FBRywwQ0FBMEMsQ0FBQztJQUNuRSxNQUFNLGdCQUFnQixHQUFHLDZCQUE2QixDQUFDO0lBQ3ZELE1BQU0sT0FBTyxHQUFHLGFBQWEsQ0FBQztJQUU5QixNQUFNLE9BQU8sR0FBRztRQUNkO1lBQ0UsR0FBRztZQUNILGVBQWUsRUFBRSxnQkFBZ0I7WUFDakMsSUFBSSxFQUFFLGdCQUFnQjtZQUN0QixvQkFBb0IsRUFBRSxPQUFPO1lBQzdCLGdCQUFnQjtZQUNoQiwwQkFBMEIsRUFBRSxPQUFPO1NBQ3BDO1FBQ0Q7WUFDRSxHQUFHO1lBQ0gsZUFBZSxFQUFFLGdCQUFnQjtZQUNqQyxJQUFJLEVBQUUsZ0JBQWdCO1lBQ3RCLDBCQUEwQixFQUFFLE9BQU87WUFDbkMsOEJBQThCO1NBQy9CO0tBQ0YsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBRS9ELE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7QUFDdEQsQ0FBQztBQXhCRCw4Q0F3QkM7QUFFRCxNQUFNLGtCQUFrQixHQUFHLFFBQVEsQ0FBQztBQUNwQyxNQUFNLGlCQUFp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Q0FBQyxvQkFBb0IsQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBRS9GLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQyxZQUFZLENBQUMsSUFBSSxZQUFZLENBQUMsSUFBSSxLQUFLLGlCQUFpQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ3hGLE1BQU0sQ0FBQyxLQUFLLENBQUM7SUFDZixDQUFDO0lBRUQsTUFBTSxlQUFlLEdBQUcsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFOUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxxQkFBcUIsQ0FBQyxlQUFlLENBQUM7V0FDdEMsZUFBZSxDQUFDLElBQUksS0FBSyxTQUFTO1dBQ2xDLFNBQVMsQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7V0FDN0MsZUFBZSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEtBQUssZUFBZSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7QUFDMUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCAqIGFzIHRzIGZyb20gJ3R5cGVzY3JpcHQnO1xuXG5cbmV4cG9ydCBmdW5jdGlvbiB0ZXN0UHJlZml4Q2xhc3Nlcyhjb250ZW50OiBzdHJpbmcpIHtcbiAgY29uc3QgZXhwb3J0VmFyU2V0dGVyID0gLyg/OmV4cG9ydCApPyg/OnZhcnxjb25zdClcXHMrKFxcUyspXFxzKj1cXHMqLztcbiAgY29uc3QgbXVsdGlMaW5lQ29tbWVudCA9IC9cXHMqKD86XFwvXFwqW1xcc1xcU10qP1xcKlxcLyk/XFxzKi87XG4gIGNvbnN0IG5ld0xpbmUgPSAvXFxzKlxccj9cXG5cXHMqLztcblxuICBjb25zdCByZWdleGVzID0gW1xuICAgIFtcbiAgICAgIC9eLyxcbiAgICAgIGV4cG9ydFZhclNldHRlciwgbXVsdGlMaW5lQ29tbWVudCxcbiAgICAgIC9cXCgvLCBtdWx0aUxpbmVDb21tZW50LFxuICAgICAgL1xccypmdW5jdGlvbiBcXChcXCkgey8sIG5ld0xpbmUsXG4gICAgICBtdWx0aUxpbmVDb21tZW50LFxuICAgICAgL2Z1bmN0aW9uIFxcMVxcKFteXFwpXSpcXCkgXFx7LywgbmV3TGluZSxcbiAgICBdLFxuICAgIFtcbiAgICAgIC9eLyxcbiAgICAgIGV4cG9ydFZhclNldHRlciwgbXVsdGlMaW5lQ29tbWVudCxcbiAgICAgIC9cXCgvLCBtdWx0aUxpbmVDb21tZW50LFxuICAgICAgL1xccypmdW5jdGlvbiBcXChfc3VwZXJcXCkgey8sIG5ld0xpbmUsXG4gICAgICAvXFx3Kl9fZXh0ZW5kc1xcKFxcdyssIF9zdXBlclxcKTsvLFxuICAgIF0sXG4gIF0ubWFwKGFyciA9PiBuZXcgUmVnRXhwKGFyci5tYXAoeCA9PiB4LnNvdXJjZSkuam9pbignJyksICdtJykpO1xuXG4gIHJldHVybiByZWdleGVzLnNvbWUoKHJlZ2V4KSA9PiByZWdleC50ZXN0KGNvbnRlbnQpKTtcbn1cblxuY29uc3Qgc3VwZXJQYXJhbWV0ZXJOYW1lID0gJ19zdXBlcic7XG5jb25zdCBleHRlbmRzSGVscGVyTmFtZSA9ICdfX2V4dGVuZHMnO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0UHJlZml4Q2xhc3Nlc1RyYW5zZm9ybWVyKCk6IHRzLlRyYW5zZm9ybWVyRmFjdG9yeTx0cy5Tb3VyY2VGaWxlPiB7XG4gIHJldHVybiAoY29udGV4dDogdHMuVHJhbnNmb3JtYXRpb25Db250ZXh0KTogdHMuVHJhbnNmb3JtZXI8dHMuU291cmNlRmlsZT4gPT4ge1xuICAgIGNvbnN0IHRyYW5zZm9ybWVyOiB0cy5UcmFuc2Zvcm1lcjx0cy5Tb3VyY2VGaWxlPiA9IChzZjogdHMuU291cmNlRmlsZSkgPT4ge1xuXG4gICAgICBjb25zdCBwdXJlRnVuY3Rpb25Db21tZW50ID0gJ0BfX1BVUkVfXyc7XG5cbiAgICAgIGNvbnN0IHZpc2l0b3I6IHRzLlZpc2l0b3IgPSAobm9kZTogdHMuTm9kZSk6IHRzLlZpc2l0UmVzdWx0PHRzLk5vZGU+ID0+IHtcblxuICAgICAgICAvLyBBZGQgcHVyZSBjb21tZW50IHRvIGRvd25sZXZlbGVkIGNsYXNzZXMuXG4gICAgICAgIGlmICh0cy5pc1ZhcmlhYmxlU3RhdGVtZW50KG5vZGUpICYmIGlzRG93bmxldmVsZWRDbGFzcyhub2RlKSkge1xuICAgICAgICAgIGNvbnN0IHZhckRlY2wgPSBub2RlLmRlY2xhcmF0aW9uTGlzdC5kZWNsYXJhdGlvbnNbMF07XG4gICAgICAgICAgY29uc3QgdmFySW5pdGlhbGl6ZXIgPSB2YXJEZWNsLmluaXRpYWxpemVyIGFzIHRzLkV4cHJlc3Npb247XG5cbiAgICAgICAgICAvLyBVcGRhdGUgbm9kZSB3aXRoIHRoZSBwdXJlIGNvbW1lbnQgYmVmb3JlIHRoZSB2YXJpYWJsZSBkZWNsYXJhdGlvbiBpbml0aWFsaXplci5cbiAgICAgICAgICBjb25zdCBuZXdOb2RlID0gdHMudXBkYXRlVmFyaWFibGVTdGF0ZW1lbnQoXG4gICAgICAgICAgICBub2RlLFxuICAgICAgICAgICAgbm9kZS5tb2RpZmllcnMsXG4gICAgICAgICAgICB0cy51cGRhdGVWYXJpYWJsZURlY2xhcmF0aW9uTGlzdChcbiAgICAgICAgICAgICAgbm9kZS5kZWNsYXJhdGlvbkxpc3QsXG4gICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICB0cy51cGRhdGVWYXJpYWJsZURlY2xhcmF0aW9uKFxuICAgICAgICAgICAgICAgICAgdmFyRGVjbCxcbiAgICAgICAgICAgICAgICAgIHZhckRlY2wubmFtZSxcbiAgICAgICAgICAgICAgICAgIHZhckRlY2wudHlwZSxcbiAgICAgICAgICAgICAgICAgIHRzLmFkZFN5bnRoZXRpY0xlYWRpbmdDb21tZW50KFxuICAgICAgICAgICAgICAgICAgICB2YXJJbml0aWFsaXplcixcbiAgICAgICAgICAgICAgICAgICAgdHMuU3ludGF4S2luZC5NdWx0aUxpbmVDb21tZW50VHJpdmlhLFxuICAgICAgICAgICAgICAgICAgICBwdXJlRnVuY3Rpb25Db21tZW50LFxuICAgICAgICAgICAgICAgICAgICBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICksXG4gICAgICAgICAgKTtcblxuICAgICAgICAgIC8vIFJlcGxhY2Ugbm9kZSB3aXRoIG1vZGlmaWVkIG9uZS5cbiAgICAgICAgICByZXR1cm4gdHMudmlzaXRFYWNoQ2hpbGQobmV3Tm9kZSwgdmlzaXRvciwgY29udGV4dCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBPdGhlcndpc2UgcmV0dXJuIG5vZGUgYXMgaXMuXG4gICAgICAgIHJldHVybiB0cy52aXNpdEVhY2hDaGlsZChub2RlLCB2aXNpdG9yLCBjb250ZXh0KTtcbiAgICAgIH07XG5cbiAgICAgIHJldHVybiB0cy52aXNpdEVhY2hDaGlsZChzZiwgdmlzaXRvciwgY29udGV4dCk7XG4gICAgfTtcblxuICAgIHJldHVybiB0cmFuc2Zvcm1lcjtcbiAgfTtcbn1cblxuLy8gRGV0ZXJtaW5lIGlmIGEgbm9kZSBtYXRjaGVkIHRoZSBzdHJ1Y3R1cmUgb2YgYSBkb3dubGV2ZWxlZCBUUyBjbGFzcy5cbmZ1bmN0aW9uIGlzRG93bmxldmVsZWRDbGFzcyhub2RlOiB0cy5Ob2RlKTogYm9vbGVhbiB7XG5cbiAgaWYgKCF0cy5pc1ZhcmlhYmxlU3RhdGVtZW50KG5vZGUpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKG5vZGUuZGVjbGFyYXRpb25MaXN0LmRlY2xhcmF0aW9ucy5sZW5ndGggIT09IDEpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBjb25zdCB2YXJpYWJsZURlY2xhcmF0aW9uID0gbm9kZS5kZWNsYXJhdGlvbkxpc3QuZGVjbGFyYXRpb25zWzBdO1xuXG4gIGlmICghdHMuaXNJZGVudGlmaWVyKHZhcmlhYmxlRGVjbGFyYXRpb24ubmFtZSlcbiAgICAgIHx8ICF2YXJpYWJsZURlY2xhcmF0aW9uLmluaXRpYWxpemVyKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgbGV0IHBvdGVudGlhbENsYXNzID0gdmFyaWFibGVEZWNsYXJhdGlvbi5pbml0aWFsaXplcjtcblxuICAvLyBUUyAyLjMgaGFzIGFuIHVud3JhcHBlZCBjbGFzcyBJSUZFXG4gIC8vIFRTIDIuNCB1c2VzIGEgZnVuY3Rpb24gZXhwcmVzc2lvbiB3cmFwcGVyXG4gIC8vIFRTIDIuNSB1c2VzIGFuIGFycm93IGZ1bmN0aW9uIHdyYXBwZXJcbiAgaWYgKHRzLmlzUGFyZW50aGVzaXplZEV4cHJlc3Npb24ocG90ZW50aWFsQ2xhc3MpKSB7XG4gICAgcG90ZW50aWFsQ2xhc3MgPSBwb3RlbnRpYWxDbGFzcy5leHByZXNzaW9uO1xuICB9XG5cbiAgaWYgKCF0cy5pc0NhbGxFeHByZXNzaW9uKHBvdGVudGlhbENsYXNzKSB8fCBwb3RlbnRpYWxDbGFzcy5hcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGxldCB3cmFwcGVyQm9keTogdHMuQmxvY2s7XG4gIGlmICh0cy5pc0Z1bmN0aW9uRXhwcmVzc2lvbihwb3RlbnRpYWxDbGFzcy5leHByZXNzaW9uKSkge1xuICAgIHdyYXBwZXJCb2R5ID0gcG90ZW50aWFsQ2xhc3MuZXhwcmVzc2lvbi5ib2R5O1xuICB9IGVsc2UgaWYgKHRzLmlzQXJyb3dGdW5jdGlvbihwb3RlbnRpYWxDbGFzcy5leHByZXNzaW9uKVxuICAgICAgICAgICAgICYmIHRzLmlzQmxvY2socG90ZW50aWFsQ2xhc3MuZXhwcmVzc2lvbi5ib2R5KSkge1xuICAgIHdyYXBwZXJCb2R5ID0gcG90ZW50aWFsQ2xhc3MuZXhwcmVzc2lvbi5ib2R5O1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmICh3cmFwcGVyQm9keS5zdGF0ZW1lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGNvbnN0IGZ1bmN0aW9uRXhwcmVzc2lvbiA9IHBvdGVudGlhbENsYXNzLmV4cHJlc3Npb247XG4gIGNvbnN0IGZ1bmN0aW9uU3RhdGVtZW50cyA9IHdyYXBwZXJCb2R5LnN0YXRlbWVudHM7XG5cbiAgLy8gbmVlZCBhIG1pbmltdW0gb2YgdHdvIGZvciBhIGZ1bmN0aW9uIGRlY2xhcmF0aW9uIGFuZCByZXR1cm4gc3RhdGVtZW50XG4gIGlmIChmdW5jdGlvblN0YXRlbWVudHMubGVuZ3RoIDwgMikge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8vIFRoZSB2YXJpYWJsZSBuYW1lIHNob3VsZCBiZSB0aGUgY2xhc3MgbmFtZS5cbiAgY29uc3QgY2xhc3NOYW1lID0gdmFyaWFibGVEZWNsYXJhdGlvbi5uYW1lLnRleHQ7XG5cbiAgY29uc3QgZmlyc3RTdGF0ZW1lbnQgPSBmdW5jdGlvblN0YXRlbWVudHNbMF07XG5cbiAgLy8gZmluZCByZXR1cm4gc3RhdGVtZW50IC0gbWF5IG5vdCBiZSBsYXN0IHN0YXRlbWVudFxuICBsZXQgcmV0dXJuU3RhdGVtZW50OiB0cy5SZXR1cm5TdGF0ZW1lbnQgfCB1bmRlZmluZWQ7XG4gIGZvciAobGV0IGkgPSBmdW5jdGlvblN0YXRlbWVudHMubGVuZ3RoIC0gMTsgaSA+IDA7IGktLSkge1xuICAgIGlmICh0cy5pc1JldHVyblN0YXRlbWVudChmdW5jdGlvblN0YXRlbWVudHNbaV0pKSB7XG4gICAgICByZXR1cm5TdGF0ZW1lbnQgPSBmdW5jdGlvblN0YXRlbWVudHNbaV0gYXMgdHMuUmV0dXJuU3RhdGVtZW50O1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgaWYgKHJldHVyblN0YXRlbWVudCA9PSB1bmRlZmluZWRcbiAgICAgIHx8IHJldHVyblN0YXRlbWVudC5leHByZXNzaW9uID09IHVuZGVmaW5lZFxuICAgICAgfHwgIXRzLmlzSWRlbnRpZmllcihyZXR1cm5TdGF0ZW1lbnQuZXhwcmVzc2lvbikpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAoZnVuY3Rpb25FeHByZXNzaW9uLnBhcmFtZXRlcnMubGVuZ3RoID09PSAwKSB7XG4gICAgLy8gcG90ZW50aWFsIG5vbi1leHRlbmRlZCBjbGFzcyBvciB3cmFwcGVkIGVzMjAxNSBjbGFzc1xuICAgIHJldHVybiAodHMuaXNGdW5jdGlvbkRlY2xhcmF0aW9uKGZpcnN0U3RhdGVtZW50KSB8fCB0cy5pc0NsYXNzRGVjbGFyYXRpb24oZmlyc3RTdGF0ZW1lbnQpKVxuICAgICAgICAgICAmJiBmaXJzdFN0YXRlbWVudC5uYW1lICE9PSB1bmRlZmluZWRcbiAgICAgICAgICAgJiYgZmlyc3RTdGF0ZW1lbnQubmFtZS50ZXh0ID09PSBjbGFzc05hbWVcbiAgICAgICAgICAgJiYgcmV0dXJuU3RhdGVtZW50LmV4cHJlc3Npb24udGV4dCA9PT0gZmlyc3RTdGF0ZW1lbnQubmFtZS50ZXh0O1xuICB9IGVsc2UgaWYgKGZ1bmN0aW9uRXhwcmVzc2lvbi5wYXJhbWV0ZXJzLmxlbmd0aCAhPT0gMSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8vIFBvdGVudGlhbCBleHRlbmRlZCBjbGFzc1xuXG4gIGNvbnN0IGZ1bmN0aW9uUGFyYW1ldGVyID0gZnVuY3Rpb25FeHByZXNzaW9uLnBhcmFtZXRlcnNbMF07XG5cbiAgaWYgKCF0cy5pc0lkZW50aWZpZXIoZnVuY3Rpb25QYXJhbWV0ZXIubmFtZSlcbiAgICAgIHx8IGZ1bmN0aW9uUGFyYW1ldGVyLm5hbWUudGV4dCAhPT0gc3VwZXJQYXJhbWV0ZXJOYW1lKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKGZ1bmN0aW9uU3RhdGVtZW50cy5sZW5ndGggPCAzKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKCF0cy5pc0V4cHJlc3Npb25TdGF0ZW1lbnQoZmlyc3RTdGF0ZW1lbnQpXG4gICAgICB8fCAhdHMuaXNDYWxsRXhwcmVzc2lvbihmaXJzdFN0YXRlbWVudC5leHByZXNzaW9uKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGNvbnN0IGV4dGVuZENhbGxFeHByZXNzaW9uID0gZmlyc3RTdGF0ZW1lbnQuZXhwcmVzc2lvbjtcblxuICBpZiAoIXRzLmlzSWRlbnRpZmllcihleHRlbmRDYWxsRXhwcmVzc2lvbi5leHByZXNzaW9uKVxuICAgICAgfHwgIWV4dGVuZENhbGxFeHByZXNzaW9uLmV4cHJlc3Npb24udGV4dC5lbmRzV2l0aChleHRlbmRzSGVscGVyTmFtZSkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAoZXh0ZW5kQ2FsbEV4cHJlc3Npb24uYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGNvbnN0IGxhc3RBcmd1bWVudCA9IGV4dGVuZENhbGxFeHByZXNzaW9uLmFyZ3VtZW50c1tleHRlbmRDYWxsRXhwcmVzc2lvbi5hcmd1bWVudHMubGVuZ3RoIC0gMV07XG5cbiAgaWYgKCF0cy5pc0lkZW50aWZpZXIobGFzdEFyZ3VtZW50KSB8fCBsYXN0QXJndW1lbnQudGV4dCAhPT0gZnVuY3Rpb25QYXJhbWV0ZXIubmFtZS50ZXh0KSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgY29uc3Qgc2Vjb25kU3RhdGVtZW50ID0gZnVuY3Rpb25TdGF0ZW1lbnRzWzFdO1xuXG4gIHJldHVybiB0cy5pc0Z1bmN0aW9uRGVjbGFyYXRpb24oc2Vjb25kU3RhdGVtZW50KVxuICAgICAgICAgJiYgc2Vjb25kU3RhdGVtZW50Lm5hbWUgIT09IHVuZGVmaW5lZFxuICAgICAgICAgJiYgY2xhc3NOYW1lLmVuZHNXaXRoKHNlY29uZFN0YXRlbWVudC5uYW1lLnRleHQpXG4gICAgICAgICAmJiByZXR1cm5TdGF0ZW1lbnQuZXhwcmVzc2lvbi50ZXh0ID09PSBzZWNvbmRTdGF0ZW1lbnQubmFtZS50ZXh0O1xufVxuIl19