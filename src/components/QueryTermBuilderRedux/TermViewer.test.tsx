import {
  render as reactRender,
  act,
  cleanup,
  fireEvent,
  within,
} from '@testing-library/react';

import { render as myRender  } from './test-util';
import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { TermViewer } from './TermViewer';
type RenderType = typeof reactRender;
const render: RenderType = myRender;

describe('TermViewer', ()=>{
  afterEach(() => {
    cleanup();
  });
  it('Should set label to "All of" for $and', () => {
    act(() => {
      setupRender({
        junctionOperator: '$and',
        labelMaker: () => {},
      });
    });
    expect(screen.getByText('All of')).toBeInTheDocument();
  });
});

// ------------------------------ helpers

type PropertyObject = { [propName: string]: any };

const setupRender = (focusProps: PropertyObject = {}) => {
  const defaultProps = {};

  const effectiveProps = {
    ...defaultProps,
    ...focusProps,
  } as PropertyObject;

  Object.keys(focusProps).forEach((propName) => {
    if (focusProps[propName] === null) {
      delete effectiveProps[propName];
    }
  });

  //@ts-ignore
  return render(<TermViewer {...effectiveProps} />, {
    //@ts-ignore 
    initialState: { queryNodes: { entities: {}, ids: [] } },
  });
};
