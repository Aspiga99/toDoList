import Component from '../components/Register.vue'
import { shallowMount } from '@vue/test-utils'

let wrapper = null;

beforeEach(() => {
  wrapper = shallowMount(Component, {
    propsData:{
      testing: true
    }
  });
});

afterEach(() => {
  //destroy the wrapper component
  wrapper.destroy();
});

describe("Register component", () => {
  //check if the component renders correctly
  it("renders correctly", () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  //check if user.name is corretly bind to input field value
  it("name is corretly bind to input field value", function(){
    const inputField = wrapper.findAll("input[type='text']").at(0);
    inputField.setValue("pippo");
    expect(wrapper.vm.user.name).toBe("pippo");
  });

  //check if user.surname is corretly bind to input field value
  it("surname is corretly bind to input field value", function(){
    const inputField = wrapper.findAll("input[type='text']").at(1);
    inputField.setValue("pippo");
    expect(wrapper.vm.user.surname).toBe("pippo");
  });

  //check if user.email is corretly bind to input field value
  it("email is corretly bind to input field value", function(){
    const inputField = wrapper.findAll("input[type='text']").at(2);
    inputField.setValue("pippo@p.com");
    expect(wrapper.vm.user.email).toBe("pippo@p.com");
  });

  //check if user.password is corretly bind to input field value
  it("password is corretly bind to input field value", function(){
    const inputField = wrapper.findAll("input[type='password']").at(0);
    inputField.setValue("pippo");
    expect(wrapper.vm.user.password).toBe("pippo");
  });

  //check if re-entered password is corretly bind to input field value
  it("re-entered password is corretly bind to input field value", function(){
    const inputField = wrapper.findAll("input[type='password']").at(1);
    inputField.setValue("pippo");
    expect(wrapper.vm.passwordReEntered).toBe("pippo");
  });

  //check if checkEmail method works with correct email
  it("checkEmail method return true with valid email", function(){
    expect(wrapper.vm.checkEmail("pippo@p.com")).toBe(true);
  });

  //check if checkEmail method works with bad email
  it("checkEmail method return false with bad email", function(){
    expect(wrapper.vm.checkEmail("pippo")).toBe(false);
  });

  //check if analysePassword method works
  it("analysePassword method return true with valid password", function(){
    wrapper.vm.validPassword = wrapper.vm.analysePassword("bg4CpkdA_J7;gxa%");
    expect(wrapper.vm.validPassword).toBe(true);
  });

  //check if analysePassword method works
  it("analysePassword method return false with bad password", function(){
    wrapper.vm.validPassword = wrapper.vm.analysePassword("6`?sN");
    expect(wrapper.vm.validPassword).toBe(false);
  });

  //check if createuser method works
  it("createUser method with valid data works", function(){
    wrapper.vm.user.email = "pippo@p.com";
    wrapper.vm.user.password = "pippopSw1";
    wrapper.vm.passwordReEntered = "pippopSw1";
    wrapper.vm.user.name = "pippo";
    wrapper.vm.user.surname = "pip";
    wrapper.vm.validEmail = wrapper.vm.checkEmail(wrapper.vm.user.email);
    wrapper.vm.validPassword = wrapper.vm.analysePassword(wrapper.vm.user.password);
    wrapper.vm.equalPassword = wrapper.vm.checkIfEqualString(wrapper.vm.user.password, wrapper.vm.passwordReEntered);
    wrapper.vm.emptyFields = false;
    const button = wrapper.find("button");
    button.trigger("click");
    console.log("createUser method with valid data \n valid data: " + wrapper.vm.validData);
    expect(wrapper.vm.validData).toBe(true);
  });

  //check if createuser method works
  it("createUser method with not valid data works", function(){
    wrapper.vm.user.email = "po@.com";
    wrapper.vm.user.password = "pippopSw1";
    wrapper.vm.passwordReEntered = "pippopSw1";
    wrapper.vm.user.name = "pippo";
    wrapper.vm.user.surname = "pip";
    wrapper.vm.validEmail = wrapper.vm.checkEmail(wrapper.vm.user.email);
    wrapper.vm.validPassword = wrapper.vm.analysePassword(wrapper.vm.user.password);
    wrapper.vm.equalPassword = wrapper.vm.checkIfEqualString(wrapper.vm.user.password, wrapper.vm.passwordReEntered);
    wrapper.vm.emptyFields = false;
    const button = wrapper.find("button");
    button.trigger("click");
    console.log("createUser method with not valid data \n valid data: " + wrapper.vm.validData);
    expect(wrapper.vm.validData).toBe(false);
  });

});
