//imports for full functionality

import Laya from "../src/laya"
import router from "../src/router.js"
import store from "../src/store"
import Vuex from "vuex"
import Storage from "vue-ls"

//import components

import courseDetailView from "../src/views/course-detail.vue"

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

describe("Feedback Statistics", () => {
    let wrapper
    const mockCourse = {"name":"AAA","category":"BBB","abstract":null,"locked":false,"lastChanged":"2020-08-01T11:34:37.761Z","startDate":null,"endDate":null,"content":[{"name":"laya-course-feedback","input":{"title":"Kurs-Rückmeldung","task":"Dieser Kursbaustein dient dazu, Ihre Rückmeldung einzuholen. Wir arbeiten daran, unsere Kurse so verständlich und zugänglich wie möglich zu gestalten. Wir bitten Sie daher, Ihre Meinung zu unseren Inhalten und der Vermittlung mitzuteilen. Das Feedback ist anonym. Wenn Sie einverstanden sind, Rückfragen zu Ihrem Feedback zu erhalten, klicken Sie bitte den entsprechenden Button.","taskAudio":"","items":["Der Kurs ist klar strukturiert","Der Kurs ist inhaltlich interessant.","Das Niveau des Kurses war angemessen.","Ich fühlte mich an keiner Stelle unterfordert.","Ich fühlte mich an keiner Stelle überfordert.","Die Lernüberprüfungen haben zum Verständnis beigetragen.","Ich würde den Kurs weiterempfehlen."],"categories":["Stimme nicht zu","Stimme eher nicht zu","Neutral","Stimme eher zu","Stimme zu"]}}],"feedback":[{"fid":59390,"created":1596281684030,"choice":[1,4,2,1,2,2,2],"freetext":"KEKW²\n\nDeine Mama hahahahahah Hier ghtes?","options":{"questions":["Der Kurs ist klar strukturiert","Der Kurs ist inhaltlich interessant.","Das Niveau des Kurses war angemessen.","Ich fühlte mich an keiner Stelle unterfordert.","Ich fühlte mich an keiner Stelle überfordert.","Die Lernüberprüfungen haben zum Verständnis beigetragen.","Ich würde den Kurs weiterempfehlen."],"answers":["Stimme nicht zu","Stimme eher nicht zu","Neutral","Stimme eher zu","Stimme zu"]}},{"fid":244928,"created":1596281772803,"choice":[2,2,2,2,2,2,2],"freetext":"Ändere deine Wahl","options":{"questions":["Der Kurs ist klar strukturiert","Der Kurs ist inhaltlich interessant.","Das Niveau des Kurses war angemessen.","Ich fühlte mich an keiner Stelle unterfordert.","Ich fühlte mich an keiner Stelle überfordert.","Die Lernüberprüfungen haben zum Verständnis beigetragen.","Ich würde den Kurs weiterempfehlen."],"answers":["Stimme nicht zu","Stimme eher nicht zu","Neutral","Stimme eher zu","Stimme zu"]}},{"fid":1956415,"created":1596281896445,"choice":[2,2,2,2,2,2,2],"freetext":"HAHAH Neuer Test ich bin sehr zufrieden wenn Sie es hinbekämen alles gut zu machen ohne dass ich da noch was ändern muss.\n\nDanke und Tschüss. 2343434\n\nMfG","options":{"questions":["Der Kurs ist klar strukturiert","Der Kurs ist inhaltlich interessant.","Das Niveau des Kurses war angemessen.","Ich fühlte mich an keiner Stelle unterfordert.","Ich fühlte mich an keiner Stelle überfordert.","Die Lernüberprüfungen haben zum Verständnis beigetragen.","Ich würde den Kurs weiterempfehlen."],"answers":["Stimme nicht zu","Stimme eher nicht zu","Neutral","Stimme eher zu","Stimme zu"]}}],"authorId":1,"startInteractionId":null}
   
    beforeEach(() => {
        wrapper = shallowMount(courseDetailView, {
            router,
            localVue,
            store,
            propsData: {
                name: 'Some Course',
                step: "1"
                //course: mockCourse
            }
        })
    })

    it("is rendered", () => {
        //assert.isOk(fetchCourse)
        assert.isOk(mockCourse)
        wrapper.setData({course: mockCourse})
        assert.isOk(wrapper)
        //assert(wrapper.propsData.contains('name'))

    })
})