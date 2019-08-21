<template>
  <div class="section">
    <div class="separator top"/>
    
    <b-container fluid>
      <b-row>

        <b-col class="section-left">
          <slot name="left" />
        </b-col>

        <b-col class="section-right">
          <slot name="right" />
        </b-col>

      </b-row>
    </b-container>

    <div class="separator bottom"/>
  </div>
</template>

<script></script>

<style scoped>
.section {
  position: relative;
  background-color: #eee;
}

.section-left {
  padding: 2rem 2rem 1rem 1rem;
}

.section-right {
  padding: 2rem 1rem 1rem 2rem;
}


.separator {
  position: absolute;
  left: 50%;
  transform: translate(-50%);

  width: 0;
  height: 0;
  border: solid 2rem;
}

.separator.top {
  top: 0;
  
  z-index: 0;
  border-color: white transparent transparent transparent;
}

.separator.bottom {

  z-index: 1;
  border-color: #eee transparent transparent transparent;
}
</style>
