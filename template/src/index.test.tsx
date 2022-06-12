import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import Component from './component';

describe('<Component />', () => {
  it('render Foo with dumi', () => {
    const msg = 'dumi';

    render(<Component />);
    expect(screen.queryByText(msg)).toBeInTheDocument();
  });
});
