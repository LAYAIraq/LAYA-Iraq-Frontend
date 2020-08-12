//imports for full functionality

import App from "../src/App.vue"
import Laya from "../src/laya"
import router from "../src/router.js"
//import store from "../src/store"
import Vuex from "vuex"
import Storage from "vue-ls"
import lyHeader from "@/components/header"
import lyFooter from "@/components/footer"

//imports for testing
import { shallowMount, createLocalVue, mount } from "@vue/test-utils"
import chai, { expect, assert } from "chai"
import sinon from "sinon"
import sinonChai from "sinon-chai"


chai.use(sinonChai)
const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(Laya)
localVue.use(Storage, { name: "ls", namespace: "vuejs__", storage: "local" })

describe("App ", () => {

    let wrapper
    const mockMethod = sinon.spy()
  
    beforeEach(() => {
      var store
      const auth = {
        online: false,
        role: "student",
        userId: 0
      }
      const note = {
        busy: false,
        myCourses: 0
      }
      const profile = {
        avatar: "",
        email: "",
        lang: "de",
        name: "",
        prefs: {
          media: {
            audio: false,
            simple: false,
            text: true,
            video: true
          }
        }
      } 
      store = new Vuex.Store({
        auth,
        note,
        profile
      })
  
      wrapper = shallowMount(App, {
        store, 
        localVue,
        router
      })
    })
  
    it("ist gültiges Element", () => {
        assert.isOk(wrapper)
    })

    it("hat Header und Footer inkludiert", () => {
      assert(wrapper.findComponent(lyHeader))
      assert(wrapper.findComponent(lyFooter))
    })

    it("wird im Browser gerendert", () => {
      assert(wrapper.find("#app"))
    })
    
    
  })