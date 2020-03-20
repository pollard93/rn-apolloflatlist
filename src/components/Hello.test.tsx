import React from 'react';
import { Text } from 'react-native';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { Hello } from './Hello';

describe('Hello tests', () => {
  it('renders Hello', () => {
    const wrapper = shallow(<Hello content="Hello" />);
    expect(wrapper.contains(<Text>Hello</Text>)).to.be.true;
  });
});
