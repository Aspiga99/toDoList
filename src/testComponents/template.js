import { shallowMount } from '@vue/test-utils'

let wrapper = null
const $route = { path: 'localhost:8080/' }
beforeEach(() => {
  wrapper = shallowMount(Component, {
    mocks: {
      $route
    }
  });
});

afterEach(() => {
  wrapper.destroy()
});

describe("Component", () => {
  it("renders correctly", () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("correct path", function(){
    expect(wrapper.vm.$route.path).toBe($route.path);
  });
});
