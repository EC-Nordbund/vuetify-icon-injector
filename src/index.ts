import { ASTElement } from "vue-template-compiler";
import * as mdi from "@mdi/js";
import { camelToKebabCase } from "./camelToKebabCase";

// Vuetify elements with icon Props
const iconMaps: { [tag: string]: Array<string> } = {
  "v-alert": ["icon"],
  "v-autocomplete": [
    "append-icon",
    "append-outer-icon",
    "clear-icon",
    "prepend-icon",
    "prepend-inner-icon"
  ],
  "v-badge": ["icon"],
  "v-banner": ["icon", "icon-color"],
  "v-btn": ["icon"],
  "v-carousel": ["delimiter-icon", "next-icon", "prev-icon"],
  "v-checkbox": [
    "append-icon",
    "indeterminate-icon",
    "off-icon",
    "on-icon",
    "prepend-icon"
  ],
  "v-simple-checkbox": ["indeterminate-icon", "off-icon", "on-icon"],
  "v-chip": ["close-icon", "filter-icon"],
  "v-chip-group": ["next-icon", "prev-icon"],
  "v-combobox": [
    "append-icon",
    "append-outer-icon",
    "clear-icon",
    "prepend-icon",
    "prepend-inner-icon"
  ],
  "v-data-footer": ["first-icon", "last-icon", "next-icon", "prev-icon"],
  "v-data-table": ["expand-icon"],
  "v-date-picker": ["next-icon", "prev-icon", "year-icon"],
  "v-date-picker-title": ["year-icon"],
  "v-date-picker-header": ["next-icon", "prev-icon"],
  "v-expansion-panel-header": ["disable-icon-rotate", "expand-icon"],
  "v-file-input": [
    "append-icon",
    "append-outer-icon",
    "clear-icon",
    "prepend-icon",
    "prepend-inner-icon"
  ],
  "v-input": ["append-icon", "prepend-icon"],
  "v-list-group": ["append-icon", "prepend-icon"],
  "v-overflow-btn": [
    "append-icon",
    "append-outer-icon",
    "clear-icon",
    "prepend-icon",
    "prepend-inner-icon"
  ],
  "v-pagination": ["next-icon", "prev-icon"],
  "v-radio-group": ["append-icon", "prepend-icon"],
  "v-radio": ["off-icon", "on-icon"],
  "v-range-slider": ["append-icon", "prepend-icon"],
  "v-rating": ["empty-icon", "full-icon", "half-icon"],
  "v-select": [
    "append-icon",
    "append-outer-icon",
    "clear-icon",
    "prepend-icon",
    "prepend-inner-icon"
  ],
  "v-slider": ["append-icon", "prepend-icon"],
  "v-slide-group": ["next-icon", "prev-icon"],
  "v-stepper-step": ["complete-icon", "edit-icon", "error-icon"],
  "v-switch": ["append-icon", "prepend-icon"],
  "v-tabs": ["icons-and-text", "next-icon", "prev-icon"],
  "v-tabs-items": ["next-icon", "prev-icon"],
  "v-textarea": [
    "append-icon",
    "append-outer-icon",
    "clear-icon",
    "prepend-icon",
    "prepend-inner-icon"
  ],
  "v-text-field": [
    "append-icon",
    "append-outer-icon",
    "clear-icon",
    "prepend-icon",
    "prepend-inner-icon"
  ],
  "v-timeline-item": ["icon", "icon-color"],
  "v-treeview": [
    "expand-icon",
    "indeterminate-icon",
    "loading-icon",
    "off-icon",
    "on-icon"
  ],
  "v-treeview-node": [
    "expand-icon",
    "indeterminate-icon",
    "loading-icon",
    "off-icon",
    "on-icon"
  ],
  "v-window": ["next-icon", "prev-icon"]
};

const mdiIcons: { [name: string]: string } = {};

Object.keys(mdi)
  // Sort keys to avoid false replacements
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
  customIcons: { [name: string]: string } = {},
  customIconMaps: { [tag: string]: Array<string> } = {}
): any {
  // Handle custom icon Maps
  if (customIconMaps !== {}) {
    Object.keys(customIconMaps).forEach(cmp => {
      if (iconMaps[cmp]) {
        iconMaps[cmp] = [...iconMaps[cmp], ...customIconMaps[cmp]];
      } else {
        iconMaps[cmp] = customIconMaps[cmp];
      }
    });
  }

  function iconParser(attrValue: string): string {
    // Handle MDI
    Object.keys(mdiIcons).forEach(icon => {
      attrValue = attrValue.split(icon).join(mdiIcons[icon]);
    });

    // Handle Custom Icons
    Object.keys(customIcons).forEach(icon => {
      attrValue = attrValue.split(icon).join(customIcons[icon]);
    });

    return attrValue;
  }

  return {
    // Handle <v-icon>mdi-*</v-icon>
    transformNode(el: ASTElement) {
      // Check for correct Tag
      if (el.tag === "v-icon" && el.children[0].text) {
        // Get Values
        const value: string = el.children[0].text;
        const newValue = iconParser(value);

        // Replace
        el.children[0].text = newValue;
        return el;
      }
    },

    // Props handler
    preTransformNode(el: ASTElement) {
      let changes = false;

      function handleAttribute(attrName: string) {
        // Check if Attribute exists
        if (el.attrsMap[attrName]) {
          // Get values
          const value = el.attrsMap[attrName];
          const newValue = iconParser(value);

          // Replace
          el.attrsMap[attrName] = newValue;
          el.attrsList.forEach(at => {
            if (at.name === attrName) {
              at.value = newValue;
            }
          });

          // Return replacement Node
          changes = true;
        }
      }

      if (iconMaps[el.tag]) {
        iconMaps[el.tag].forEach(attr => {
          // Handle for example <v-text-field append-icon="mdi-*"/>
          handleAttribute(attr);

          // Handle for example <v-text-field :append-icon="'mdi-*'"/>
          handleAttribute(":" + attr);

          // Handle for example <v-text-field v-bind:append-icon="'mdi-*'"/>
          handleAttribute("v-bind:" + attr);
        });
      }

      if (el.tag === "v-icon") {
        // Handle for example <v-icon v-text="'mdi-*'"></v-icon>
        handleAttribute("v-text");
        // Handle for example <v-icon v-html="'mdi-*'"></v-icon>
        handleAttribute("v-html");
      }

      // If changed return replacement
      if (changes) {
        return el;
      }
    }
  };
}
