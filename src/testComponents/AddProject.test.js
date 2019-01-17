import { mount } from '@vue/test-utils'
import Component from '../components/addProject.vue'
import Vue from "vue"

describe("Component", () => {
  it("renders correctly", () => {
    const comp = mount(Component);
    expect(comp.html()).toMatchSnapshot();
  });
});
