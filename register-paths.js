const tsConfigPaths = require('tsconfig-paths');

tsConfigPaths.register({
    baseUrl: './dist',
    paths: {
        '@/*': ['*'],
        '@controllers/*': ['controllers/*'],
        '@middleware/*': ['core/middleware/*'],
        '@utilities/*': ['core/utilities/*'],
        '@routes/*': ['routes/*'],
        '@/types': ['types'],
    },
});
