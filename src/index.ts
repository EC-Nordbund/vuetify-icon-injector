import { ASTElement } from "vue-template-compiler";
import * as mdi from "@mdi/js";
import { camelToKebabCase } from "./camelToKebabCase";

// TODO: extend list
const iconMaps: { [tag: string]: Array<string> } = {
  "v-text-field": ["append-icon", "append-outer-icon"]
};

const mdiIcons: { [name: string]: string } = {};

for (const key in mdi) {
  if (mdi.hasOwnProperty(key)) {
    // @ts-ignore
    const icon = mdi[key];

    mdiIcons[camelToKebabCase(key)] = icon;
  }
}

const conditionRegex = /.*?.*:.*/;
const stringTyp1 = /'.*'/;
const stringTyp2 = /".*"/;
const stringTyp3 = /`.*`/;
const allowedChars = /[a-zA-Z0-9\-'"`?:]/;
const otherValues = /(null|undefined){1}/;

/**
 * Returns a module to inject into vue loader config at compilerOptions.modules (in Nuxt it is build.loaders.vue.compilerOptions.modules)
 *
 * @param customIcons Object with custom icon definition
 * @param customAttrHandler Handler for bindings that are not just condition ? then : else whre then and else are strings ('mdi-*') or null or undefined
 * @param onlyCustomHanlder Use Handler always not just when normal handler not works
 */
export function getIconInjector(
  customIcons: { [name: string]: string } = {},
  customAttrHandler: (attr: string) => null | string = () => null,
  onlyCustomHanlder: boolean = false
): any {
  function stringParser(attrValue: string): string | null {
    return `'${iconParser(attrValue.substring(1, attrValue.length - 2))}'`;
  }

  function conditionParser(attrValue: string): string | null {
    if (
      attrValue.split("?").length === 1 &&
      attrValue.split(":").length === 1
    ) {
      const [[question], [then, sonst]] = attrValue
        .split("?")
        .map(v => v.split(":"));

      return `${question}?${combinedParser(then)}:${combinedParser(sonst)}`;
    } else {
      return null;
    }
  }

  function combinedParser(attrValue: string): string | null {
    attrValue = attrValue.trim();

    if (
      stringTyp1.test(attrValue) ||
      stringTyp2.test(attrValue) ||
      stringTyp3.test(attrValue)
    ) {
      return stringParser(attrValue);
    }

    if (conditionRegex.test(attrValue)) {
      return conditionParser(attrValue);
    }

    if (otherValues.test(attrValue)) {
      return attrValue;
    }

    return null;
  }

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

  function handleDynamicIcon(
    el: ASTElement,
    attr: string
  ): ASTElement | undefined {
    if (el.attrsMap[attr]) {
      const value = el.attrsMap[":" + attr];
      const newValue = simpleJSIconParser(value);

      if (newValue) {
        console.log("changed", value, newValue);
        el.attrsMap[attr] = newValue;
        el.attrsList.forEach(at => {
          if (at.name === attr) {
            at.value = newValue;
          }
        });

        return el;
      }
    }

    return undefined;
  }

  function simpleJSIconParser(attrValue: string): string | null {
    if (onlyCustomHanlder) {
      return customAttrHandler(attrValue);
    }

    for (let i = 0; i < attrValue.length; i++) {
      if (!allowedChars.test(attrValue[i])) {
        return customAttrHandler(attrValue);
      }
    }

    const parsed = combinedParser(attrValue);

    if (parsed === null) {
      return customAttrHandler(attrValue);
    } else {
      return parsed;
    }
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

    preTransformNode(el: ASTElement) {
      if (iconMaps[el.tag]) {
        let changes = false;
        const iconAttrs = iconMaps[el.tag];
        iconAttrs.forEach(attr => {
          // Handle for example <v-text-field append-icon="mdi-*"/>
          if (el.attrsMap[attr]) {
            const svg = iconParser(el.attrsMap[attr]);
            el.attrsMap[attr] = svg;
            el.attrsList.forEach(at => {
              if (at.name === attr) {
                at.value = svg;
              }
            });
            changes = true;
          }

          // Handle for example <v-text-field :append-icon="'mdi-*'"/>
          const dynamicVariant1 = handleDynamicIcon(el, ":" + attr);

          if (dynamicVariant1) {
            changes = true;
            el = dynamicVariant1;
          }

          // Handle for example <v-text-field v-bind:append-icon="'mdi-*'"/>
          // TODO: Check if needed.
          const dynamicVariant2 = handleDynamicIcon(el, "v-bind:" + attr);

          if (dynamicVariant2) {
            changes = true;
            el = dynamicVariant2;
          }
        });
        if (changes) {
          return el;
        }
      }
    }
  };
}
