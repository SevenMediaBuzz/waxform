"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const options_1 = require("./options");
class RepositoryInitializerTask {
    constructor(workingDirectory, commitOptions) {
        this.workingDirectory = workingDirectory;
        this.commitOptions = commitOptions;
    }
    toConfiguration() {
        return {
            name: options_1.RepositoryInitializerName,
            options: {
                commit: !!this.commitOptions,
                workingDirectory: this.workingDirectory,
                authorName: this.commitOptions && this.commitOptions.name,
                authorEmail: this.commitOptions && this.commitOptions.email,
                message: this.commitOptions && this.commitOptions.message,
            },
        };
    }
}
exports.RepositoryInitializerTask = RepositoryInitializerTask;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5pdC10YXNrLmpzIiwic291cmNlUm9vdCI6Ii4vIiwic291cmNlcyI6WyJwYWNrYWdlcy9hbmd1bGFyX2RldmtpdC9zY2hlbWF0aWNzL3Rhc2tzL3JlcG8taW5pdC9pbml0LXRhc2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFRQSx1Q0FBd0Y7QUFReEY7SUFHRSxZQUFtQixnQkFBeUIsRUFBUyxhQUE2QjtRQUEvRCxxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQVM7UUFBUyxrQkFBYSxHQUFiLGFBQWEsQ0FBZ0I7SUFBRyxDQUFDO0lBRXRGLGVBQWU7UUFDYixNQUFNLENBQUM7WUFDTCxJQUFJLEVBQUUsbUNBQXlCO1lBQy9CLE9BQU8sRUFBRTtnQkFDUCxNQUFNLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxhQUFhO2dCQUM1QixnQkFBZ0IsRUFBRSxJQUFJLENBQUMsZ0JBQWdCO2dCQUN2QyxVQUFVLEVBQUUsSUFBSSxDQUFDLGFBQWEsSUFBSSxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUk7Z0JBQ3pELFdBQVcsRUFBRSxJQUFJLENBQUMsYUFBYSxJQUFJLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSztnQkFDM0QsT0FBTyxFQUFFLElBQUksQ0FBQyxhQUFhLElBQUksSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPO2FBQzFEO1NBQ0YsQ0FBQztJQUNKLENBQUM7Q0FDRjtBQWpCRCw4REFpQkMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQgeyBUYXNrQ29uZmlndXJhdGlvbiwgVGFza0NvbmZpZ3VyYXRpb25HZW5lcmF0b3IgfSBmcm9tICcuLi8uLi9zcmMnO1xuaW1wb3J0IHsgUmVwb3NpdG9yeUluaXRpYWxpemVyTmFtZSwgUmVwb3NpdG9yeUluaXRpYWxpemVyVGFza09wdGlvbnMgfSBmcm9tICcuL29wdGlvbnMnO1xuXG5leHBvcnQgaW50ZXJmYWNlIENvbW1pdE9wdGlvbnMge1xuICBtZXNzYWdlPzogc3RyaW5nO1xuICBuYW1lOiBzdHJpbmc7XG4gIGVtYWlsOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBjbGFzcyBSZXBvc2l0b3J5SW5pdGlhbGl6ZXJUYXNrXG4gIGltcGxlbWVudHMgVGFza0NvbmZpZ3VyYXRpb25HZW5lcmF0b3I8UmVwb3NpdG9yeUluaXRpYWxpemVyVGFza09wdGlvbnM+IHtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgd29ya2luZ0RpcmVjdG9yeT86IHN0cmluZywgcHVibGljIGNvbW1pdE9wdGlvbnM/OiBDb21taXRPcHRpb25zKSB7fVxuXG4gIHRvQ29uZmlndXJhdGlvbigpOiBUYXNrQ29uZmlndXJhdGlvbjxSZXBvc2l0b3J5SW5pdGlhbGl6ZXJUYXNrT3B0aW9ucz4ge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lOiBSZXBvc2l0b3J5SW5pdGlhbGl6ZXJOYW1lLFxuICAgICAgb3B0aW9uczoge1xuICAgICAgICBjb21taXQ6ICEhdGhpcy5jb21taXRPcHRpb25zLFxuICAgICAgICB3b3JraW5nRGlyZWN0b3J5OiB0aGlzLndvcmtpbmdEaXJlY3RvcnksXG4gICAgICAgIGF1dGhvck5hbWU6IHRoaXMuY29tbWl0T3B0aW9ucyAmJiB0aGlzLmNvbW1pdE9wdGlvbnMubmFtZSxcbiAgICAgICAgYXV0aG9yRW1haWw6IHRoaXMuY29tbWl0T3B0aW9ucyAmJiB0aGlzLmNvbW1pdE9wdGlvbnMuZW1haWwsXG4gICAgICAgIG1lc3NhZ2U6IHRoaXMuY29tbWl0T3B0aW9ucyAmJiB0aGlzLmNvbW1pdE9wdGlvbnMubWVzc2FnZSxcbiAgICAgIH0sXG4gICAgfTtcbiAgfVxufVxuIl19