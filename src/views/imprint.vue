<!--
Filename: imprint.vue
Use: display imprint
Creator: core
Date: unknown
Dependencies: @/mixins/locale.vue
-->

<template>
  <div
    class="imprint-view"
    :class="langIsAr? 'text-right' : 'text-left'"
  >

    <div class="container">
      <div class="row">
        <div class="col">

          <div style="height: 2rem"></div>
          <h1><b>{{ i18n['imprint'] }}</b></h1>
          <p>LAYA is an open source learning management system under GNU GPLv3.</p>
          <p>
            LAYA was first conceived by Stefanie Trzecinski at Kopf, Hand + Fuß<a
            href="#khuf">¹</a>
            and Professor Niels Pinkwart and his team at Humboldt-Universität zu
            Berlin of the research group "Computer Science Education/Computer Science
            and Society"<a href="#hu-lehrstuhl">²</a>.
          </p>
          <p>
            LAYA Iraq has been further developed by Professor Frederike Bartels
            and Professor Marie-Christine Vierbuchen and their team in the DAAD-funded
            project "Improving Inclusive Teacher Education in Iraq" for use at Iraqi
            universities<a href="#research-project">³</a>.
          </p>

          <p>
            If you have any questions, suggestions or want to know any information
            regarding LAYA Iraq, please contact us at:
          </p>

          <p>
            Prof. Frederike Bartels<br>
            Universität Vechta<br>
            Driverstraße 22<br>
            49377 Vechta
          </p>

          <p>or at:
            <a href="mailto:laya-support.hu-berlin.de">
              laya-support@informatik.hu-berlin.de
            </a>
          </p>

          <p>
            ¹ <a
                href="https://kopfhandundfuss.de/"
                id="khuf"
              >
                https://kopfhandundfuss.de/
              </a>
          </p>
          <p>
            ² <a
                href="https://www.informatik.hu-berlin.de/de/forschung/gebiete/cses"
                id="hu-lehrstuhl"
              >
                https://www.informatik.hu-berlin.de/de/forschung/gebiete/cses
              </a>
          </p>
          <p>³
            <a
              href="https://www.uni-vechta.de/erziehungswissenschaften/team/standard-titel-1/improving-inclusive-teacher-education-in-iraq"
              id="research-project"
            >
              https://www.uni-vechta.de/erziehungswissenschaften/team/standard-titel-1/improving-inclusive-teacher-education-in-iraq
            </a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { locale } from '@/mixins'

export default {
  name: 'imprint-view',

  mixins: [
    locale
  ],

  mounted () {
    window.scroll(0, 0)
  }
}
</script>

<style scoped>
*:focus {
  outline: 3px dashed deepskyblue;
}

a {
  color: #000;
  text-decoration: underline;
}
</style>
