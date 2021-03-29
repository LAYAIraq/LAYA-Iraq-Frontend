<!--
Filename: imprint.vue 
Use: display imprint
Creator: core
Date: unknown
Dependencies: @/i18n/imprint
-->

<template>
  <div class="imprint-view">

    <div class="container">
      <div class="row">
        <div class="col">

          <div style="height: 2rem"></div>
          <h1><b>{{ i18n.title }}</b></h1>

          <div style="height: 1rem"></div>

          <p>ARBEIT UND LEBEN - DGB/VHS, Landesarbeitsgemeinschaft Berlin e.V.<br>
            Fachbereich Arbeit &amp; Qualifizierung<br>
            Projekt WayIn – Der Inklusionswegweiser für Arbeitgeber: Ein digitales Informationsangebot zur Beschäftigung von Menschen mit Behinderung<br>
            Kapweg 4<br>
            13405 Berlin<br>
            Telefon: (030) 5130 192 21<br>
            E-Mail: inklusion@berlin.arbeitundleben.de<br>
            GESCHÄFTSFÜHRUNG<br>
            Dr. Undine Flemming<br>
            Michael Lüdtke</p>
          <p>VERTRETUNGSBERECHTIGTER VORSTAND<br>
            Doro Zinke (Vorsitzende)<br>
            Knut Schiemann (stellv. Vorsitzender)<br>
            Registergericht: Amtsgericht Charlottenburg<br>
            Registernummer: VR 12205</p>
          <p>UMSATZSTEUER-IDENTIFIKATIONSNUMMER<br>
            gemäß § 27 a Umsatzsteuergesetz<br>
            DE 27 / 660 / 52189</p>
          <p>PARTNER UND TRÄGER<br>
            Europäischer Sozialfond<br>
            Bundesministerium für Bildung und Forschung<br>
            Humboldt Universität zu Berlin<br>
            KOPF, HAND + FUSS gemeinnützige Gesellschaft für Bildung mbH</p>
          <p>KONZEPTION, GESTALTUNG UND UMSETZUNG DER WEBSITE</p>
          <p>Max Meisenheimer</p>
          <p>INHALTLICH VERANTWORTLICHER<br>
            gemäß § 10 Absatz 3 MDStV<br>
            Dr. Undine Flemming (Anschrift wie oben)<br>
            Michael Lüdtke (Anschrift wie oben)<br>
            BILDNACHWEISE<br>
            Urheberrechte an den Bildern auf der Startseite bei:<br>
            © XXXXX<br>
            HINWEISE AN RECHTEINHABER<br>
            Die Herausgeber weisen darauf hin, kein Material zu verwenden, das Urheberrechten Dritter<br>
            unterliegt. Bei der sehr großen Zahl der in deutscher Sprache vorliegenden elektronischen und vor<br>
            allem schriftlichen Publikationen kann er aber nicht ausschließen, dass von Benutzern dennoch<br>
            Material eingebracht wird, das bestehende Schutzrechte verletzt, und das nicht sofort als solches<br>
            erkannt wird. Wenn den Herausgebern eine entsprechende Urheberrechtsverletzung angezeigt wird,<br>
            wird das betreffende Material umgehend vom Server genommen.</p>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as i18n from '@/i18n/imprint'

export default {
  name: 'imprint-view',
  mounted () {
    window.scroll(0, 0)
  },
  computed: {

    /**
     * i18n: Load translation files depending on user language
     * 
     * Author: cmc
     * 
     * Last updated: March 21, 2021
     * 
     */
    i18n() {
      return i18n[this.$store.state.profile.lang]
    }
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
