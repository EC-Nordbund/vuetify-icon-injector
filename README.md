# vuetify-icon-injector
<p align="center">
<a href="https://npmjs.com/package/vuetify-icon-injector/">
    <img alt="" src="https://img.shields.io/npm/v/vuetify-icon-injector/latest.svg?style=flat-square">
</a>
<a href="https://bundlephobia.com/result?p=vuetify-icon-injector">
    <img alt="" src="https://img.shields.io/bundlephobia/minzip/vuetify-icon-injector?style=flat-square">
</a>
<a href="https://npmjs.com/package/vuetify-icon-injector">
    <img alt="" src="https://img.shields.io/npm/dt/vuetify-icon-injector.svg?style=flat-square">
</a>
</p>

> Current status: beta - It should work but it coud also break your build. You can use it but be aware that some usecases require you to import the icons from @mdi/js your own.

## Usage
1. Install `yarn add vuetify-icon-injector` or `npm i vuetify-icon-injector`
2. Add it to your vue loader Options:


```js
const customIcons = {
  iconName: 'icon svg path'
}

const customIconMap = {
  'my-custom-icon': [
    'icon-prop-1',
    'icon-prop-2',
    'icon-prop-3'
  ]
}

const vueLoaderOptions = {
  compilerOptions: {
    modules: [
      require('vuetify-icon-injector').getIconInjector(customIcons, customIconMap) // arguments are optional
    ]
  }
}

// For Nuxt:
module.exports = {
  build: {
    loaders: {
      vue: vueLoaderOptions
    }
  }
}

```

