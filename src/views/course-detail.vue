<template>
  <div v-if="!note.busy" class="course-detail-view">

    <!-- course header -->
    <div class="container-fluid bg-dark">
      <div class="row">
        <div class="col">

          <div style="height: 3rem"></div>
          <h1 class="text-center text-light py-5"><b>{{ course.name }}</b></h1>
          <h6 class="text-center text-light">
            <!-- <span>{{ course.category }}</span> -->
            <!--
              <span> / </span>
              <span>{{ course.author.username }}</span>
            -->
          </h6>
          <div style="height: 2rem"></div>

        </div>
      </div>
    </div>

    <!-- content -->
    <div class="container">
      <div class="row">
        <div class="col">

          <!-- wayin august kickoff
          <div style="height: 3rem"></div>
          <laya-stepper :components="wayin_data">
          </laya-stepper>
          -->

        </div>
      </div>
    </div>

    <div style="height: 4rem"></div>

    <!-- author view -->
    <div class="ly-bg-author py-4">
      <div class="container">
        <div class="row">
          <div class="col">
            <router-view></router-view>
          </div>
        </div>
        <div class="row" v-if="isAuthor && $route.name === 'course-detail-view'">
          <div class="col">

            <b-button variant="primary" block
                      :to="{name: 'new-learning-block', params: {id: course.name}}">
              <i class="fas fa-puzzle-piece"></i> Lernbaustein hinzufügen
            </b-button>

            <b-button variant="primary" block
                      :to="{name: 'new-learning-assessment', params: {id: course.name}}">
              <i class="fas fa-pencil-alt"></i> Lernüberprüfung hinzufügen
            </b-button>

          </div>
          <div class="col">

            <b-button variant="primary" block
                      :to="{name: 'new-learning-assessment', params: {id: course.name}}">
              <i class="fas fa-project-diagram"></i> Kursführung bearbeiten
            </b-button>

          </div>
        </div> <!-- row -->
      </div> <!-- container -->
    </div>

  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";

import http from "axios";
import * as i18n from "../i18n/login";
import utils from "../misc/utils.js";
import backend from "@/backend-url"

// top level is stepper input
const api = (file) => `${backend}/storage/Schwerhörigkeit/download/${file}`
const video_player = "laya-plyr-vimeo"

const wayin_data = [
  { // ZEILE 1
    name: video_player,
    input: {id: 348715617},
    nextStep: [2]
  },
  /* ZEILE 2 */
  { // ZEILE 3
    name: "laya-dialog",
    input: {
      question: "",
      answers: ["Berührt Frau Piplow am Arm", "Versucht irgendwie in das Blickfeld von Frau Piplow zu kommen"],
      bg: api("ex_bg.jpg")
    },
    nextStep: [3, 4]
  },
  { // ZEILE 4
    name: video_player,
    input: {id: 348715716}, // erschrocken
    nextStep: [5]
  },
  { // ZEILE 4
    name: video_player,
    input: {id: 348715769}, // ah, da ...
    nextStep: [5]
  },
  /* ZEILE 5 */
  { // ZEILE 6
    name: video_player,
    input: {id: 344444199},
    nextStep: [6]
  },
  { // ZEILE 7
    name: "laya-multiple-choice",
    input: {
      title: "Übung 1",
      task: "Was meinen Sie: Wie machen Sie eine schwerhörige Person auf sich aufmerksam ? Klicken Sie dafür alle Punkte an, die Ihrer Meinung nach passend sind:",
      taskAudio: api("ex1.mp3"),
      options: [
        "Am Arm berühren",
        "Versuchen ins Blickfeld zu gelangen",
        "Licht an und aus schalten",
        "Auf den Boden stampfen"
      ],
      solutions: [0,1,2,3],
      maxTries: 0,
    },
    nextStep: [7]
  },
  /* ZEILE 8 */
  { // ZEILE 9
    name: video_player,
    input: {id: 344444362},
    nextStep: [8]
  },
  { // ZEILE 10
    name: "laya-dialog",
    input: {
      question: "",
      answers: ["Gestaltung des Arbeitsplatzes", "Überspringen"],
      bg: api("ex_bg.jpg")
    },
    nextStep: [9, 11]
  },
  { // ZEILE 11
    name: video_player,
    input: {id: 344444616},
    nextStep: [10]
  },
  { // ZEILE 12
    name: "laya-quiz-drag-drop",
    input: {
      title: "Übung 2 - Gestaltung des Arbeitsplatzes",
      task: "Bei der Arbeitsplatzgestaltung kann einiges beachtet werden, damit das Arbeiten für Schwerhörige angenehmer wird. Was ist beispielsweise gut, was weniger gut ? Bitte ziehen Sie die Vorschläge in die richtige Spalte.",
      taskAudio: api("ex2.mp3"),
      categories: ["Gut", "Weniger Gut"],
      items: [
        {label: "Sitz zur Tür hin", category: 0},
        {label: "Akustikbilder", category: 0},
        {label: "Bei Kollegen stehen deren Monitore neben dem Gesicht", category: 0},
        {label: "Große Pflanzen auf dem Schreibtisch", category: 1},
        {label: "Radiomusik", category: 1},
        {label: "Insgesamt dunkler Raum", category: 1},
      ],
    },
    nextStep: [11]
  },
  /* ZEILE 13 */
  { // ZEILE 14
    name: video_player,
    input: {id: 344444722},
    nextStep: [12]
  },
  { // ZEILE 15
    name: "laya-dialog",
    input: {
      question: "",
      answers: ["Arten von Schwerhörigkeit", "Überspringen"],
      bg: api("ex_bg.jpg")
    },
    nextStep: [13, 15]
  },
  { // ZEILE 16
    name: video_player,
    input: {id: 344445325},
    nextStep: [14]
  },
  { // ZEILE 17
    name: "laya-quiz-relate",
    input: {
      title: "Übung 3 - Arten der Schwerhörigkeit",
      task: "Eine Schwerhörigkeit unterscheidet sich darin, welcher Bereich beim Ohr nicht mehr 100%ig funktioniert: Ob es Probleme im Außen- und Mittelohr oder im Innenohr gibt. Sie sehen unten zwei Ohren mit geschädigten Bereichen und ein gesundes Ohr. Ordnen Sie die 3 Hörbeispiele dem jeweils passenden Ohr zu.",
      taskAudio: api("ex3.mp3"),
      pairs: [
        {
          label: "",
          img: api("ex3_2.jpg"),
          audio: api("ex3_1.mp3"),
          relation: "Schallleitungsschwerhörigkeit / Probleme im Außen- und/oder Mittelohr"
        },
        {
          label: "",
          img: api("ex3_1.jpg"),
          audio: api("ex3_2.mp3"),
          relation: "Normales Hören"
        },
        {
          label: "",
          img: api("ex3_3.jpg"),
          audio: api("ex3_3.mp3"),
          relation: "Schallempfindungsschwerhörigkeit / Probleme im Innenohr"
        },
      ],
    },
    nextStep: [15]
  },
  /* ZEIL 18 */
  { // ZEILE 19
    name: video_player,
    input: {id: 344445398},
    nextStep: [16]
  },
  { // ZEILE 20
    name: "laya-dialog",
    input: {
      question: "",
      answers: ["Nein und ich möchte mehr darüber erfahren.", "Überspringen, denn ich kenne mich mit dem Thema aus."],
      bg: api("ex_bg.jpg")
    },
    nextStep: [17, 18]
  },
  /* ZEILE 21 */
  { // ZEILE 22
    name: "laya-quiz-relate",
    input: {
      title: "Übung 4 - technische Hilfsmittel",
      task: "Es gibt verschiedene technische Hilfsmittel. Diese entwickeln sich schnell weiter. Im Folgenden sehen Sie deshalb Hilfsmittel für verschiedene Situationen. Durch ein geändertes Verhalten kann dem schwerhörigen Kollegen oder der Kollegin schon sehr geholfen werden. Kennen Sie sich da aus ? Ordnen Sie das Bild der Funktion zu.",
      taskAudio: api("ex4.mp3"),
      pairs: [
        {
          label: "",
          img: api("ex4_1.jpg"),
          relation: "Hörgerät: Verstärkt den Schall"
        },
        {
          label: "",
          img: api("ex4_2.jpg"),
          relation: "Lichtsignal: Blinkt, wenn jemand ins Zimmer kommt"
        },
        {
          label: "",
          img: api("ex4_3.jpg"),
          relation: "FM-Anlage: Überträgt Tonsignale per Funk direkt vom Sprecher an das Hörgerät"
        },
      ],
    },
    nextStep: [18]
  },
  /* ZEILE 23 */
  { // ZEILE 24
    name: video_player,
    input: {id: 344445771},
    nextStep: [19]
  },
  { // ZEILE 25
    name: "laya-dialog",
    input: {
      question: "",
      answers: [
        "Häufig interne Meetings, deshalb möchte ich mehr erfahren.",
        "Fast keine Meetings, deshalb überspringen."
      ],
      bg: api("ex_bg.jpg")
    },
    nextStep: [20, 22]
  },
  { // ZEILE 26
    name: video_player,
    input: {id: 344445957},
    nextStep: [21]
  },
  { // ZEILE 27
    name: "laya-multiple-choice",
    input: {
      title: "Übung 5 - Kommunikation in Meetings",
      task: "In einem Meeting ist es für eine schwerhörige Person nicht immer einfach, alle Inhalte zu verstehen. Was können Sie tun, damit es für ihn einfacher wird ? Klicken Sie alle Punkte an, die positiv sein könnten.",
      taskAudio: api("ex5.mp3"),
      options: [
        "Moderator strukturiert das Meeting",
        "Trinken während des Meetings",
        "Alle Teilnehmer reden parallel",
        "Zusammenfassung der Inhalte auf einem Flipchart",
        "Geöffnete Fenster",
        "Hand vorm Mund beim Sprechen",
        "Moderator erteilt das Wort"
      ],
      solutions: [0,1,3,6],
      maxTries: 0,
    },
    nextStep: [22]
  },
  /* ZEILE 28 */
  { // ZEILE 29
    name: video_player,
    input: {id: 344446003},
    nextStep: [23]
  },
  { // ZEILE 30
    name: "laya-dialog",
    input: {
      question: "",
      answers: [
        "Ich möchte mehr über finanzielle Fördermöglichkeiten erfahren.",
        "Überspringen, denn ich kenne die Anlaufstationen bereits."
      ],
      bg: api("ex_bg.jpg")
    },
    nextStep: [24, 26]
  },
  { // ZEILE 31
    name: video_player,
    input: {id: 344446175},
    nextStep: [25]
  },
  { // ZEILE 32
    name: "laya-quiz-drag-drop",
    input: {
      title: "Übung 6 - Förderung",
      task: "Ich stelle Ihnen nun einige unterschiedliche Fördermöglichkeiten vor und Sie entscheiden: Förderfähig ja oder nein ? Ziehen Sie die Vorschläge in die richtige Spalte.",
      taskAudio: api("ex6.mp3"),
      categories: ["Förderfähig", "Nicht Förderfähig"],
      items: [
        {label: "Schulung der Kollegen*Innen im Umgang mit schwerhörigen Mitarbeiter*Innen",
          category: 0},
        {label: "Arbeitsassistenz, die bei bestimmten Arbeiten unterstützt",
          category: 0},
        {label: "Finanzieller Ausgleich, weil ein Kollege ein Teil seiner Arbeitszeit als Assistent zuständig ist",
          category: 0},
      ],
    },
    nextStep: [26]
  },
  /* ZEILE 33 */
  { // ZEILE 34
    name: video_player,
    input: {id: 344446317},
    nextStep: [27]
  },
  {
    name: "laya-html",
    input: {
      html: `
      <h2 class="mt-3 mb-5 text-center">
        Ende der Inclusion Journey
      </h2>
      <p><b>Materialien / Linkliste</b></p>
      <ul>
        <li>
          <a href="${api("Zahlen_Daten_Fakten_Links.pdf")}" target="_blank">
            <u>Zahlen_Daten_Fakten_Links</u>
          </a>
        </li>
        <li>
          <a href="${api("Poster_Kommunikationsregeln.pdf")}" target="_blank">
            <u>Poster_Kommunikationsregeln</u>
          </a>
        </li>
      </ul>
      `
    },
    nextStep: [27]
  },
]

export default {
  name: "course-detail-view",
  data() {
    return {
      wayin_data: wayin_data,
      course: {},
      contents: {},
      userEnrolled: false,
      backUrl: "",

      newContent: { type: "" },
      vstate: {} /* header collapse state */,
      authorMsg: ""
    };
  },
  computed: {
    ...mapState(["auth", "note"]),
    ...mapGetters(["isAuthor"]),

    msg: function() {
      return i18n[this.$store.state.profile.lang];
    }
  },
  methods: {
    ...utils,

    empty: function(obj) {
      if (Array.isArray(obj)) return obj.length === 0;
      return Object.keys(obj).length === 0;
    },
    emptyContent: function(obj) {
      // TODO
    },
    /*
     * collapse cat headers */
    show: function(cat, bool) {
      this.vstate[cat] = bool;
      this.$forceUpdate();
    },
    toggle: function(cat) {
      this.vstate[cat] = !this.vstate[cat];
      this.$forceUpdate();
    },

    /*
     * course enrollment/subscription */
    subscribe: function() {
      const ctx = this;
      http
        .put(`accounts/${ctx.auth.userId}/mycourses/rel/${ctx.course.name}`)
        .then(({ data }) => {
          ctx.$store.commit("addMyCourse");
          ctx.userEnrolled = true;
        })
        .catch(err => console.error(err));
    },
    unsubscribe: function() {
      const ctx = this;
      ctx.$store.commit("setBusy", true);
      http
        .delete(`accounts/${ctx.auth.userId}/mycourses/rel/${ctx.course.name}`)
        .then(({ data }) => {
          ctx.userEnrolled = false;
        })
        .catch(err => console.error(err))
        .then(() => {
          ctx.$store.commit("setBusy", false);
        });
    },

    /*
     * author controls */
    storeNewContent: function() {
      const ctx = this;
      const id = this.course.name;
      const { name, category, type } = this.newContent;
      if (!name || !category || !type) {
        this.authorMsg = "Kontrolliere Deine Eingaben!";
        return;
      }
      this.authorMsg = "";
      http
        .post(`courses/${id}/${type}`, { name, category })
        .then(({ data }) => {
          utils.categorize([data], ctx.contents, type);
          ctx.$forceUpdate();
        })
        .catch(err => console.error(err));
    },
    delContent: function(id, pos, cat, type) {
      const ctx = this;
      http
        .delete(`courses/${ctx.course.name}/${type}/${id}`)
        .then(() => {
          ctx.contents[cat][type].splice(pos, 1);
          ctx.$forceUpdate();
        })
        .catch(err => console.error(err));
    },

    learn() {
      const ctx = this;
      http
        .get(`courses/${ctx.course.name}/startInteraction`)
        .then(({ data }) => {
          console.log("data", data);
          let li = ctx.$laya.lookupType(data.assessmentType);
          switch (li.type) {
            case "assessment":
              ctx.$router.push({
                name: "assessment-view",
                // FIXME data.id might be inconsistent with specific with Assessment's id. Ask Sebastian for details
                params: { type: li.id, assId: data.id }
              });
              break;
            case "block":
            // TODO add logic for learning blocks.
          }
        });
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.backUrl = from.path;
    });
  },
  created() {
    const ctx = this;
    window.scrollTo(0, 0);
    ctx.$store.commit("setBusy", true);
    /*
     * fetch course */
    http
      .get(
        `courses/${ctx.$route.params.id}` +
          '/?filter={"include":["author", {"topics": "contents"}, {"quizzes": "contents"}]}'
      )
      .then(function({ data }) {
        ctx.course = data;
        /*
         * categorize content */
        let contents = {};
        utils.categorize(data.topics, contents, "topics");
        utils.categorize(data.quizzes, contents, "quizzes");
        ctx.contents = { ...contents };
        /*
         * is student enrolled */
        http
          .head(`accounts/${ctx.auth.userId}/mycourses/rel/${data.name}`)
          .then(() => {
            ctx.userEnrolled = true;
          });
      })
      .catch(err => {
        /*
         * redirect off invalid course */
        console.error(err);
        this.$router.push("/courses");
      })
      .then(() => ctx.$store.commit("setBusy", false));
  },
  components: {
  }
};
</script>

<style scoped>
*:focus {
  outline: 2px dashed deepskyblue;
}

.subscribe-btn {
  border: 2px solid black;
}

.nav-padding {
  padding-top: 8rem;
  padding-bottom: 2rem;
}

.course-meta {
  border-top: 1px solid black;
}
.catHeader {
  border-top: 2px solid black;
}
.catHeader:last-child {
  border-bottom: 2px solid black;
}
.click {
  cursor: pointer;
}

.content-icon {
  font-size: 6rem;
  line-height: 0rem;
  padding-bottom: 1rem;
  margin-top: -1rem;
}

.topic-content {
  width: 100%;
  border-top: 1px solid lightgrey;
  border-bottom: 1px solid lightgrey;
  background-color: #fbfcf7;
}

.topic-button {
  flex: 2;

  color: black;
  border: none;
  text-align: start;
  background-color: transparent;
}
.topic-button:focus {
  outline: 2px dashed deepskyblue;
}
</style>
