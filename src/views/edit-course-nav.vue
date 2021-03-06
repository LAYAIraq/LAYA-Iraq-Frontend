<!--
Filename edit-course-nav.vue
Use: Edit paths through a course
Creator: core
Date: unknown
Dependencies:
  vis-network,
  vuex,
  @/mixins/locale.vue
-->

<template>
  <div class="edit-course-nav-view">
    <!-- guide -->
    <div class="container guide">
      <div class="row title">
        <div class="col">
          <h4>{{ y18n('courseNavEdit.title') }}</h4>
          <p>
            {{ y18n('courseNavEdit.text.p1') }}
          </p>
          <p>
            {{ y18n('courseNavEdit.text.p2') }}
          </p>
          <p>
            {{ y18n('courseNavEdit.text.p3') }}
          </p>
        </div>
      </div>
    </div>

    <!-- table -->
    <div class="container table">
      <div class="row">
        <div class="col-2">
          <b>{{ y18n('courseNavEdit.table.contentNo') }}</b>
        </div>

        <div class="col">
          <b>{{ y18n('courseNavEdit.table.contentType') }}</b>
        </div>

        <div class="col">
          <b>{{ y18n('title') }}</b>
        </div>

        <div class="col-3">
          <b>{{ y18n('courseNavEdit.table.succContent') }}</b>
        </div>

        <div class="col-2">
          <b>{{ y18n('courseNavEdit.table.swap') }}</b>
        </div>
      </div>

      <div
        v-for="(step,i) in courseContent"
        :key="'step-'+i"
        class="row"
      >
        <div class="col-2">
          <b>{{ i+1 }}</b>
        </div>

        <div class="col">
          {{ typeName(step.name) }}
        </div>

        <div class="col">
          {{ renderTitle(step) }}
        </div>

        <div class="col-3">
          <input
            v-model="step.nextStep"
            class="form-control"
            :class="{'is-invalid': !step.nextStep}"
            type="text"
            :placeholder="y18n('courseNavEdit.table.placeholder')"
          >
        </div>

        <div class="col-2">
          <!-- swap up -->
          <button
            v-if="i > 0"
            type="button"
            class="btn btn-primary btn-sm"
            @click="swapUp(i)"
          >
            <i class="fas fa-level-up-alt"></i>
          </button>
          <!-- swap down -->
          <button
            v-if="i < courseContent.length-1"
            type="button"
            class="btn btn-primary btn-sm float-right"
            @click="swapDown(i)"
          >
            <i class="fas fa-level-down-alt"></i>
          </button>
        </div>
      </div>

      <div class="row">
        <!-- graph preview -->
        <div class="col">
          <button
            type="button"
            class="btn btn-secondary"
            :disabled="formInvalid"
            @click="renderNavGraph"
          >
            <i class="fas fa-project-diagram"></i>
            {{ y18n('courseNavEdit.table.renewGraph') }}
          </button>
        </div>

        <!-- store -->
        <div class="col text-right">
          <button
            type="button"
            class="btn btn-primary"
            :disabled="formInvalid"
            @click="save"
          >
            <span v-if="formInvalid">
              <i class="fas fa-exclamation-triangle"></i>
              {{ y18n('courseNavEdit.table.missingInfo') }}
            </span>
            <span v-else>
              <i class="fas fa-check"></i>
              {{ y18n('save') }}
            </span>
          </button>
        </div>
      </div>
    </div>

    <!-- graph -->
    <div class="container">
      <div class="row">
        <div class="col">
          {{ y18n('courseNavEdit.graph') }}
          <span class="text-muted">
            {{ y18n('courseNavEdit.graphTip') }}
          </span>
          <div
            :id="navGraphId"
            class="nav-graph"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Network } from 'vis-network/peer'
import { DataSet } from 'vis-data/peer'
import { mapGetters } from 'vuex'
import { locale } from '@/mixins'

export default {
  name: 'EditCourseNavView',

  mixins: [
    locale
  ],

  // props: {
  //   onnavupdate: {
  //     type: Function,
  //     default () {
  //       return () => []
  //     }
  //   }
  // },

  data () {
    return {
      graph: null,
      courseContent: []
    }
  },

  computed: {
    ...mapGetters(['content']),

    /**
     * formInvalid: checks if all contents have nextStep set
     *
     * Author: core
     *
     * Last Updated: January 20, 2021
     */
    formInvalid () {
      return this.courseContent.reduce((res, val) => !val.nextStep || res, false)
    },

    /**
     * navGraphId: returns 'nav-graph' as identifier for html element
     */
    navGraphId () {
      return 'nav-graph'
    }
  },

  created () {
    // create deep copy of store object to manipulate in vue instance
    this.courseContent = JSON.parse(JSON.stringify(this.content))
  },

  mounted () {
    if (!this.formInvalid) { this.renderNavGraph() }
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
    swapUp (i) {
      [this.courseContent[i - 1], this.courseContent[i]] =
        [this.courseContent[i], this.courseContent[i - 1]]
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
    swapDown (i) {
      [this.courseContent[i], this.courseContent[i + 1]] =
        [this.courseContent[i + 1], this.courseContent[i]]
      this.$forceUpdate()
    },

    /**
     * Function typeName: returns name of content block in locale
     *
     * Author: core
     *
     * Last Updated: May 6, 2021
     *
     * @param {string} compName name of content block
     */
    typeName (compName) {
      const comps = { ...this.$laya.la, ...this.$laya.lb }
      for (const comp in comps) {
        if (comps[comp].id === compName) {
          return this.i18n[comps[comp].name + '.name']
        }
      }
      return 'FAIL'
    },

    renderTitle (step) {
      return step.input.title ? step.input.title.text : 'No title set'
    },

    /**
     * Function renderNavGraph: render graph for course path
     * Author: core
     * Last Updated: August 3, 2021
     */
    renderNavGraph () {
      const self = this

      const _nodes = self.courseContent.map(
        (c, i) => ({ id: i + 1, label: `${i + 1}. ${self.typeName(c.name)}` })
      )

      const _edges = []
      for (let i = 0; i < self.courseContent.length; ++i) {
        const c = self.courseContent[i]
        if (!c.nextStep) continue
        const steps = c.nextStep.split(',').map(s => parseInt(s))
        for (let s = 0; s < steps.length; ++s) {
          _edges.push({ from: i + 1, to: steps[s] })
        }
      }

      const graph = new Network(document.getElementById(self.navGraphId), {
        nodes: new DataSet(_nodes),
        edges: new DataSet(_edges)
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
          dragNodes: true,
          selectable: true
        }
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
     * Author: core
     * Last Updated: January 20, 2021
     */
    save () {
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
