import React from 'react';
import { render } from '@testing-library/react';

import SessionDetails from './SessionDetails';
// import { SessionInfoFragment } from '../../generated/graphql';

describe('SessionDetails', () => {
  it.skip('renders loading', () => {
    // const { getByText } = render(
    //   <SessionDetails sessie={undefined} showAll={true} sessionLoading={true}></SessionDetails>,
    // );
    // getByText('Gegevens laden...');
  });

  // it('renders ', () => {
  //   const session: SessionInfoFragment = {
  //     CursusID: 1,
  //     SessieID: 2,
  //     SessieType: 'sessionType',
  //     Datum: new Date(2021, 0, 1),
  //     DatumBegintijd: '12:00',
  //     DatumEindtijd: '13:00',
  //   };
  //   const { container, getByText } = render(
  //     <SessionDetails sessie={session} showAll={true} sessionLoading={false}></SessionDetails>,
  //   );

  //   getByText('sessionType');
  //   // getByLabelText('Promotietekst');
  //   // debug();
  //   expect(
  //     container.querySelector('[data-testid="sessieType"] .form-control-static')?.textContent,
  //   ).toBe('sessionType');
  // });
});
