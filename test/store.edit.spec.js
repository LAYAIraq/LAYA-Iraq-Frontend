//imports for full functionality

import Laya from "../src/laya"
import router from "../src/router.js"
import store from "../src/store"
import Vuex from "vuex"
import Storage from "vue-ls"
import http from "axios"

//import components

//imports for testing
import { shallowMount, createLocalVue } from "@vue/test-utils"
import chai, { expect, assert } from "chai"
import sinon from "sinon"
import sinonChai from "sinon-chai"


chai.use(sinonChai)
const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(Laya)
localVue.use(Storage, { name: "ls", namespace: "vuejs__", storage: "local" })

describe("Store Edit Functionality", () => {
    let wrapper
   
    beforeEach(() => {
        wrapper = shallowMount( {
            router,
            localVue,
            store,
            propsData: {
                name: 'Some Course',
                step: "1",
                rename: "neu",
                oldName: "alt"
                //course: mockCourse
            }
        })
    })

    it( "has a Store", () => {
        console.log(wrapper)
        assert.isOk(wrapper.$vm)
        

    })

})