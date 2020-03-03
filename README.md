# vuetify-icon-injector
> Current status: beta - It should work but it coud also break your build. You can use it but be aware that some usecases require you to import the icons from @mdi/js your own.

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


## I want to use a other icon font

I plan to implement that but it is not yet done. Fell free to create a PR. Plan is to add that as an extra extra Option to the getIconInjector function.
