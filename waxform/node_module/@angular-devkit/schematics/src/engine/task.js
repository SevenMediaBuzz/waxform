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
class UnknownTaskDependencyException extends core_1.BaseException {
    constructor(id) {
        super(`Unknown task dependency [ID: ${id.id}].`);
    }
}
exports.UnknownTaskDependencyException = UnknownTaskDependencyException;
class TaskScheduler {
    constructor(_context) {
        this._context = _context;
        this._queue = new core_1.PriorityQueue((x, y) => x.priority - y.priority);
        this._taskIds = new Map();
    }
    _calculatePriority(dependencies) {
        if (dependencies.size === 0) {
            return 0;
        }
        const prio = [...dependencies].reduce((prio, task) => prio + task.priority, 1);
        return prio;
    }
    _mapDependencies(dependencies) {
        if (!dependencies) {
            return new Set();
        }
        const tasks = dependencies.map(dep => {
            const task = this._taskIds.get(dep);
            if (!task) {
                throw new UnknownTaskDependencyException(dep);
            }
            return task;
        });
        return new Set(tasks);
    }
    schedule(taskConfiguration) {
        const dependencies = this._mapDependencies(taskConfiguration.dependencies);
        const priority = this._calculatePriority(dependencies);
        const task = {
            id: TaskScheduler._taskIdCounter++,
            priority,
            configuration: taskConfiguration,
            context: this._context,
        };
        this._queue.push(task);
        const id = { id: task.id };
        this._taskIds.set(id, task);
        return id;
    }
    finalize() {
        const tasks = this._queue.toArray();
        this._queue.clear();
        this._taskIds.clear();
        return tasks;
    }
}
TaskScheduler._taskIdCounter = 1;
exports.TaskScheduler = TaskScheduler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFzay5qcyIsInNvdXJjZVJvb3QiOiIuLyIsInNvdXJjZXMiOlsicGFja2FnZXMvYW5ndWxhcl9kZXZraXQvc2NoZW1hdGljcy9zcmMvZW5naW5lL3Rhc2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7O0dBTUc7QUFDSCwrQ0FBb0U7QUFJcEUsb0NBQTRDLFNBQVEsb0JBQWE7SUFDL0QsWUFBWSxFQUFVO1FBQ3BCLEtBQUssQ0FBQyxnQ0FBZ0MsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDbkQsQ0FBQztDQUNGO0FBSkQsd0VBSUM7QUErQkQ7SUFLRSxZQUFvQixRQUEwQjtRQUExQixhQUFRLEdBQVIsUUFBUSxDQUFrQjtRQUp0QyxXQUFNLEdBQUcsSUFBSSxvQkFBYSxDQUFXLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDeEUsYUFBUSxHQUFHLElBQUksR0FBRyxFQUFvQixDQUFDO0lBR0UsQ0FBQztJQUUxQyxrQkFBa0IsQ0FBQyxZQUEyQjtRQUNwRCxFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDNUIsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNYLENBQUM7UUFFRCxNQUFNLElBQUksR0FBRyxDQUFDLEdBQUcsWUFBWSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFFL0UsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNkLENBQUM7SUFFTyxnQkFBZ0IsQ0FBQyxZQUE0QjtRQUNuRCxFQUFFLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7WUFDbEIsTUFBTSxDQUFDLElBQUksR0FBRyxFQUFFLENBQUM7UUFDbkIsQ0FBQztRQUVELE1BQU0sS0FBSyxHQUFHLFlBQVksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDbkMsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDcEMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNWLE1BQU0sSUFBSSw4QkFBOEIsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNoRCxDQUFDO1lBRUQsTUFBTSxDQUFDLElBQUksQ0FBQztRQUNkLENBQUMsQ0FBQyxDQUFDO1FBRUgsTUFBTSxDQUFDLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3hCLENBQUM7SUFFRCxRQUFRLENBQUksaUJBQXVDO1FBQ2pELE1BQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxpQkFBaUIsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUMzRSxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsWUFBWSxDQUFDLENBQUM7UUFFdkQsTUFBTSxJQUFJLEdBQUc7WUFDWCxFQUFFLEVBQUUsYUFBYSxDQUFDLGNBQWMsRUFBRTtZQUNsQyxRQUFRO1lBQ1IsYUFBYSxFQUFFLGlCQUFpQjtZQUNoQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFFBQVE7U0FDdkIsQ0FBQztRQUVGLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRXZCLE1BQU0sRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQztRQUMzQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFFNUIsTUFBTSxDQUFDLEVBQUUsQ0FBQztJQUNaLENBQUM7SUFFRCxRQUFRO1FBQ04sTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUNwQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ3BCLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLENBQUM7UUFFdEIsTUFBTSxDQUFDLEtBQUssQ0FBQztJQUNmLENBQUM7O0FBeERjLDRCQUFjLEdBQUcsQ0FBQyxDQUFDO0FBSHBDLHNDQTZEQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7IEJhc2VFeGNlcHRpb24sIFByaW9yaXR5UXVldWUgfSBmcm9tICdAYW5ndWxhci1kZXZraXQvY29yZSc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcy9PYnNlcnZhYmxlJztcbmltcG9ydCB7IFNjaGVtYXRpY0NvbnRleHQgfSBmcm9tICcuL2ludGVyZmFjZSc7XG5cbmV4cG9ydCBjbGFzcyBVbmtub3duVGFza0RlcGVuZGVuY3lFeGNlcHRpb24gZXh0ZW5kcyBCYXNlRXhjZXB0aW9uIHtcbiAgY29uc3RydWN0b3IoaWQ6IFRhc2tJZCkge1xuICAgIHN1cGVyKGBVbmtub3duIHRhc2sgZGVwZW5kZW5jeSBbSUQ6ICR7aWQuaWR9XS5gKTtcbiAgfVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIFRhc2tDb25maWd1cmF0aW9uPFQgPSB7fT4ge1xuICBuYW1lOiBzdHJpbmc7XG4gIGRlcGVuZGVuY2llcz86IEFycmF5PFRhc2tJZD47XG4gIG9wdGlvbnM/OiBUO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFRhc2tDb25maWd1cmF0aW9uR2VuZXJhdG9yPFQgPSB7fT4ge1xuICB0b0NvbmZpZ3VyYXRpb24oKTogVGFza0NvbmZpZ3VyYXRpb248VD47XG59XG5cbmV4cG9ydCB0eXBlIFRhc2tFeGVjdXRvcjxUID0ge30+XG4gID0gKG9wdGlvbnM6IFQgfCB1bmRlZmluZWQsIGNvbnRleHQ6IFNjaGVtYXRpY0NvbnRleHQpID0+IFByb21pc2U8dm9pZD4gfCBPYnNlcnZhYmxlPHZvaWQ+O1xuXG5leHBvcnQgaW50ZXJmYWNlIFRhc2tFeGVjdXRvckZhY3Rvcnk8VD4ge1xuICByZWFkb25seSBuYW1lOiBzdHJpbmc7XG4gIGNyZWF0ZShvcHRpb25zPzogVCk6IFByb21pc2U8VGFza0V4ZWN1dG9yPiB8IE9ic2VydmFibGU8VGFza0V4ZWN1dG9yPjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBUYXNrSWQge1xuICByZWFkb25seSBpZDogbnVtYmVyO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFRhc2tJbmZvIHtcbiAgcmVhZG9ubHkgaWQ6IG51bWJlcjtcbiAgcmVhZG9ubHkgcHJpb3JpdHk6ICBudW1iZXI7XG4gIHJlYWRvbmx5IGNvbmZpZ3VyYXRpb246IFRhc2tDb25maWd1cmF0aW9uO1xuICByZWFkb25seSBjb250ZXh0OiBTY2hlbWF0aWNDb250ZXh0O1xufVxuXG5leHBvcnQgY2xhc3MgVGFza1NjaGVkdWxlciB7XG4gIHByaXZhdGUgX3F1ZXVlID0gbmV3IFByaW9yaXR5UXVldWU8VGFza0luZm8+KCh4LCB5KSA9PiB4LnByaW9yaXR5IC0geS5wcmlvcml0eSk7XG4gIHByaXZhdGUgX3Rhc2tJZHMgPSBuZXcgTWFwPFRhc2tJZCwgVGFza0luZm8+KCk7XG4gIHByaXZhdGUgc3RhdGljIF90YXNrSWRDb3VudGVyID0gMTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9jb250ZXh0OiBTY2hlbWF0aWNDb250ZXh0KSB7fVxuXG4gIHByaXZhdGUgX2NhbGN1bGF0ZVByaW9yaXR5KGRlcGVuZGVuY2llczogU2V0PFRhc2tJbmZvPik6IG51bWJlciB7XG4gICAgaWYgKGRlcGVuZGVuY2llcy5zaXplID09PSAwKSB7XG4gICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICBjb25zdCBwcmlvID0gWy4uLmRlcGVuZGVuY2llc10ucmVkdWNlKChwcmlvLCB0YXNrKSA9PiBwcmlvICsgdGFzay5wcmlvcml0eSwgMSk7XG5cbiAgICByZXR1cm4gcHJpbztcbiAgfVxuXG4gIHByaXZhdGUgX21hcERlcGVuZGVuY2llcyhkZXBlbmRlbmNpZXM/OiBBcnJheTxUYXNrSWQ+KTogU2V0PFRhc2tJbmZvPiB7XG4gICAgaWYgKCFkZXBlbmRlbmNpZXMpIHtcbiAgICAgIHJldHVybiBuZXcgU2V0KCk7XG4gICAgfVxuXG4gICAgY29uc3QgdGFza3MgPSBkZXBlbmRlbmNpZXMubWFwKGRlcCA9PiB7XG4gICAgICBjb25zdCB0YXNrID0gdGhpcy5fdGFza0lkcy5nZXQoZGVwKTtcbiAgICAgIGlmICghdGFzaykge1xuICAgICAgICB0aHJvdyBuZXcgVW5rbm93blRhc2tEZXBlbmRlbmN5RXhjZXB0aW9uKGRlcCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0YXNrO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIG5ldyBTZXQodGFza3MpO1xuICB9XG5cbiAgc2NoZWR1bGU8VD4odGFza0NvbmZpZ3VyYXRpb246IFRhc2tDb25maWd1cmF0aW9uPFQ+KTogVGFza0lkIHtcbiAgICBjb25zdCBkZXBlbmRlbmNpZXMgPSB0aGlzLl9tYXBEZXBlbmRlbmNpZXModGFza0NvbmZpZ3VyYXRpb24uZGVwZW5kZW5jaWVzKTtcbiAgICBjb25zdCBwcmlvcml0eSA9IHRoaXMuX2NhbGN1bGF0ZVByaW9yaXR5KGRlcGVuZGVuY2llcyk7XG5cbiAgICBjb25zdCB0YXNrID0ge1xuICAgICAgaWQ6IFRhc2tTY2hlZHVsZXIuX3Rhc2tJZENvdW50ZXIrKyxcbiAgICAgIHByaW9yaXR5LFxuICAgICAgY29uZmlndXJhdGlvbjogdGFza0NvbmZpZ3VyYXRpb24sXG4gICAgICBjb250ZXh0OiB0aGlzLl9jb250ZXh0LFxuICAgIH07XG5cbiAgICB0aGlzLl9xdWV1ZS5wdXNoKHRhc2spO1xuXG4gICAgY29uc3QgaWQgPSB7IGlkOiB0YXNrLmlkIH07XG4gICAgdGhpcy5fdGFza0lkcy5zZXQoaWQsIHRhc2spO1xuXG4gICAgcmV0dXJuIGlkO1xuICB9XG5cbiAgZmluYWxpemUoKTogUmVhZG9ubHlBcnJheTxUYXNrSW5mbz4ge1xuICAgIGNvbnN0IHRhc2tzID0gdGhpcy5fcXVldWUudG9BcnJheSgpO1xuICAgIHRoaXMuX3F1ZXVlLmNsZWFyKCk7XG4gICAgdGhpcy5fdGFza0lkcy5jbGVhcigpO1xuXG4gICAgcmV0dXJuIHRhc2tzO1xuICB9XG5cbn1cbiJdfQ==