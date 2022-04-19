<template>
  <div class="container">
    <div class="row">
      <h2>Pending Applications</h2>
    </div>
    <!-- table header -->
    <div class="row mt-5">
      <div class="col">
        <strong>
          Applicant's name
        </strong>
      </div>
      <div class="col">
        <strong>
          Applicant's institution
        </strong>
      </div>
      <div class="col">
      </div>
      <div class="col">
        <strong>
          Voting status
        </strong>
      </div>
    </div>
    <hr>
    <!-- table content -->
    <div class="row mb-3">
      <div class="col">
        Some applicant
      </div>
      <div class="col">
        Psychology
      </div>
      <div class="col">
        <b-button
          variant="secondary"
        >
          View Application
        </b-button>
      </div>
      <div class="col">
        2 / 3
      </div>
    </div>
    <div class="row">
      <div class="col">
        Second applicant
      </div>
      <div class="col">
        Computer Science
      </div>
      <div class="col">
        <b-button
          variant="secondary"
          @click="$bvModal.show('view-application')"
        >
          View Application
        </b-button>
      </div>
      <div class="col">
        0 / 3
      </div>
    </div>
    <hr>
    <div class="row mt-5">
      <h2>Your recommendations</h2>
    </div>
    <!-- table header -->
    <div class="row mt-5">
      <div class="col">
        <strong>
          Applicant's name
        </strong>
      </div>
      <div class="col">
        <strong>
          Voting status
        </strong>
      </div>
    </div>
    <div class="row">
      <div class="col">
        Doktor Ahmad
      </div>
      <div class="col">
        Pending
      </div>
    </div>
    <div class="row">
      <div class="col">
        Doktor Layla
      </div>
      <div class="col">
        Approved
      </div>
    </div>
    <b-modal
      id="view-application"
      title="View Author Application"
      header-bg-variant="primary"
      ok-variant="success"
      ok-title="hide"
      centered
      static
    >
      <div class="form-group p-2">
        <div class="form-group row">
          <span
            class="col-form-label"
          >
            Applicant's Name
          </span>
          <span class="ml-auto">
            Second Applicant
          </span>
        </div>
        <div class="form-group row">
          <span
            class="col-form-label"
          >
            Institution
          </span>
          <span class="ml-auto">
            Institute of Computer Science, Humboldt-University
          </span>
        </div>
        <div class="form-group row">
          <span
            class="col-form-label"
          >
            Application text
          </span>
          <span
            id="applicant-text"
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nunc elit, tristique non nibh quis, convallis vulputate magna. Fusce eu lacus semper risus porttitor malesuada nec eget ante. Quisque rhoncus felis nec iaculis aliquet. Integer auctor a felis volutpat aliquam. Sed faucibus dui nibh, vel pharetra purus fringilla volutpat. Donec sagittis lacus eu neque suscipit pellentesque. Sed auctor pulvinar elementum. Suspendisse potenti. In hac habitasse platea dictumst. Nunc id quam lacinia, scelerisque lacus quis, mollis odio. Etiam placerat magna vel sem ornare, quis convallis mi maximus. Maecenas augue erat, sollicitudin sed cursus lacinia, blandit porttitor tortor. Maecenas sit amet nisl rutrum, mattis dui id, vulputate quam.
          </span>
        </div>
        <div class="row">
          <b-button
            variant="success"
          >
            Approve Application
          </b-button>
          <b-button
            variant="danger"
          >
            Veto Application
          </b-button>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
export default {
  name: 'EditorPanel'
}
</script>

<style scoped>

</style>
