<template>
    <div class="row mb-2">
        <div class="col">

            <b-dropdown id="new-content-dd"
                        variant="primary"
                        class="w-100"
                        dropright>
            <template slot="button-content">
                <i class="fas fa-plus"></i> {{ i18n.authTools.newContent }}
            </template>

            <b-dropdown-header>{{ i18n.authTools.newContentBlock }}</b-dropdown-header>
                <b-dropdown-item v-for="block in $laya.lb"
                                :key="block.id"
                                :to="'/courses/'+name+'/'+nextId+'/new/'+block.id">
                    {{ getLocale(block) }} 
                </b-dropdown-item>

                <b-dropdown-divider></b-dropdown-divider>

                <b-dropdown-header>{{ i18n.authTools.newContentAssmnt }}</b-dropdown-header>
                <b-dropdown-item v-for="ass in $laya.la"
                                :key="ass.id"
                                :to="'/courses/'+name+'/'+nextId+'/new/'+ass.id">
                    {{ getLocale(ass) }}
                </b-dropdown-item>
            </b-dropdown>

        </div>

        <div class="col text-dark">
            {{ i18n.authTools.newContentTip }}
            <b>{{nextId}}</b>.
        </div>
    </div>
</template>

<script>
import { BDropdown, BDropdownItem, BDropdownDivider, BDropdownHeader } from "bootstrap-vue"

export default {
    name: "course-new-block",
    props: {
        i18n: Object,
        name: String,
        step: String,
        nextId: Number
    },
    data() {
        return {

        }
    },
    plugins() {
      const la = this.$laya.la
      const lb = this.$laya.lb
      let lalb = [{value: null, text: this.i18n.changeTypeText, disabled: true}]
      let lang = this.$store.state.profile.lang
      for(const id in lb) {
        if (lb[id].i18n.hasOwnProperty(lang))
          lalb.push({value: id, text: lb[id].i18n[lang]})
        else lalb.push({value: id, text: lb[id].i18n.de})
      }
      for(const id in la)
        if (la[id].i18n.hasOwnProperty(lang))
          lalb.push({value: id, text: la[id].i18n[lang].edit.title})
        else lalb.push({value: id, text: la[id].i18n.de})
      return lalb
    },
    methods: {
        getLocale(comp) {
            let lang = this.$store.state.profile.lang
            if(comp.i18n.hasOwnProperty(lang)) return comp.i18n[lang].edit.title
            else return comp.i18n.de.edit.title
        }
    }
}
</script>