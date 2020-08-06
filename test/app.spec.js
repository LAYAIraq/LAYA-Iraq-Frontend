import courseFeedback from "@/plugins/laya-la-feedback/"
import { shallowMount, createLocalVue, mount } from "@vue/test-utils"
import chai, { expect } from "chai"
import sinon from "sinon"
import sinonChai from "sinon-chai"
import Vuex from "vuex"

chai.use(sinonChai)
const localVue = createLocalVue()
localVue.use(Vuex)

describe("CourseFeedback ", () => {
    let store;
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
    

    let component;
    const mockMethod = sinon.spy();
  
    beforeEach(() => {
      store = new Vuex.Store({
        auth,
        note,
        profile
      });
  
      component = mount(courseFeedback, {
        store,
        localVue
      });
    });
  
    describe("Test... ", () => {
        it("ist Vue-Instanz", () => {
            expect(component.isVueInstance()).to.be.true
        });
    });
    
  });