import { Express, Request, Response } from "express";

export const logRoutes = (app: Express) => {
  const routes: string[] = [];
  app._router.stack.forEach((middleware: any) => {
    if (middleware.route) {
      // Routes registered directly on the app
      const path = middleware.route.path;
      const methods = Object.keys(middleware.route.methods)
        .join(", ")
        .toUpperCase();
      routes.push(`${methods} ${path}`);
    } else if (middleware.name === "router" && middleware.handle.stack) {
      // Router middleware
      const basePath = middleware.regexp.source
        .replace("^\\", "")
        .replace("\\/?(?=\\/|$)", "")
        .replace(/\\\//g, "/");
      middleware.handle.stack.forEach((handler: any) => {
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
