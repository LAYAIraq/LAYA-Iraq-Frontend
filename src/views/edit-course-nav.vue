<!--
Filename edit-course-nav.vue 
Use: Edit paths through a course
Creator: core
Date: unknown
Dependencies: 
  vis-network,
  vuex,
  @/i18n/course-nav-edit
-->

<template>
  <div class="edit-course-nav-view">

    <!-- guide -->
    <div class="container guide">
      <div class="row title">
        <div class="col">

          <h4>{{ i18n.title }}</h4>
          <p v-html="i18n.text.p1">
          </p>
          <p v-html="i18n.text.p2">
          </p>
          <p v-html="i18n.text.p3">
          </p>

        </div>
      </div>
    </div>

    <!-- table -->
    <div class="container table">
      <div class="row">

        <div class="col-2">
          <b>{{ i18n.table.contentNo }}</b>
        </div>

        <div class="col">
          <b>{{ i18n.table.contentType }}</b>
        </div>

        <div class="col-3">
          <b>{{ i18n.table.succContent }}</b>
        </div>

        <div class="col-2">
          <b>{{ i18n.table.swap }}</b>
        </div>

      </div>

      <div class="row" v-for="(step,i) in courseContent" :key="'step-'+i">

        <div class="col-2">
          <b>{{ i+1 }}</b>
        </div>
        
        <div class="col">
          {{ typeName(step.name) }}
        </div>

        <div class="col-3">
          <input class="form-control"
                 :class="{'is-invalid': !step.nextStep}"
                 type="text"
                 v-model="step.nextStep"
                 :placeholder="i18n.table.placeholder">
        </div>

        <div class="col-2">
          <!-- swap up -->
          <button v-if="i > 0"
                  type="button"
                  class="btn btn-primary btn-sm"
                  @click="swapUp(i)">
            <i class="fas fa-level-up-alt"></i>
          </button>
          <!-- swap down -->
          <button v-if="i < courseContent.length-1"
                  type="button"
                  class="btn btn-primary btn-sm float-right"
                  @click="swapDown(i)">
            <i class="fas fa-level-down-alt"></i>
          </button>
        </div>

      </div>

      <div class="row">

        <!-- graph preview -->
        <div class="col">
          <button type="button"
                  class="btn btn-secondary"
                  :disabled="formInvalid"
                  @click="renderNavGraph">
            <i class="fas fa-project-diagram"></i>
            {{ i18n.table.renewGraph }}
          </button>
        </div>

        <!-- store -->
        <div class="col text-right">
          <button type="button"
                  class="btn btn-primary"
                  :disabled="formInvalid"
                  @click="save">
            <span v-if="formInvalid">
              <i class="fas fa-exclamation-triangle"></i> {{ i18n.table.missingInfo }}
            </span>
            <span v-else><i class="fas fa-check"></i> {{ i18n.table.save }}</span>
          </button>
        </div>

      </div>

    </div>

    <!-- graph -->
    <div class="container">
      <div class="row">
        <div class="col">
          {{ i18n.graph }}
          <span class="text-muted">
            {{ i18n.graphTip }}
          </span>
          <div :id="navGraphId" class="nav-graph"></div>
        </div>
      </div>
    </div>


  </div>
</template>

<script>
import vis from 'vis-network'
import { mapGetters } from 'vuex'
import * as i18n from '@/i18n/course-nav-edit'

export default {
  name: 'edit-course-nav-view',
  created() {
    //create deep copy of store object to manipulate in vue instance
    let preData = JSON.parse(JSON.stringify(this.content))
    this.courseContent = preData
  },
  mounted() {
    if(!this.formInvalid)
      this.renderNavGraph()
  },
  data() {
    return {
      graph: null,
      courseContent: []
    }
  },
  props: {
    onnavupdate: Function
  },
  computed: {
    ...mapGetters(['content', 'profileLang']),

    /**
     * formInvalid: checks if all contents have nextStep set
     * 
     * Author: core
     * 
     * Last Updated: January 20, 2021
     */
    formInvalid() {
      return this.courseContent.reduce((res, val) => !val.nextStep || res, false)
    },

    /**
     * navGraphId: returns 'nav-graph' as identifier for html element
     */
    navGraphId() {
      return 'nav-graph'
    },

    /**
     * i18n: Load translation files depending on user language
     * 
     * Author: cmc
     * 
     * Last updated: March 21, 2021
     * 
     */
    i18n() {
      return i18n[this.profileLang]
    }
  },
  methods: {

    /**
     * Function swapUp: swap element with the one above
     * 
     * Author: core
     * 
     * Last Updated: January 20, 2021
     * 
     * @param {number} i index of element to swap up
     */
    swapUp(i) {
      [this.courseContent[i-1], this.courseContent[i]] =
        [this.courseContent[i], this.courseContent[i-1]]
      this.$forceUpdate()
    },

    /**
     * Function swapDown: swap element with the one below
     * 
     * Author: core
     * 
     * Last Updated: January 20, 2021
     * 
     * @param {number} i index of element to swap down
     */
    swapDown(i) {
      [this.courseContent[i], this.courseContent[i+1]] =
        [this.courseContent[i+1], this.courseContent[i]]
      this.$forceUpdate()
    },

    /**
     * Function typeName: returns name of content block in locale,
     *  de if locale not available
     * 
     * Author: core
     * 
     * Last Updated: January 20, 2021
     * 
     * @param {string} compName name of content block
     */
    typeName(compName) {
      let lang = this.$store.state.profile.lang
      let comps = {...this.$laya.la, ...this.$laya.lb}
      if (comps[compName].i18n.hasOwnProperty(lang)) {
        return comps[compName].i18n[lang].name
      }
        
      else {
        return comps[compName].i18n.de.name
      }
    },

    /**
     * Function renderNavGraph: render graph for course path
     * 
     * Author: core
     * 
     * Last Updated: January 20, 2021
     */
    renderNavGraph() {
      const self = this

      let _nodes = self.courseContent.map(
        (c,i) => ({id: i+1, label: `${i+1}. ${self.typeName(c.name)}`})
      )

      let _edges = []
      for(let i=0; i<self.courseContent.length; ++i) {
        let c = self.courseContent[i]
        if(!c.nextStep) continue
        let steps = c.nextStep.split(',').map(s => parseInt(s))
        for(let s=0; s<steps.length; ++s) {
          _edges.push({from: i+1, to: steps[s]})
        }
      }

      const graph = new vis.Network(document.getElementById(self.navGraphId), {
        nodes: new vis.DataSet(_nodes),
        edges: new vis.DataSet(_edges)
      }, {
        edges: {
          arrows: 'to'
        },
        nodes: {
          shape: 'box'
        },
        physics: {
          enabled: true,
          barnesHut: {
            avoidOverlap: 0.3,
            damping: 1
          }
        },
        interaction: {
          dragNodes: false,
          selectable: false,
        },
        /*
        layout: {
          hierarchical: {
            enabled: true,
            direction: 'LR'
          }
        }
        */
      })
      graph.selectNodes([1])
    },

    /**
     * Function save: save changes in store and db
     * 
     * Author: core
     * 
     * Last Updated: January 20, 2021
     */
    save() {
      this.$store.commit('updateCourseNav', this.courseContent)
      this.$store.dispatch('storeCourse')
      this.$emit('saved')
    }
  }
}
</script>

<style scoped>
p {
  text-indent: 0.5rem;
}

.table .row {
  padding-top: 1rem;
  padding-bottom: 1rem;
}

.table .row:first-child {
  border-bottom: 2px solid black;
}
.table .row:nth-child(odd) {
  background-color: #89b1dd;
}
.table .row:last-child {
  border-top: 2px solid black;
}

.nav-graph {
  height: 20rem;
  border: 1px solid grey;
}
</style>
