<template>
  <div class="edit-course-nav-view">

    <!-- guide -->
    <div class="container guide">
      <div class="row title">
        <div class="col">

          <h4>Inhaltsliste</h4>
          <p>
            In der unten stehenden Tabelle siehst Du die von Dir erstellten
            Inhalte. Du musst <u>jedem</u> Inhalt ( also jeder Zeile )
            einen oder mehrere Folge-Inhalte zuordnen. Schreibe diese
            Folge-Inhalte, ersetzt durch ihre Nummer ( siehe erste Spalte ),
            in das Textfeld. So wird Reihenfolge der Anzeige der erstellten
            Inhalte festgelegt.
          </p>
          <p>
            Wenn Du z.B. dem <b>1</b>. Inhalt den <b>4</b>. folgen lassen
            willst, schreibst Du in die <b>1</b>. Zeile, dritte Spalte eine
            <b>4</b>
          </p>
          <p>
            Beachte das Dialoge normalerweise zu verschiedenen Inhalten,
            abhängig von der gewählten Antwort, führen. Schreibe in diesem Fall
            die Nummern (plural) dieser Folge-Inhalte in Reihenfolge der Dialog-Antworten
            durch Kommas getrennt in das Textfeld:
            <br> z.B. bedeutet <b class="bg-light rounded py-1 px-2">3, 4</b>
            das die erste Antwort zum <b>3</b>. Inhalt und die zweite
            Antwort zum <b>4</b>. Inhalt führt.
          </p>

        </div>
      </div>
    </div>

    <!-- table -->
    <div class="container table">
      <div class="row">

        <div class="col-2">
          <b>Inhalt-Nr.</b>
        </div>

        <div class="col">
          <b>Art des Inhalts</b>
        </div>

        <div class="col-4">
          <b>Folge-Inhalt-Nr.</b>
        </div>

      </div>

      <div class="row" v-for="(step,i) in content" :key="'step-'+i">

        <div class="col-2">
          <b>{{ i+1 }}</b>
        </div>
        
        <div class="col">
          {{ typeName(step.name) }}
        </div>

        <div class="col-4">
          <input class="form-control"
                 :class="{'is-invalid': !step.nextStep}"
                 type="text"
                 v-model="step.nextStep"
                 placeholder="z.B. 1,2">
        </div>

      </div>

      <div class="row">

        <!-- graph preview -->
        <div class="col">
          <button type="button"
                  class="btn btn-secondary"
                  :disabled="formInvalid"
                  @click="renderNavGraph">
            <i class="fas fa-project-diagram"></i> Grafische Vorschau erneuen
          </button>
        </div>

        <!-- store -->
        <div class="col text-right">
          <button type="button"
                  class="btn btn-primary"
                  :disabled="formInvalid"
                  @click="save">
            <span v-if="formInvalid">
              <i class="fas fa-exclamation-triangle"></i> Bitte fülle alle Felder aus!
            </span>
            <span v-else><i class="fas fa-check"></i> Speichern</span>
          </button>
        </div>

      </div>

    </div>

    <!-- graph -->
    <div class="container">
      <div class="row">
        <div class="col">
          Grafische Vorschau:
          <div :id="navGraphId" class="nav-graph"></div>
        </div>
      </div>
    </div>


  </div>
</template>

<script>
import vis from "vis-network"
export default {
  name: "edit-course-nav-view",
  created() {
    this.content = [...this.course.content]
  },
  mounted() {
    if(!this.formInvalid)
      this.renderNavGraph()
  },
  data() {
    return {
      graph: null,

      content: [{
        name: "",
        input: {},
      }]
    }
  },
  props: {
    course: Object,
    onnavupdate: Function
  },
  computed: {
    formInvalid: function() {
      return this.content.reduce((res, val) => !val.nextStep || res, false)
    },
    navGraphId() {
      return "nav-graph"
    }
  },
  methods: {

    typeName(compName) {
      return {...this.$laya.la, ...this.$laya.lb}[compName].i18n.de
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

      self.graph = new vis.Network(document.getElementById(self.navGraphId), {
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
            avoidOverlap: 0.5
          }
        },
        /*
        layout: {
          hierarchical: {
            enabled: true,
            direction: "LR"
          }
        }
        */
      })

    },

    save() {
      this.onnavupdate(this.content)
    }
  },
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
