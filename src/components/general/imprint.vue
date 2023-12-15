<!--
  Filename: imprint.vue
  Use: display imprint
  Creator: core
  Since: v1.0.0
-->

<template>
  <div
    class="imprint"
    :class="langIsAr? 'text-right' : 'text-left'"
  >
    <div class="container">
      <div class="row">
        <div class="col">
          <div style="height: 2rem"></div>
          <h1><b>{{ y18n('imprint') }}</b></h1>
          <p>LAYA is an open source learning management system under GNU GPLv3.</p>
          <p>
            LAYA was first conceived by Stefanie Trzecinski at Kopf, Hand + Fuß<a
              href="#khuf"
            >¹</a>
            and Professor Niels Pinkwart and his team at Humboldt-Universität zu
            Berlin of the research group "Computer Science Education/Computer Science
            and Society"<a href="#hu-lehrstuhl">²</a>.
          </p>
          <p>
            LAYA Iraq has been further developed by Professor Frederike Bartels
            and Professor Marie-Christine Vierbuchen and their teams in the DAAD-funded
            projects "Improving Inclusive Teacher Education in Iraq" (2019-2021)<a href="#research-project-1">³</a>,
            "Digital and Inclusive - Innovative Teacher Training for Primary School Teachers in Iraq" (2022-2023)
            <a href="#research-project-2">⁴</a> and "Special Educational Needs (in Regular Schools) - Train the Teacher
            Trainer" (2022-2023)<a href="#research-project-3">⁵</a> for use at Iraqi universities.
          </p>

          <p>
            This learning platform has been developed in cooperation with the University of Dohuk, University of Garmian,
            and University of Zakho in the Kurdistan region of Iraq as well as the University of Kufa and University of
            Mosul in Iraq.

            We appreciate the help of the project participants as well as the university responsibles!
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

          <p>
            or at:
            <a href="mailto:laya-iraq@outlook.com">
              laya-iraq@outlook.com
            </a>
          </p>

          <p>
            ¹ <a
              id="khuf"
              href="https://kopfhandundfuss.de/"
            >
              https://kopfhandundfuss.de/
            </a>
          </p>
          <p>
            ² <a
              id="hu-lehrstuhl"
              href="https://www.informatik.hu-berlin.de/de/forschung/gebiete/cses"
            >
              https://www.informatik.hu-berlin.de/de/forschung/gebiete/cses
            </a>
          </p>
          <p>
            ³
            <a
              id="research-project-1"
              href="https://www.uni-vechta.de/erziehungswissenschaften/team/standard-titel-1/improving-inclusive-teacher-education-in-iraq"
            >
              https://www.uni-vechta.de/erziehungswissenschaften/team/standard-titel-1/improving-inclusive-teacher-education-in-iraq
            </a>
          </p>
          <p>
            ⁴
            <a
              id="research-project-2"
              href="https://www.uni-vechta.de/erziehungswissenschaften/team/bartels-frederike/projekte/leila"
            >
              https://www.uni-vechta.de/erziehungswissenschaften/team/bartels-frederike/projekte/leila
            </a>
          </p>
          <p>
            ⁵
            <a
              id="research-project-3"
              href="https://www.uni-flensburg.de/sl/forschung-projekte-entwicklung/projekte-aktuell/professorin-dr-marie-christine-vierbuchen/sen-t3"
            >
              https://www.uni-flensburg.de/sl/forschung-projekte-entwicklung/projekte-aktuell/professorin-dr-marie-christine-vierbuchen/sen-t3
            </a>
          </p>
          <p>
            <img
              src="../../assets/images/daad_logo_suppl_de+en_h_basic_rgb.png"
              alt="Logo of DAAD"
              width="300px"
            >
            Funded by the German Academic Exchange Service (DAAD).
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { locale } from '@/mixins'

export default {
  name: 'Imprint',

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
