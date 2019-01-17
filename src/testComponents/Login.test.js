import { shallowMount } from '@vue/test-utils'
import Component from '../components/Login.vue'


let wrapper = null
//the path of the wrapper component
const $route = { path: 'localhost:8080/signIn' }
beforeEach(() => {
  wrapper = shallowMount(Component, {
    mocks: {
      $route
    }
  });
});

afterEach(() => {
  //destroy the wrapper component
  wrapper.destroy()
});

describe("Login component", () => {
  //check if the component renders correctly
  it("renders correctly", () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  //check if the component has the correct path
  it("correct path", function(){
    expect(wrapper.vm.$route.path).toBe($route.path);
  });

  //check if the user pressed the login button return error when the input fields are empty
  it("login button work", function(){
    const button = wrapper.find("button");
    button.trigger("click");
    expect(wrapper.vm.validUser).toBe(false);
  });

  //check if the v-model directives of email field works
  it("email input field work", function(){
    const emailField = wrapper.find("input[type='text']");
    emailField.setValue("pippo");
    expect(wrapper.vm.user.email).toBe("pippo");
  });

  //check if the v-model directives of password field works
  it("password input field work", function(){
    const passwordField = wrapper.find("input[type='password']");
    passwordField.setValue("pippo");
    expect(wrapper.vm.user.password).toBe("pippo");
  });


});
