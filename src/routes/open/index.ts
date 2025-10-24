// src/routes/open/index.ts

// These files export **named** routers like `export const helloRoutes = Router()`
export { helloRoutes } from './helloRoutes';
export { healthRoutes } from './healthRoutes';
export { parametersRoutes } from './parametersRoutes';

// These files commonly export **default** routers like `export default r`
export { default as docsRoutes } from './docsRoutes';
export { default as moviesRoutes } from './movies.routes';

// If your docsRoutes or movies.routes actually export **named** values instead,
// comment the two lines above and use the following instead:
//
// export { docsRoutes } from './docsRoutes';
// export { moviesRoutes } from './movies.routes';
