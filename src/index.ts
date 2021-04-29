import camelToKebabCase from "camel-to-kebab";
import type { ASTElement } from "vue-template-compiler";
import { iconMaps } from "./vuetifyIconProps";
import { mdi } from "./mdi";

export type IconMap = { [tag: string]: Array<string> };
export type Icons = { [iconName: string]: string };

export function combineIconMaps(iconMap1: IconMap, iconMap2: IconMap): IconMap {
  const newMap: IconMap = { ...iconMap1 };

  Object.keys(iconMap2).forEach((cmp) => {
    if (newMap[cmp]) {
      newMap[cmp] = [...iconMap1[cmp], ...iconMap2[cmp]];
    } else {
      newMap[cmp] = iconMap2[cmp];
    }
  });

  return newMap;
}

/**
 * Returns a module to inject into vue loader config at compilerOptions.modules (in Nuxt it is build.loaders.vue.compilerOptions.modules)
 *
 * @param customIcons Object with custom icon definition Object.keys(customIcons) has to be orderd by length decending.
 */
export function getIconInjector(
  customIcons: Icons = {},
  customIconMaps: IconMap = {}
): any {
  let iconMap = combineIconMaps(iconMaps, customIconMaps);

  function iconParser(attrValue: string): string {
    // Handle MDI
    Object.keys(mdi).forEach((icon) => {
      attrValue = attrValue.split(icon).join(mdi[icon]);
    });

    // Handle Custom Icons
    Object.keys(customIcons).forEach((icon) => {
      attrValue = attrValue.split(icon).join(customIcons[icon]);
    });

    return attrValue;
  }

  return {
    // Handle <v-icon>mdi-*</v-icon>
    transformNode(el: ASTElement) {
      // Check for correct Tag
      if (camelToKebabCase(el.tag) === "v-icon" && el.children[0].text) {
        // Replace
        el.children[0].text = iconParser(el.children[0].text);
        // Replace Expression
        if (el.children[0].type === 2) {
          el.children[0].expression = iconParser(el.children[0].expression);
        }
        return el;
      }
    },

    // Props handler
    preTransformNode(el: ASTElement) {
      const tag = camelToKebabCase(el.tag);
      let changed = false;

      function handleAttribute(attrName: string) {
        // Check if Attribute exists
        if (el.attrsMap[attrName]) {
          // Get values
          const value = el.attrsMap[attrName];
          const newValue = iconParser(value);

          // Replace
          el.attrsMap[attrName] = newValue;
          el.attrsList.forEach((at) => {
            if (at.name === attrName) {
              at.value = newValue;
            }
          });

          // Return replacement Node
          changed = true;
        }
      }

      if (iconMap[tag]) {
        iconMap[tag].forEach((attr) => {
          // Handle for example <v-text-field append-icon="mdi-*"/>
          handleAttribute(attr);

          // Handle for example <v-text-field :append-icon="'mdi-*'"/>
          handleAttribute(":" + attr);

          // Handle for example <v-text-field v-bind:append-icon="'mdi-*'"/>
          handleAttribute("v-bind:" + attr);
        });
      }

      if (tag === "v-icon") {
        // Handle for example <v-icon v-text="'mdi-*'"></v-icon>
        handleAttribute("v-text");
        // Handle for example <v-icon v-html="'mdi-*'"></v-icon>
        handleAttribute("v-html");
      }

      // If changed return replacement
      if (changed) {
        return el;
      }
    },
  };
}
