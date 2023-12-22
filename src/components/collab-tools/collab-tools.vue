<!--
  Filename: collab-tools.vue
  Use: overview of collaboration tools
  Creator: nv
  Since: v1.3.0
-->

<template>
  <div :class="langIsAr? 'text-right': 'text-left'">
    <div class="container-fluid mt-5 mb-5">
      <!-- title -->
      <div class="row">
        <div class="col">
          <h1 class="text-center">
            {{ y18n('collaboration') }}
          </h1>
        </div>
      </div>

      <!-- description -->
      <div class="row">
        <div class="col-8 mx-auto mt-4">
          <h5>
            {{ y18n('collaboration.description') }}
          </h5>
        </div>
      </div>
    </div>
    <!-- table of tools -->
    <div class="container">
      <div class="table-responsve">
        <table class="table">
          <thead>
            <tr>
              <th
                scope="col"
                class="name-column"
              >
                {{ y18n('collaboration') }}
              </th>
              <th
                scope="col"
                class="description-column"
              >
                {{ y18n('feedback.edit.desc') }}
              </th>
              <th
                scope="col"
                class="start-column"
              >
                {{ }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in items"
              :key="index"
            >
              <td>{{ (item.name) }}</td>
              <td>{{ (item.description) }}</td>
              <td>
                <button
                  class="btn btn-primary"
                  @click="navigate(item.path)"
                >
                  {{ y18n('courseList.start') }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { locale } from '@/mixins'

export default {
  name: 'CollabTools',

  mixins: [
    locale
  ],

  data () {
    return {
      items: []
    }
  },
  mounted () {
    this.items = [
      { name: this.y18n('collaboration.chat'), path: '/chat', description: this.y18n('collaboration.chat.tooltip') },
      { name: this.y18n('collaboration.whiteboard'), path: '/whiteboard', description: this.y18n('collaboration.whiteboard.tooltip') }
    ]
  },
  methods: {
    navigate (path) {
      this.$router.push(path)
    }
  }
}
</script>

<style scoped>
*:focus {
  outline-offset: 5px;
  outline: 2px dashed deepskyblue;
}

.header {
  border-bottom: 2px solid black;
}

.name-column {
  width: 20%;
}
.description-column {
  width: 70%;
}
.start-column {
  width: 10%;
}
@media (max-width: 768px) {
  .table th, .table td {
    padding: 0.5rem;
    font-size: 0.8rem;
  }
}
</style>
