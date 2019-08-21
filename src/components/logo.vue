<template>
  <div class="ly-logo">

    <!--
    <svg id="logo" viewBox="0 0 100 100" class="d-none d-md-block">
      <rect x="0" y="00" width="50" height="40" style="fill: #96be00"/>
      <text x="4" y="32">LA</text>
      <rect x="0" y="40" width="50" height="40" style="fill: #fffa00"/>
      <text x="4" y="72">YA</text>
      <rect x="0" y="80" width="85" height="20" style="fill: #ffaaaa"/>
      <text x="4" y="93" style="font-size: 0.5rem">Learn as you are</text>
    </svg>
    -->

    <svg id="logoxs" viewBox="0 0 100 60" preserveAspectRatio="none">
      <rect x="0" y="00" width="50" height="40" style="fill: #96be00"/>
      <text x="4" y="32">LA</text>
      <rect x="50" y="00" width="50" height="40" style="fill: #fffa00"/>
      <text x="54" y="32">YA</text>
      <rect x="0" y="40" width="100" height="20" style="fill: #ffaaaa"/>
      <text x="6" y="54" style="font-size: 11px">Learn as you are</text>
    </svg>

  </div>
</template>

<script>
export default {
  name: 'ly-logo'
}
</script>

<style scoped>
#logo {
  position: fixed;
  top: 0;
  left: 0;

  width: 8rem;
  height: 8rem;
}

#logo text {
  fill: black;
  font-size: 36px;
  font-weight: bold;
}

#logoxs {
  height: 2rem;
}

#logoxs text {
  fill: black;
  font-size: 34px;
  font-weight: bold;
}
</style>
