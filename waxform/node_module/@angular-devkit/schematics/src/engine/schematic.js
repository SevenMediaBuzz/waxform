"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const core_1 = require("@angular-devkit/core");
const of_1 = require("rxjs/observable/of");
const concatMap_1 = require("rxjs/operators/concatMap");
const first_1 = require("rxjs/operators/first");
const map_1 = require("rxjs/operators/map");
const call_1 = require("../rules/call");
class InvalidSchematicsNameException extends core_1.BaseException {
    constructor(name) {
        super(`Schematics has invalid name: "${name}".`);
    }
}
exports.InvalidSchematicsNameException = InvalidSchematicsNameException;
class SchematicImpl {
    constructor(_description, _factory, _collection, _engine) {
        this._description = _description;
        this._factory = _factory;
        this._collection = _collection;
        this._engine = _engine;
        if (!_description.name.match(/^[-@/_.a-zA-Z0-9]+$/)) {
            throw new InvalidSchematicsNameException(_description.name);
        }
    }
    get description() { return this._description; }
    get collection() { return this._collection; }
    call(options, host, parentContext) {
        const context = this._engine.createContext(this, parentContext);
        return host
            .pipe(first_1.first(), concatMap_1.concatMap(tree => this._engine.transformOptions(this, options).pipe(map_1.map(o => [tree, o]))), concatMap_1.concatMap(([tree, transformedOptions]) => {
            return call_1.callRule(this._factory(transformedOptions), of_1.of(tree), context);
        }));
    }
}
exports.SchematicImpl = SchematicImpl;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NoZW1hdGljLmpzIiwic291cmNlUm9vdCI6Ii4vIiwic291cmNlcyI6WyJwYWNrYWdlcy9hbmd1bGFyX2RldmtpdC9zY2hlbWF0aWNzL3NyYy9lbmdpbmUvc2NoZW1hdGljLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7OztHQU1HO0FBQ0gsK0NBQXFEO0FBRXJELDJDQUF3RDtBQUN4RCx3REFBcUQ7QUFDckQsZ0RBQTZDO0FBQzdDLDRDQUF5QztBQUN6Qyx3Q0FBeUM7QUFZekMsb0NBQTRDLFNBQVEsb0JBQWE7SUFDL0QsWUFBWSxJQUFZO1FBQ3RCLEtBQUssQ0FBQyxpQ0FBaUMsSUFBSSxJQUFJLENBQUMsQ0FBQztJQUNuRCxDQUFDO0NBQ0Y7QUFKRCx3RUFJQztBQUdEO0lBR0UsWUFBb0IsWUFBMkQsRUFDM0QsUUFBeUIsRUFDekIsV0FBZ0QsRUFDaEQsT0FBd0M7UUFIeEMsaUJBQVksR0FBWixZQUFZLENBQStDO1FBQzNELGFBQVEsR0FBUixRQUFRLENBQWlCO1FBQ3pCLGdCQUFXLEdBQVgsV0FBVyxDQUFxQztRQUNoRCxZQUFPLEdBQVAsT0FBTyxDQUFpQztRQUMxRCxFQUFFLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3BELE1BQU0sSUFBSSw4QkFBOEIsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDOUQsQ0FBQztJQUNILENBQUM7SUFFRCxJQUFJLFdBQVcsS0FBSyxNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7SUFDL0MsSUFBSSxVQUFVLEtBQUssTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO0lBRTdDLElBQUksQ0FDRixPQUFnQixFQUNoQixJQUFzQixFQUN0QixhQUF1RTtRQUV2RSxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxJQUFJLEVBQUUsYUFBYSxDQUFDLENBQUM7UUFFaEUsTUFBTSxDQUFDLElBQUk7YUFDUixJQUFJLENBQ0gsYUFBSyxFQUFFLEVBQ1AscUJBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FDakUsU0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FDcEIsQ0FBQyxFQUNGLHFCQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxrQkFBa0IsQ0FBa0IsRUFBRSxFQUFFO1lBQ3hELE1BQU0sQ0FBQyxlQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxrQkFBa0IsQ0FBQyxFQUFFLE9BQVksQ0FBQyxJQUFJLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUNsRixDQUFDLENBQUMsQ0FDSCxDQUFDO0lBQ04sQ0FBQztDQUNGO0FBakNELHNDQWlDQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7IEJhc2VFeGNlcHRpb24gfSBmcm9tICdAYW5ndWxhci1kZXZraXQvY29yZSc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcy9PYnNlcnZhYmxlJztcbmltcG9ydCB7IG9mIGFzIG9ic2VydmFibGVPZiB9IGZyb20gJ3J4anMvb2JzZXJ2YWJsZS9vZic7XG5pbXBvcnQgeyBjb25jYXRNYXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycy9jb25jYXRNYXAnO1xuaW1wb3J0IHsgZmlyc3QgfSBmcm9tICdyeGpzL29wZXJhdG9ycy9maXJzdCc7XG5pbXBvcnQgeyBtYXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycy9tYXAnO1xuaW1wb3J0IHsgY2FsbFJ1bGUgfSBmcm9tICcuLi9ydWxlcy9jYWxsJztcbmltcG9ydCB7IFRyZWUgfSBmcm9tICcuLi90cmVlL2ludGVyZmFjZSc7XG5pbXBvcnQge1xuICBDb2xsZWN0aW9uLFxuICBFbmdpbmUsXG4gIFJ1bGVGYWN0b3J5LFxuICBTY2hlbWF0aWMsXG4gIFNjaGVtYXRpY0Rlc2NyaXB0aW9uLFxuICBUeXBlZFNjaGVtYXRpY0NvbnRleHQsXG59IGZyb20gJy4vaW50ZXJmYWNlJztcblxuXG5leHBvcnQgY2xhc3MgSW52YWxpZFNjaGVtYXRpY3NOYW1lRXhjZXB0aW9uIGV4dGVuZHMgQmFzZUV4Y2VwdGlvbiB7XG4gIGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZykge1xuICAgIHN1cGVyKGBTY2hlbWF0aWNzIGhhcyBpbnZhbGlkIG5hbWU6IFwiJHtuYW1lfVwiLmApO1xuICB9XG59XG5cblxuZXhwb3J0IGNsYXNzIFNjaGVtYXRpY0ltcGw8Q29sbGVjdGlvblQgZXh0ZW5kcyBvYmplY3QsIFNjaGVtYXRpY1QgZXh0ZW5kcyBvYmplY3Q+XG4gICAgaW1wbGVtZW50cyBTY2hlbWF0aWM8Q29sbGVjdGlvblQsIFNjaGVtYXRpY1Q+IHtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9kZXNjcmlwdGlvbjogU2NoZW1hdGljRGVzY3JpcHRpb248Q29sbGVjdGlvblQsIFNjaGVtYXRpY1Q+LFxuICAgICAgICAgICAgICBwcml2YXRlIF9mYWN0b3J5OiBSdWxlRmFjdG9yeTx7fT4sXG4gICAgICAgICAgICAgIHByaXZhdGUgX2NvbGxlY3Rpb246IENvbGxlY3Rpb248Q29sbGVjdGlvblQsIFNjaGVtYXRpY1Q+LFxuICAgICAgICAgICAgICBwcml2YXRlIF9lbmdpbmU6IEVuZ2luZTxDb2xsZWN0aW9uVCwgU2NoZW1hdGljVD4pIHtcbiAgICBpZiAoIV9kZXNjcmlwdGlvbi5uYW1lLm1hdGNoKC9eWy1AL18uYS16QS1aMC05XSskLykpIHtcbiAgICAgIHRocm93IG5ldyBJbnZhbGlkU2NoZW1hdGljc05hbWVFeGNlcHRpb24oX2Rlc2NyaXB0aW9uLm5hbWUpO1xuICAgIH1cbiAgfVxuXG4gIGdldCBkZXNjcmlwdGlvbigpIHsgcmV0dXJuIHRoaXMuX2Rlc2NyaXB0aW9uOyB9XG4gIGdldCBjb2xsZWN0aW9uKCkgeyByZXR1cm4gdGhpcy5fY29sbGVjdGlvbjsgfVxuXG4gIGNhbGw8T3B0aW9uVCBleHRlbmRzIG9iamVjdD4oXG4gICAgb3B0aW9uczogT3B0aW9uVCxcbiAgICBob3N0OiBPYnNlcnZhYmxlPFRyZWU+LFxuICAgIHBhcmVudENvbnRleHQ/OiBQYXJ0aWFsPFR5cGVkU2NoZW1hdGljQ29udGV4dDxDb2xsZWN0aW9uVCwgU2NoZW1hdGljVD4+LFxuICApOiBPYnNlcnZhYmxlPFRyZWU+IHtcbiAgICBjb25zdCBjb250ZXh0ID0gdGhpcy5fZW5naW5lLmNyZWF0ZUNvbnRleHQodGhpcywgcGFyZW50Q29udGV4dCk7XG5cbiAgICByZXR1cm4gaG9zdFxuICAgICAgLnBpcGUoXG4gICAgICAgIGZpcnN0KCksXG4gICAgICAgIGNvbmNhdE1hcCh0cmVlID0+IHRoaXMuX2VuZ2luZS50cmFuc2Zvcm1PcHRpb25zKHRoaXMsIG9wdGlvbnMpLnBpcGUoXG4gICAgICAgICAgbWFwKG8gPT4gW3RyZWUsIG9dKSxcbiAgICAgICAgKSksXG4gICAgICAgIGNvbmNhdE1hcCgoW3RyZWUsIHRyYW5zZm9ybWVkT3B0aW9uc106IFtUcmVlLCBPcHRpb25UXSkgPT4ge1xuICAgICAgICAgIHJldHVybiBjYWxsUnVsZSh0aGlzLl9mYWN0b3J5KHRyYW5zZm9ybWVkT3B0aW9ucyksIG9ic2VydmFibGVPZih0cmVlKSwgY29udGV4dCk7XG4gICAgICAgIH0pLFxuICAgICAgKTtcbiAgfVxufVxuIl19