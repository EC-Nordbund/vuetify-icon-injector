# @ec-nordbund/vuetify-icon-injector
<p align="center">
<a href="https://npmjs.com/package/@ec-nordbund/vuetify-icon-injector/">
    <img alt="" src="https://img.shields.io/npm/v/@ec-nordbund/vuetify-icon-injector/latest.svg?style=flat-square">
</a>
<!-- <a href="https://bundlephobia.com/result?p=vuetify-icon-injector">
    <img alt="" src="https://img.shields.io/bundlephobia/minzip/vuetify-icon-injector?style=flat-square">
</a> -->
<a href="https://npmjs.com/package/@ec-nordbund/vuetify-icon-injector">
    <img alt="" src="https://img.shields.io/npm/dt/@ec-nordbund/vuetify-icon-injector.svg?style=flat-square">
</a>
</p>

## What does this package do?
If installed it automaticly changes the output of `vue-template-compiler`. The icons (so the strings `mdi-***`) are automaticly replaced with the corresponding svg path. This only happens in the folling use-cases:

```html
<v-icon>mdi-example</v-icon>
<v-icon v-text="'mdi-example'"></v-icon>
<v-icon v-html="'mdi-example'"></v-icon>

<v-component prop="mdi-example"></v-component>
<v-component :prop="'mdi-example'"></v-component>
<v-component v-bind:prop="'mdi-example'"></v-component>
```

This only works for `v-component` and `prop` if it is registerd in the `src/vuetifyIconProps.ts` File. You can add your custom component and props to the list.

If a vuetify Prop or Component is missing just create a issue or a PR.

> Since Version 2.3.0 you can use PascalCase and CamelCase Component names in your the .vue files and they will be automaticly detected.

### JS in template
It just uses String replace to handle this. So you can use something like:


```html
<v-component :prop="1==2 ? 'mdi-example1' : 'mdi-example2'"></v-component>
```

So remeber not to use `mdi-***` strings in your template for any other reason than for the icons.

## Install
1. Install `yarn add @ec-nordbund/vuetify-icon-injector` or `npm i @ec-nordbund/vuetify-icon-injector`
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
      require('@ec-nordbund/vuetify-icon-injector').getIconInjector(customIcons, customIconMap) // arguments are optional
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

## Vuetify and Nuxt
You could use my Module https://github.com/EC-Nordbund/vuetify-module it automaticly activates and setup this package.
