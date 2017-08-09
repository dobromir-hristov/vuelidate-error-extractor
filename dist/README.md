## Explanation of Build Files

- UMD: vuelidate-error-extractor.js
- CommonJS: vuelidate-error-extractor.common.js
- ES Module: vuelidate-error-extractor.esm.js
- UMD: message-extractor-mixin.js

### Terms

- **[UMD](https://github.com/umdjs/umd)**: UMD builds can be used directly in the browser via a `<script>` tag. The default file from Unpkg CDN at [https://unpkg.com/vuelidate-error-extractor](https://unpkg.com/vuelidate-error-extractor) is the UMD build (`vuelidate-error-extractor.js`).

- **[CommonJS](http://wiki.commonjs.org/wiki/Modules/1.1)**: CommonJS builds are intended for use with older bundlers like [browserify](http://browserify.org/) or [webpack 1](https://webpack.github.io). The default file for these bundlers (`pkg.main`) is the Runtime only CommonJS build (`vuelidate-error-extractor.common.js`).

- **[ES Module](http://exploringjs.com/es6/ch_modules.html)**: ES module builds are intended for use with modern bundlers like [webpack 2](https://webpack.js.org) or [rollup](http://rollupjs.org/). The default file for these bundlers (`pkg.module`) is the Runtime only ES Module build (`vuelidate-error-extractor.esm.js`).

- **Mixn**: Mixin is used to create your own template

- **Templates**: Ready for use components
