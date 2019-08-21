/** make global $laya propety avaible to typescript.
 * source: https://vuejs.org/v2/guide/typescript.html#Augmenting-Types-for-Use-with-Plugins
 */
// 1. Make sure to import 'vue' before declaring augmented types
import Vue from "vue";
import { Laya } from "./laya";

// 2. Specify a file with the types you want to augment
//    Vue has the constructor type in types/vue.d.ts
declare module "vue/types/vue" {
  // 3. Declare augmentation for Vue
  interface Vue {
    $laya: Laya;
  }
}

declare module "vue/types/vue" {
  // Global properties can be declared
  // on the `VueConstructor` interface
  interface VueConstructor {
    $laya: Laya;
  }
}
