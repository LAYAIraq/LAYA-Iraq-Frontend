# laya-vechta-frontend

This is the repository for LAYA. Here, we continue developing new features for the inclusive learning platform.

This repository also provides containers for deploying LAYA to production.

## Deploying the project

There are two ways to deploy LAYA:

- deploying to a server directly 
- deploying in a Docker container

In both cases, you can set the backend URL on which the [LAYA Backend](https://gitlab.informatik.hu-berlin.de/laya/vechta/laya-vechta-backend) runs. By default, it is set to `/api` on the same location. Make sure to have your server set up to accept HTTP requests at this address.

If you want to set an individual URL, you need to add a `.env` file in the root folder of the project. It takes three arguments:

- `VUE_APP_BACKEND_HOST`: the host where the back end is running. Omit to default to 
  same location as the front end
- `VUE_APP_BACKEND_PORT`: the port on which the backend is listening. Omit to default port (80 for HTTP, 443 for HTTPS)
- `VUE_APP_BACKEND_ROOT`: the location at which the back end accepts HTTP requests. Needs to include the slash at the beginning (e.g. `/requests`). Omit to default to `/api`
- `VUE_APP_MAX_FILE_SIZE`: the maximum amount of bytes for file upload. Defaults to 
  500000000

### Server
In order to deploy to a server, you need to have node installed (version 16). Clone the repository and run `npm install`. Set the environment file if your back end is running anywhere else than `/api`.

The run `npm run build`. The project will be built in the `dist` directory. You can 
then copy the content of that directory to the root directory of your 
web server.

### Docker

You need Docker to build the Docker image. Set the environment variables for the back end URL if neccessary. Then run `docker build -t laya-frontend .` to build the Docker container locally.

In order to run the Container on your server, run `docker run -td -p 8000:80 laya-frontend` on your server. `8000` is the port at which your host will serve LAYA. You can modify it for your needs. For an SSL secured connection, you will need to set up a reverse proxy.

## Developers

### Basic Setup
#### Project setup
```
npm install
```

#### Compiles and hot-reloads for development
```
npm run serve
```

#### Compiles and minifies for production
```
npm run build
```

#### Run your tests
```
npm run test
```

#### Lints and fixes files
```
npm run lint:fix
```

### Unit Tests

#### Design Philosophy
As much as developers like to think about certain implementation details, 
we want to test behavior for users of LAYA. Therefore, tests should be designed
with the actual component in mind. However, many of the conditional renders
we use in LAYA might need to be tested by used the component state. We would
therefore encourage writing tests that use the component's internal state 
over not writing a test.

#### Tech stack

We use `vue-test-utils` with Jest for unit testing. Because Jest version `=> 27`
did not work for our project, we keep using version `26` for now. 

Necessary packages:
- `@babel/preset-env`    
- `@types/jest`
- `@vue/cli-plugin-unit-jest`
- `@vue/test-utils`
- `babel-core`: use version `@bridge`
- `babel-jest`: use version `@26`
- `lodash.clonedeep`: for store module tests
- `jsdom-global`
- `regenerator-runtime`
- `ts-jest`: use version `@26`
- `vue-jest`

#### Setup

In order for the test suites to recognize `.vue` files 
as modules, we need `shims-vue.d.ts` in the `./src` directory
of our project. It needs to contain the following lines:

``` typescript
declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}
```

We configure Jest to with the following `jest.config.js` (placed in root directory):

``` javascript
module.exports = {
  moduleFileExtensions: [
    'js',
    'json',
    'vue',
    'ts'
  ],

  moduleNameMapper: {
    '/^@\/(.*)$/': '<rootDir>/src/$1'
  },

  resolver: null,
  rootDir: './',

  transform: {
    '.*\\.(js)$': 'babel-jest',
    '.*\\.(ts)$': 'ts-jest',
    '.*\\.(vue)$': 'vue-jest'
  },

  preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel',
  testEnvironment: 'jsdom'
}
```

This config allows us to import webpack-style using `@/` to refer to `./src`. 
It also sets Jest to use JSDOM as a testing environment. Furthermore, 
the different jest frameworks handle their corresponding file extensions. 

#### Running Tests

We place our unit tests in `./tests/unit`. They should have `.spec.ts` extension
to be recognized by `vue-test-utils`. In order to run the tests, you can either run 
`npm run test` or `npm run test:unit` (they are synonymous) to run all test suites.
If you want to run just selected tests, you can use `npm run test:only THIS` where 
`THIS` is a regular expression. Spaces work like pipes (OR). Use this to
match the file name before `.spec.ts` to only run those matching files.

Example: `npm run test:only course flag` runs all test suites that contain `course`
or `flag` anywhere in their name.

#### Test Structure
##### mount vs. shallowMount
`vue-test-utils` provides two different mounting methods for vue components.
`mount` renders the component including the children, whereas `shallowMount`
stubs children. We shall only prefer to use  `shallowMount` to test components. 
However, since we use `BootstrapVue`, it is necessary to use `mount` for some
components in order to test the actual behavior (e.g. when using `b-button`s)

##### Mocking vuex
For components that use vuex, we can mock the store with only the properties
that we need. Further information in 
[vue-test-utils docs](https://v1.test-utils.vuejs.org/guides/#mocking-getters).

#### Code Style
We would like to maintain a consistent style throughout the project. Therefore,
we also enforce it on testing code. To check, run `npm run lint:tests`, for 
automatic fixes run `npm run lint:tests-fix`.

### `async` tests
Many of the unit tests will need to test DOM changes. Therefore, we need the test
to be asynchronous. While user interactions that result in a DOM change can be
`awaited`, methods that return promises might need an extra step of awaiting the
next tick on the Vue instance.

### Bootstrap Components
Many of our components use Bootstrap components. When a tested component is using them
(indicated by the `b-` snippet, e.g. `<b-button>`), we need to mount BootstrapVue to
our test wrapper (see [mount vs. shallowMount](#mount-vs-shallowmount)). When using
BModals, make sure the modal container has the `static` property. This ensures the modal
is rendered within the component container, not the global `<body>`, allowing us to
test the modal via `wrapper.find()` (see [BootstrapVue docs](https://bootstrap-vue.org/docs/components/modal#overview))
for reference).

### Sample Test

``` typescript
import 'regenerator-runtime/runtime' /// used for implementing async behavior
import { createLocalVue, mount } from '@vue/test-utils' // minimal setup
import CourseDelete from '@/views/course-edit-tools/course-delete.vue'
import Vuex from 'vuex'
import { BootstrapVue } from 'bootstrap-vue'

const localVue = createLocalVue() // setting up local vue instance
localVue.use(Vuex)
localVue.use(BootstrapVue)

describe('Course delete', () => {
  let getters
  let actions
  let mutations
  let wrapper
  let button
  let modalButtons
  beforeEach(() => {
    getters = {
      profileLang: () => 'en', // necessary in every component for rendering
      course: () => {
        return {
          courseId: 'test'
        }
      }
    }
    actions = {
      deleteCourse: jest.fn(() => { // simple mock for store action
        return Promise.resolve()
      })
    }
    mutations = {
      removeFromCourseList: jest.fn()
    }
    const store = new Vuex.Store({ // mock store for local Vue instance
      getters,
      mutations,
      actions
    })
    wrapper = mount(
      CourseDelete, {
        mocks: {
          $router: { // mock for Vue router
            push: jest.fn()
          }
        },
        store,
        localVue
      }
    )
    button = wrapper.findComponent('button')
  })

  it('prompts a modal when clicking button', async () => {
    expect(button.exists()).toBeTruthy()
    await button.trigger('click') // note the await keyword
    const modal = wrapper.find('#author-del-course-confirm')
    expect(modal.exists()).toBeTruthy()
    modalButtons = wrapper.findAll('button')
    expect(modalButtons.length).toBe(4)
  })

  it('calls all store methods when clickling ok', async () => {
    await button.trigger('click')
    modalButtons = wrapper.findAll('button')
    modalButtons.wrappers.forEach(wrap => {
      if (wrap.text() === 'Delete') {
        button = wrap
      }
    })
    await button.trigger('click')
    expect(actions.deleteCourse).toHaveBeenCalled()
    expect(mutations.removeFromCourseList).toHaveBeenCalled()
    expect(wrapper.vm.$router.push).toHaveBeenCalledWith('/courses')
    // expect(vm.$router.push).toHaveBeenCalled()
  })
})

describe('test for full branch coverage', () => {
  it('prompts error log when store returns rejection', async () => {
    const getters = {
      profileLang: () => 'en',
      course: () => {
        return {
          courseId: 'test'
        }
      }
    }
    const actions = {
      deleteCourse: jest.fn(() => {
        return Promise.reject(new Error('err!'))
      })
    }
    const mutations = {
      removeFromCourseList: jest.fn()
    }
    const store = new Vuex.Store({
      getters,
      mutations,
      actions
    })
    const wrapper = mount(CourseDelete, {
      mocks: {
        $router: {
          push: jest.fn()
        }
      },
      store,
      localVue
    })
    let button = wrapper.find('button')
    console.error = jest.fn()
    await button.trigger('click')
    const modalButtons = wrapper.findAll('button')
    modalButtons.wrappers.forEach(wrap => {
      if (wrap.text() === 'Delete') {
        button = wrap
      }
    })
    await button.trigger('click')
    await localVue.nextTick()
    expect(actions.deleteCourse).toHaveBeenCalled()
    expect(console.error).toHaveBeenCalledWith('ERROR:', expect.any(Error))
  })
})
```
