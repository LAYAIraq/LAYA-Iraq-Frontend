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

      <div class="row" v-for="(step,i) in content" :key="'step-'+i">

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
          <button v-if="i < content.length-1"
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
import vis from "vis-network"
import { mapGetters } from "vuex"
import * as i18n from "@/i18n/course-nav-edit"

export default {
  name: "edit-course-nav-view",
  created() {
    //create deep copy of store object to manipulate in vue instance
    let preData = JSON.parse(JSON.stringify(this.hasContent))
    this.content = preData
  },
  mounted() {
    if(!this.formInvalid)
      this.renderNavGraph()
  },
  data() {
    return {
      graph: null,
      content: []
    }
  },
  props: {
    onnavupdate: Function
  },
  computed: {
    ...mapGetters(["hasContent"]),
    formInvalid: function() {
      return this.content.reduce((res, val) => !val.nextStep || res, false)
    },
    navGraphId() {
      return "nav-graph"
    },
    i18n() {
      return i18n[this.$store.state.profile.lang]
    }
  },
  methods: {

    swapUp(i) {
      [this.content[i-1], this.content[i]] =
        [this.content[i], this.content[i-1]]
      this.$forceUpdate()
    },

    swapDown(i) {
      [this.content[i], this.content[i+1]] =
        [this.content[i+1], this.content[i]]
      this.$forceUpdate()
    },

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

    renderNavGraph() {
      const self = this

      let _nodes = self.content.map(
        (c,i) => ({id: i+1, label: `${i+1}. ${self.typeName(c.name)}`})
      )

      let _edges = []
      for(let i=0; i<self.content.length; ++i) {
        let c = self.content[i]
        if(!c.nextStep) continue
        let steps = c.nextStep.split(",").map(s => parseInt(s))
        for(let s=0; s<steps.length; ++s) {
          _edges.push({from: i+1, to: steps[s]})
        }
      }

      const graph = new vis.Network(document.getElementById(self.navGraphId), {
        nodes: new vis.DataSet(_nodes),
        edges: new vis.DataSet(_edges)
      }, {
        edges: {
          arrows: "to"
        },
        nodes: {
          shape: "box"
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
        }
        /*
        layout: {
          hierarchical: {
            enabled: true,
            direction: "LR"
          }
        }
        */
      })
      graph.selectNodes([1])
    },

    save() {
      this.$store.commit("updateCourseNav", this.content)
      this.$store.dispatch("storeCourse")
      this.$emit("saved")
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
