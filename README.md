## React Webpack Boilerplate

`npm install`
`bower install`
`gulp serve`

NOTE: [gulp 4.0](https://github.com/gulpjs/gulp/tree/4.0) must be installed globally.

`npm install -g git://github.com/gulpjs/gulp.git#4.0`

### Build
`gulp build` // builds dev env.

`gulp build --env=prod` // builds prod env.

`gulp build --release` // builds dev env minified and revisioned

`gulp build --watch` // builds dev env and watches src for changes

## Server
The server command as the same signature as build but also starts up the server, e.g.

`gulp serve --env=dev --release --watch`

### Todo   
- [x] Build
- [x] Enviroment settings
- [x] ~~Webpack dev server~~ (tried, not worth the second server)
- [x] CSS autoprefixer
- [x] Revision assets (webpack does this for free)
- [ ] Test task
- [ ] Lint task
- [ ] Custom Modernizr
- [ ] [Replace handlebars with React on the server](https://github.com/gpbl/isomorphic-react-template/blob/master/server.jsx).
- [ ] Flux
- [ ] Isomorphic using [enhanced-require](https://github.com/webpack/enhanced-require) (Started, see isomorphic branch) OR [check this out](https://github.com/webpack/react-webpack-server-side-example)
- [x] Add editor config
