/** Filename: content-types.ts
* Use: Collect methods that use content block properties
* Creator: cmc
* Date: May 22, 2021
* Dependencies: none 
*/

export default {
  methods: {
    /**
      * Function typeName: returns name of content block in locale
      * 
      * Author: core
      * 
      * Last Updated: May 6, 2021
      * 
      * @param {string} compName name of content block
      */
    typeName(compName: string) {     
      let comps = { ...this.$laya.la, ...this.$laya.lb }
      for(let comp in comps) {
        if (comps[comp].id === compName) {
          return this.i18n[comps[comp].name + '.name']
        }
      }
      return 'FAIL'
    }
  }
}
