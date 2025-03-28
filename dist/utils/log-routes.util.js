"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logRoutes = void 0;
const logRoutes = (app) => {
    const routes = [];
    app._router.stack.forEach((middleware) => {
        if (middleware.route) {
            // Routes registered directly on the app
            const path = middleware.route.path;
            const methods = Object.keys(middleware.route.methods)
                .join(", ")
                .toUpperCase();
            routes.push(`${methods} ${path}`);
        }
        else if (middleware.name === "router" && middleware.handle.stack) {
            // Router middleware
            const basePath = middleware.regexp.source
                .replace("^\\", "")
                .replace("\\/?(?=\\/|$)", "")
                .replace(/\\\//g, "/");
            middleware.handle.stack.forEach((handler) => {
                if (handler.route) {
                    const path = handler.route.path;
                    const methods = Object.keys(handler.route.methods)
                        .join(", ")
                        .toUpperCase();
                    routes.push(`${methods} ${basePath}${path}`);
                }
            });
        }
    });
    console.log("Registered Routes:");
    routes.forEach((route) => console.log(route));
};
exports.logRoutes = logRoutes;
