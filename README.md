# vuetify-icon-injector
> Current status: testing / prototyping NOT recomended to use!!

## Useage
1. Install `yarn add https://github.com/mathe42/vuetify-icon-injector`
2. Add it to your vue loader Options:


```js
const vueLoaderOptions = {
  compilerOptions: {
    modules: [
      require('vuetify-icon-injector').getIconInjector()
    ]
  }
}
```

## Options
`getIconInjector` accepts some arguments:


```js
getIconInjector(
  customIcons, // {iconName: 'svgPath'}
  customHandlerFunction, // (attributeValue: string) => null | string
  useAlwaysCustomHandlerFunction // boolean
)
```

Something like:

```html
<v-icon>mdi-*</v-icon>
```

and

```html
<v-text-field append-icon="mdi-*"/>
```

is easy to handle. But 

```html
<v-text-field :append-icon="condition?'mdi-*':'mdi-*'"/>
<v-text-field v-bind:append-icon="condition?'mdi-*':'mdi-*'"/>
```

is not. The above cases the module currently can handle. But if you have nested conditions it breaks (In this cases the attribute is untouched).

## Contibute

