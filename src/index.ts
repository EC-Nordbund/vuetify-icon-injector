import { ASTElement } from "vue-template-compiler";
import * as mdi from "@mdi/js";
import { camelToKebabCase } from "./camelToKebabCase";

// TODO: extend list with props for icons
const iconMaps: { [tag: string]: Array<string> } = {
  "v-text-field": ["append-icon", "append-outer-icon"]
};

const mdiIcons: { [name: string]: string } = {};

Object.keys(mdi)
  .sort((a, b) => {
    return b.length - a.length;
  })
  .forEach(key => {
    // @ts-ignore
    mdiIcons[camelToKebabCase(key)] = mdi[key];
  });

/**
 * Returns a module to inject into vue loader config at compilerOptions.modules (in Nuxt it is build.loaders.vue.compilerOptions.modules)
 *
 * @param customIcons Object with custom icon definition
 */
export function getIconInjector(
  customIcons: { [name: string]: string } = {}
): any {
  function iconParser(icon?: string | null): string | undefined {
    if (!icon) {
      return;
    }

    const mdiIcon = mdiIcons[icon];
    const customIcon = customIcons[icon];

    const svg = customIcon || mdiIcon || null;

    if (svg) {
      return svg;
    }
  }

  function iconParserAttributes(attrValue: string): string {
    Object.keys(mdiIcons).forEach(icon => {
      attrValue = attrValue.split(icon).join(mdiIcons[icon]);
    });

    Object.keys(customIcons).forEach(icon => {
      attrValue = attrValue.split(icon).join(customIcons[icon]);
    });

    return attrValue;
  }

  return {
    // Handle <v-icon>mdi-*</v-icon>
    transformNode(el: ASTElement) {
      if (el.tag === "v-icon") {
        const icon: string | undefined = el.children[0].text;
        if (!icon) {
          return;
        }
        const svg = iconParser(icon);
        if (svg) {
          el.children[0].text = svg;
          return el;
        }
      }
    },

    // Props handler
    preTransformNode(el: ASTElement) {
      if (iconMaps[el.tag]) {
        let changes = false;
        const iconAttrs = iconMaps[el.tag];
        iconAttrs.forEach(attr => {
          // Handle for example <v-text-field append-icon="mdi-*"/>
          if (el.attrsMap[attr]) {
            const value = el.attrsMap[attr];
            const newValue = iconParserAttributes(value);

            el.attrsMap[attr] = newValue;
            el.attrsList.forEach(at => {
              if (at.name === attr) {
                at.value = newValue;
              }
            });
            changes = true;
          }

          // Handle for example <v-text-field :append-icon="'mdi-*'"/>
          if (el.attrsMap[":" + attr]) {
            const value = el.attrsMap[":" + attr];
            const newValue = iconParserAttributes(value);

            el.attrsMap[":" + attr] = newValue;
            el.attrsList.forEach(at => {
              if (at.name === ":" + attr) {
                at.value = newValue;
              }
            });

            changes = true;
          }

          // Handle for example <v-text-field v-bind:append-icon="'mdi-*'"/>
          if (el.attrsMap["v-bind:" + attr]) {
            const value = el.attrsMap["v-bind:" + attr];
            const newValue = iconParserAttributes(value);

            el.attrsMap["v-bind:" + attr] = newValue;
            el.attrsList.forEach(at => {
              if (at.name === "v-bind:" + attr) {
                at.value = newValue;
              }
            });

            changes = true;
          }
        });
        if (changes) {
          return el;
        }
      }
    }
  };
}
