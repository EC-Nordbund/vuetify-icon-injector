# vuetify-icon-injector
> Current status: testing / prototyping NOT recomended to use!!

## Useage
1. Install `yarn add https://github.com/mathe42/vuetify-icon-injector`
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
