<!--
  Filename: admin-panel.vue
  Use: manage users, assign roles, change email addresses, fire pw
     change request
  Creator: cmc
  Date: November 1, 2021
  Dependencies:
    @/mixins,
    @/misc/roles,
    vuex
-->
<template>
  <div :class="langIsAr? 'text-right': 'text-left'">
    <div class="container-fluid mt-5 mb-5">
      <div class="row">
        <div class="col">
          <h1 class="text-center">
            {{ y18n('adminPanel.title') }}
          </h1>
        </div>
      </div>
    </div>
    <!-- filter options -->
    <div class="container">
      <div
        id="filter-criteria"
        class="row mb-5 pt-3 pb-4 bg-dark text-light"
      >
        <div class="col-2">
          <strong>
            {{ y18n('adminPanel.filterList') }}
          </strong>
        </div>
        <div class="col">
          {{ y18n('adminPanel.email') }}
          <label
            id="email-filter-label"
            for="email-filter-input"
            class="sr-only"
          >
            {{ y18n('adminPanel.filterListByEmail') }}
          </label>
          <div class="input-group">
            <input
              id="email-filter-input"
              v-model="emailFilter"
              aria-describedby="email-filter-label"
              @keypress.enter="setFilter(emailFilter)"
              @blur="setFilter(null)"
            >
          </div>
        </div>
        <div class="col">
          {{ y18n('usernamePH') }}
          <label
            id="name-filter-label"
            for="name-filter-input"
            class="sr-only"
          >
            {{ y18n('adminPanel.filterListByName') }}
          </label>
          <div class="input-group">
            <input
              id="name-filter-input"
              v-model="usernameFilter"
              aria-describedby="name-filter-label"
              @keypress.enter="setFilter(usernameFilter)"
              @blur="setFilter(null)"
            >
          </div>
        </div>
        <div class="col">
          {{ y18n('adminPanel.role') }}
          <span
            id="role-filter-label"
            class="sr-only"
          >
            {{ y18n('adminPanel.filterListByRole') }}
          </span>
          <div class="input-group">
            <b-select
              id="role-filter-select"
              v-model="roleFilter"
              aria-describedby="role-filter-label"
              @blur="setFilter(null)"
            >
              <b-select-option
                value="null"
              >
                {{ y18n('adminPanel.chooseRole') }}
              </b-select-option>
              <b-select-option
                v-for="(role, i) in Object.values(roles)"
                :key="i"
                :value="role"
              >
                {{ capitalizeFirstLetter(role) }}
              </b-select-option>
            </b-select>
          </div>
        </div>
        <div class="col pt-4">
          <b-button
            v-b-tooltip.bottom
            :class="langIsAr? 'ml-2': 'mr-2'"
            :title="y18n('adminPanel.filterList')"
            @click="setFilter(true)"
          >
            <i class="fas fa-filter"></i>
            <span class="sr-only">
              {{ y18n('adminPanel.filterList') }}
            </span>
          </b-button>
          <b-button
            v-b-tooltip.bottom
            :class="langIsAr? 'ml-2': 'mr-2'"
            variant="warning"
            :title="y18n('adminPanel.resetFilters')"
            @click="setFilter(false)"
          >
            <i class="far fa-times-circle"></i>
            <span class="sr-only">
              {{ y18n('adminPanel.resetFilters') }}
            </span>
          </b-button>
        </div>
      </div>
    </div>
    <!-- user list -->
    <div class="container">
      <!-- head -->
      <div
        id="user-list"
        class="row font-weight-bold mb-3"
      >
        <div class="col-3">
          {{ y18n('adminPanel.user') }}
        </div>
        <div class="col-2">
          {{ y18n('adminPanel.role') }}
        </div>
        <div class="col-3">
          {{ y18n('adminPanel.email') }}
        </div>
        <div class="col-1">
          {{ y18n('adminPanel.emailVerified') }}
        </div>
        <div class="col-3">
          {{ y18n('adminPanel.actions') }}
        </div>
      </div>
      <!-- body -->
      <div v-if="pagedList.length !== 0">
        <div
          v-for="user in pagedList[pageSelected]"
          :key="user.id"
          class="row mb-2"
        >
          <div class="col-3">
            {{ user.username }}
          </div>
          <div class="col-2">
            {{ capitalizeFirstLetter(user.role) }}
          </div>
          <div class="col-3 text-break">
            {{ user.email }}
          </div>
          <div class="col-1">
            {{ user.emailVerified }}
          </div>
          <!-- user management -->
          <div
            id="user-management-buttons"
            class="col-3"
          >
            <!-- promote user -->
            <b-button
              v-b-tooltip.top
              class="user-mgmt-btn"
              :disabled="user.id === userId"
              :class="langIsAr? 'ml-2': 'mr-2'"
              :title="y18n('adminPanel.promoteUser')"
              @click="openModal(user.id, 'promote-user')"
            >
              <i class="fas fa-arrow-circle-up"></i>
              <span class="sr-only">
                {{ y18n('adminPanel.promoteUser') }}
              </span>
            </b-button>
            <!-- edit email -->
            <b-button
              v-b-tooltip.top
              class="user-mgmt-btn"
              :disabled="user.id === userId"
              :class="langIsAr? 'ml-2': 'mr-2'"
              :title="y18n('adminPanel.editEmail')"
              variant="info"
              @click="openModal(user.id, 'edit-email')"
            >
              <i class="fas fa-pen"></i>
              <span class="sr-only">
                {{ y18n('adminPanel.editEmail') }}
              </span>
            </b-button>
            <!-- reset password -->
            <b-button
              v-b-tooltip.top
              class="user-mgmt-btn"
              :disabled="user.id === userId"
              :class="langIsAr? 'ml-2': 'mr-2'"
              :title="y18n('adminPanel.resetPassword')"
              variant="warning"
              @click="openModal(user.id, 'reset-password')"
            >
              <i class="fas fa-screwdriver"></i>
              <span class="sr-only">
                {{ y18n('adminPanel.resetPassword') }}
              </span>
            </b-button>
            <!-- delete user -->
            <b-button
              v-b-tooltip.top
              class="user-mgmt-btn"
              :disabled="user.id === userId"
              :class="langIsAr? 'ml-2': 'mr-2'"
              :title="y18n('adminPanel.deleteUser')"
              variant="danger"
              @click="openModal(user.id, 'delete-user')"
            >
              <i class="fas fa-times-circle"></i>
              <span class="sr-only">
                {{ y18n('adminPanel.deleteUser') }}
              </span>
            </b-button>
          </div>
        </div>
      </div>
      <!-- placeholder if no filter matches -->
      <div
        v-else
        class="text-center"
      >
        {{ y18n('adminPanel.noMatch') }}
      </div>

      <!-- pages -->
      <div class="row mt-5 pt-3 pb-2 bg-dark text-light">
        <div class="col-3">
          {{ y18n('adminPanel.itemsPerPage') }}
        </div>
        <div class="col-2">
          <b-select
            v-model="pageSize"
            :options="pageOptions"
          >
          </b-select>
        </div>
        <div class="col">
          <ul class="pages m-auto">
            <li
              v-for="i in pagedList.length"
              :key="i"
            >
              <b-button
                :variant="pageSelected !== i-1? 'outline-primary': 'primary'"
                :class="langIsAr? 'ml-2': 'mr-2'"
                class="mb-1"
                @click="pageSelected = i-1"
              >
                {{ i }}
              </b-button>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!-- create user button -->
    <div class="row mt-3">
      <b-button
        variant="warning"
        class="m-auto"
        @click="openModal(-1, 'create-user')"
      >
        <i class="fas fa-plus-circle"></i>
        {{ y18n('adminPanel.createUser') }}
      </b-button>
    </div>
    <!-- wrap modals -->
    <div id="modals">
      <!-- change role modal -->
      <b-modal
        id="promote-user"
        :title="y18n('adminPanel.promoteUser')"
        header-bg-variant="warning"
        ok-variant="warning"
        :ok-title="y18n('adminPanel.promoteUser')"
        :cancel-title="y18n('cancel')"
        centered
        @ok="changeUserRole"
      >
        <p>
          {{ y18n('adminPanel.modal.promoteUser') }}
        </p>
        <b-select v-model="changeRole">
          <b-select-option value="null">
            {{ y18n('adminPanel.chooseRole') }}
          </b-select-option>
          <b-select-option
            v-for="role in Object.values(assignableRoles)"
            :key="role"
            :value="role"
          >
            {{ capitalizeFirstLetter(role) }}
          </b-select-option>
        </b-select>
      </b-modal>
      <!-- edit email modal -->
      <b-modal
        id="edit-email"
        :title="y18n('adminPanel.editEmail')"
        header-bg-variant="warning"
        ok-variant="warning"
        :ok-title="y18n('adminPanel.editEmail')"
        :cancel-title="y18n('cancel')"
        centered
        @ok="editUserEmail"
      >
        <p>
          {{ y18n('adminPanel.modal.editEmail') }}
        </p>
        <label
          for="email-change-input"
          class="sr-only"
        >
          {{ y18n('adminPanel.modal.newEmail') }}
        </label>
        <input
          id="email-change-input"
          v-model="changeEmail"
          type="text"
          :placeholder="y18n('adminPanel.modal.newEmail')"
        >
      </b-modal>
      <!-- reset password modal -->
      <b-modal
        id="reset-password"
        :title="y18n('adminPanel.resetPassword')"
        header-bg-variant="warning"
        ok-variant="warning"
        :ok-title="y18n('adminPanel.resetPassword')"
        :cancel-title="y18n('cancel')"
        centered
        @ok="resetUserPassword"
      >
        <p>
          {{ y18n('adminPanel.modal.resetPassword') }}
        </p>
      </b-modal>
      <!-- delete user modal -->
      <b-modal
        id="delete-user"
        :title="y18n('adminPanel.deleteUser')"
        header-bg-variant="danger"
        ok-variant="danger"
        :ok-title="y18n('adminPanel.deleteUser')"
        :cancel-title="y18n('cancel')"
        centered
        @ok="deleteUser"
      >
        <p>
          {{ y18n('adminPanel.modal.deleteUser') }}
        </p>
      </b-modal>
      <!-- create user modal -->
      <b-modal
        id="create-user"
        :title="y18n('adminPanel.createUser')"
        header-bg-variant="warning"
        ok-variant="warning"
        :ok-title="y18n('adminPanel.createUser')"
        :cancel-title="y18n('cancel')"
        centered
        @ok="handleCreateUser"
      >
        <p>
          {{ y18n('adminPanel.modal.createUser') }}
        </p>

        <p>
          <label
            for="create-user-name"
            :class="langIsAr? 'ml-auto': 'mr-auto'"
          >
            {{ y18n('usernamePH') }}
          </label>
          <input
            id="create-user-name"
            v-model="createUserName"
            :class="{
              'mr-2': langIsAr,
              'ml-2': !langIsAr,
              'highlight-border': emptyCreateInput
            }"
            :placeholder="y18n('usernamePH')"
          >
        </p>
        <p>
          <label
            for="create-user-email"
            :class="langIsAr? 'ml-auto': 'mr-auto'"
          >
            {{ y18n('adminPanel.email') }}
          </label>

          <input
            id="create-user-email"
            v-model="createUserEmail"
            :class="{
              'mr-2': langIsAr,
              'ml-2': !langIsAr,
              'highlight-border': emptyCreateInput || noEmailFormat
            }"
            :placeholder="y18n('adminPanel.email')"
          >
        </p>
        <p>
          <label
            id="user-create-role"
            :class="langIsAr? 'ml-auto': 'mr-auto'"
          >
            {{ y18n('adminPanel.role') }}
          </label>
          <b-select
            v-model="createUserRole"
            aria-describedby="user-create-role"
          >
            <b-select-option value="null">
              {{ y18n('adminPanel.chooseRole') }}
            </b-select-option>
            <b-select-option
              v-for="role in Object.values(assignableRoles)"
              :key="role"
              :value="role"
            >
              {{ capitalizeFirstLetter(role) }}
            </b-select-option>
          </b-select>
        </p>
        <p v-if="emptyCreateInput">
          {{ y18n('courseNavEdit.table.missingInfo') }}
        </p>
        <p v-if="noEmailFormat">
          {{ y18n('emailErr') }}
        </p>
        <p v-if="duplicateProperty">
          {{ duplicateErrMsg }}
        </p>
        <p v-if="noRoleChosen">
          {{ y18n('adminPanel.modal.chooseRole') }}
        </p>
      </b-modal>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { locale } from '@/mixins'
import roles from '@/misc/roles'

export default {
  name: 'AdminDashboard',

  mixins: [
    locale
  ],

  data () {
    return {
      createUserEmail: '',
      createUserName: '',
      createUserRole: null,
      changeEmail: '',
      changeRole: null,
      changingUserId: null,
      duplicateProperty: null,
      emailFilter: '',
      emptyCreateInput: false,
      filter: null,
      listPages: [],
      pageSelected: 0,
      pageSize: 25,
      pageOptions: [
        { value: 10, text: '10' },
        { value: 25, text: '25' },
        { value: 50, text: '50' },
        { value: 100, text: '100' },
        { value: 250, text: '250' },
        { value: 500, text: '500' }
      ],
      regexArr: [],
      roleFilter: null,
      usernameFilter: ''
    }
  },

  computed: {
    ...mapGetters([
      'isAdmin',
      'userId',
      'users'
    ]),

    /**
     * function assignableRoles: return roles barring admin to
     *  prevent having multiple admins accidentally
     *
     * Author: cmc
     *
     * Last Updated: December 3, 2021
     * @returns {object} roles without admin
     */
    assignableRoles () {
      // eslint-disable-next-line
      return (({ ADMIN, ...o}) => o) (roles)
    },

    /**
     * function duplicateErrMsg: returns error message for duplicate property in locale
     *
     * Author: cmc
     *
     * Last Updated: February 5, 2022
     * @returns {string} Error message when name or email is duplicate
     */
    duplicateErrMsg () {
      return this.y18n('adminPanel.modal.duplicateError') + this.duplicateProperty
    },

    /**
     * function filteredList: filters list according to regexes array
     *
     * Author: cmc
     *
     * Last Updated: November 27, 2021
     */
    filteredList () {
      // check each filter set if element matches
      if (this.regexes.length !== 0) {
        return this.users.filter(user => {
          let match = true
          this.regexes.forEach(pair => {
            if (!pair[1].test(user[pair[0]])) {
              match = false
            }
          })
          return match
        })
      } else {
        return this.users
      }
    },

    /**
     * function noEmailFormat: returns true if string doesn't contain
     *  a stop or @
     *
     *  Author: cmc
     *
     *  Last Updated: November 23, 2021
     * @returns true if no stop or @ in createUserEmail
     */
    noEmailFormat () {
      return !(this.createUserEmail.includes('@') &&
        this.createUserEmail.includes('.'))
    },

    /**
     * noRoleChosen: true if role for new user is null or 'null'
     *
     * Author: cmc
     *
     * Last Updated: February 5, 2022
     * @returns {boolean} true if no role chosen
     **/
    noRoleChosen () {
      return (!this.createUserRole || this.createUserRole === 'null')
    },

    /**
     * pagedList: split list into pages
     *
     * Author: cmc
     *
     * Last Updated: December 3, 2021
     **/
    pagedList: {
      get () {
        return this.listPages
      },
      set (val) {
        this.listPages = []
        // page list in slices of pageSize
        for (let i = 0; i < this.filteredList.length / val; i++) {
          const page = this.filteredList.slice(val * i, val * (i + 1))
          this.listPages.push(page)
        }
      }
    },

    /**
     * function regexes: returns an array of regexes for filtering
     *
     * Author: cmc
     *
     * Last Updated: November 27, 2021
     */
    regexes: {
      get () {
        return this.regexArr
      },
      set () {
        const regexes = []
        if (!this.filter) {
          this.regexArr = regexes
        } else {
          if (this.emailFilter !== '') {
            regexes.push(['email', new RegExp(this.emailFilter, 'i')])
          }
          if (this.roleFilter) {
            regexes.push(['role', new RegExp(this.roleFilter, 'i')])
          }
          if (this.usernameFilter !== '') {
            regexes.push(['username', new RegExp(this.usernameFilter, 'i')])
          }
          this.regexArr = regexes
        }
      }
    },

    roles () {
      return roles
    }
  },

  watch: {
    // reset regexes when filter changes
    filter (val) {
      if (val !== null) { // explicily because false is used to reset filter
        this.regexes = val
      }
    },
    // repage list if filters change
    filteredList () {
      this.pagedList = this.pageSize
    },
    // repage list if page size changes
    pageSize (val) {
      this.pagedList = val
    }
  },

  created () {
    this.relocateNonAdmin()
    this.getUserList()
    this.pagedList = 25
  },

  methods: {
    // /**
    //  * function randomUsers: create random users, only for dev test
    //  *  purposes
    //  *
    //  * Author: cmc
    //  *
    //  * Last Updated: December 3, 2021
    //  * @param {number} num number of user to be created
    //  **/
    // randomUsers(num) {
    //   for (let i = 0; i < num ; i++) {
    //     this.createUserName = `randomUser${i+1}`
    //     this.createUserEmail = `random-${i}@laya.de`
    //     this.createUser()
    //   }
    // },

    /**
     * function capitalizeFirstLetter(): returns string with capitalized
     *  first letter
     *
     * Author: cmc
     *
     * Last Updated: November 18, 2021
     * @param {string} str string to be capitalized
     */
    capitalizeFirstLetter (str) {
      return str.charAt(0).toUpperCase() + str.slice(1)
    },

    /**
     * function changeUserRole: send user role change to store
     *
     * Author: cmc
     *
     * Last Updated: November 19, 2021
     */
    changeUserRole () {
      this.$store.dispatch('changeRole', {
        id: this.changingUserId,
        role: this.changeRole
      })
    },

    /**
     * function createUser: dispatch create user to store
     *
     * Author: cmc
     *
     * Last Updated: November 23, 2021
     */
    createUser () {
      this.$store.dispatch('createUser', {
        username: this.createUserName,
        email: this.createUserEmail.toLowerCase(),
        role: this.createUserRole || 'student' // create student when no role chosen
      })
        .then(() => this.$bvModal.hide('create-user'))
        .catch(err => {
          this.duplicateProperty = err
        })
    },

    /**
     * function deleteUser: dispatch delete user to store
     *
     * Author: cmc
     *
     * Last Updated: November 19, 2021
     */
    deleteUser () {
      this.$store.dispatch('deleteUser', this.changingUserId)
    },

    /**
     * function editUserEmail: change user's email address
     *
     * Author: cmc
     *
     * Last Updated: November 19, 2021
     */
    editUserEmail () {
      this.$store.dispatch('changeEmail', {
        id: this.changingUserId,
        email: this.changeEmail
      })
    },

    /**
     * function getUserList: fetch user list if not present in store
     *
     * Author: cmc
     *
     * Last Updated: November 18, 2021
     */
    getUserList () {
      if (this.users.length === 0) {
        this.$store.dispatch('fetchUserList')
      }
    },

    /**
     * function handleCreateUser: prevent modal from closing if inputs are empty,
     *  email has wrong format, fire createUser() when not
     *
     * Author: cmc
     *
     * Last Updated: November 23, 2021
     * @param e modal event
     */
    handleCreateUser (e) {
      e.preventDefault()
      if (this.createUserName !== '' && this.createUserEmail !== '') {
        this.emptyCreateInput = false
        if (!this.noEmailFormat) {
          this.createUser()
        }
      } else {
        this.emptyCreateInput = true
      }
    },

    /**
     * function openModal: set changingUserId, open modal with id 'type'
     *
     * Author: cmc
     *
     * Last Updated: November 19, 2021
     * @param {number} id userId that is getting a new role
     * @param {string} type id of modal to open
     */
    openModal (id, type) {
      this.changingUserId = id
      this.$bvModal.show(type)
    },

    /**
     * function relocateNonAdmin: return to start page when user is not admin
     *
     * Author: cmc
     *
     * Last Updated: November 11, 2021
     */
    relocateNonAdmin () {
      if (!this.isAdmin) this.$router.push('/')
    },

    /**
     * function resetUserPassword: reset user's password
     *
     * Author: cmc
     *
     * Last Updated: November 19, 2021
     */
    resetUserPassword () {
      this.$store.dispatch('resetUserPassword', this.changingUserId)
    },

    /**
     * function setFilter: set filter data prop
     *
     * Author: cmc
     *
     * Last Updated: November 18, 2021
     * @param {any} property what will set as filter
     */
    setFilter (property) {
      this.filter = property
    }
  }
}
</script>

<!--suppress CssUnusedSymbol -->
<style scoped>
.input-group {
  flex-wrap: nowrap;
}

.highlight-border {
  border: 1px crimson solid;
}

ul.pages {
  list-style-type: none;
  display: flex;
  flex-wrap: wrap;
}
.pages li {
  display: flex;
}
.pages li>button {
  min-width: 55px;
}
.btn-outline-primary {
  color: #69affb;
  border-color: #69affb;
}

.user-mgmt-btn[disabled] {
  cursor: not-allowed;
}
i {
  font-size: 1.5rem;
}
</style>
