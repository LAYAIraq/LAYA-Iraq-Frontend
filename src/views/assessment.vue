<template>
  <div :is="assessment.components[mode]"></div>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  data() {
    //@ts-ignore
    const assessment = this.$laya.la[this.$route.params.type];
    let mode = "view";
    // FIXME error, when assessment is undefined (not found).
    //@ts-ignore
    switch (this.$route.name) {
      case "assessment-create":
        // FIXME add ACL check
        mode = "new";
        break;
      case "assessment-view":
        mode = "view";
        break;
      case "assessment-edit":
        // FIXME add ACL check
        mode = "edit";
        break;
    }
    return { assessment, mode };
  },
});
</script>

