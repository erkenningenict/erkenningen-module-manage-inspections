import React from 'react';
import { renderWithRouter } from '../../test-utils/render-with-router';
import InspectionDetails from './InspectionDetails';
import { MockedProvider } from '@apollo/client/testing';
import { Route } from 'react-router-dom';
import { GetMyDocument, GetVisitationDocument } from '../../generated/graphql';

const mockInspector112 = {
  request: {
    query: GetMyDocument,
    variables: {},
  },
  result: {
    data: {
      my: {
        Roles: ['Registered Users', 'Inspecteur', 'Beoordelaar'],
        Persoon: { PersoonID: 112, __typename: 'Persoon' },
        __typename: 'My',
      },
    },
  },
};
const mockRector = {
  request: {
    query: GetMyDocument,
    variables: {},
  },
  result: {
    data: {
      my: {
        Roles: ['Registered Users', 'Rector', 'Beoordelaar'],
        Persoon: { PersoonID: 109, __typename: 'Persoon' },
        __typename: 'My',
      },
    },
  },
};

const mockVisitationWithRatingsAndStatusIngediend = {
  request: {
    query: GetVisitationDocument,
    variables: {
      input: { visitatieId: 1 },
    },
  },
  result: {
    data: {
      Visitation: {
        VisitatieID: 8708,
        SessieID: 67979,
        Sessie: { SessieType: '', __typename: 'Sessie' },
        DatumVisitatie: '2021-02-09T23:00:00.000Z',
        DatumRapport: '2021-04-15T22:00:00.000Z',
        Rapportcijfer: 10,
        Rapport: '<p>Is de doelstelling bereikt: Ja1<br />Aantal deelnemers: Test<br /></p>',
        VragenJson:
          '{"meta":{"version":"0.9"},"questions":[{"question":"Is de doelstelling bereikt:","answer":"Ja1"},{"question":"Aantal deelnemers","answer":"Test"}]}',
        Status: 'Ingediend',
        VolgensIntentieAanbod: true,
        PersoonID: 112,
        Inspecteur: { SortableFullName: 'Schott, G.', __typename: 'Persoon' },
        DiscussieVisitaties: [
          {
            DiscussieVisitatieID: 358,
            PersoonID: 112,
            Commentaar: '12',
            DatumTijd: '2021-04-02T21:16:44.897Z',
            IsAuteurVakgroep: false,
            IsAuteurInspecteur: true,
            Persoon: { SortableFullName: 'Schott, G.', __typename: 'Persoon' },
            __typename: 'DiscussieVisitatie',
          },
          {
            DiscussieVisitatieID: 359,
            PersoonID: 112,
            Commentaar: 'Nog meer commentaar',
            DatumTijd: '2021-04-16T07:59:17.820Z',
            IsAuteurVakgroep: false,
            IsAuteurInspecteur: true,
            Persoon: { SortableFullName: 'Schott, G.', __typename: 'Persoon' },
            __typename: 'DiscussieVisitatie',
          },
        ],
        VisitatieBeoordelingCategorieen: [
          {
            VisitatieBeoordelingCategorieID: '2F6D8B19-0BE3-432E-B176-13065B52CDD0',
            VisitatieID: 8708,
            CategorieTemplateID: 100,
            CategorieNaam: 'Uitvoering van doel en inhoud',
            Weging: 50,
            TotaalPunten: 46.5,
            Cijfer: 9.3,
            Versie: '1',
            VanafDatum: '2021-03-29T22:00:00.000Z',
            Vragen: [
              {
                VisitatieBeoordelingCategorieVraagID: 'DEE57669-08D8-4E28-9CCD-6C58FAFDA498',
                VisitatieBeoordelingCategorieID: '2F6D8B19-0BE3-432E-B176-13065B52CDD0',
                CategorieTemplateID: 100,
                VraagTemplateID: 1001,
                Naam: 'Beginsituatie deelnemers nagegaan',
                Weging: 5,
                TotaalPunten: 1.5,
                Cijfer: 3,
                Toelichting: 'Beginsituatie is nagegaan ja.',
                Versie: '1',
                VanafDatum: '2021-03-29T22:00:00.000Z',
                __typename: 'VisitatieBeoordelingCategorieVraag',
              },
              {
                VisitatieBeoordelingCategorieVraagID: 'F4B00E4F-1242-4EE3-8670-65DFC650551A',
                VisitatieBeoordelingCategorieID: '2F6D8B19-0BE3-432E-B176-13065B52CDD0',
                CategorieTemplateID: 100,
                VraagTemplateID: 1002,
                Naam: 'Op- en aanmerkingen beoordelaar verwerkt',
                Weging: 7,
                TotaalPunten: 7,
                Cijfer: 10,
                Toelichting: '',
                Versie: '1',
                VanafDatum: '2021-03-29T22:00:00.000Z',
                __typename: 'VisitatieBeoordelingCategorieVraag',
              },
              {
                VisitatieBeoordelingCategorieVraagID: '8E92695E-5267-4470-BE4E-2009F20AD3DF',
                VisitatieBeoordelingCategorieID: '2F6D8B19-0BE3-432E-B176-13065B52CDD0',
                CategorieTemplateID: 100,
                VraagTemplateID: 1003,
                Naam: 'Doelstelling behaald',
                Weging: 13,
                TotaalPunten: 13,
                Cijfer: 10,
                Toelichting: '',
                Versie: '1',
                VanafDatum: '2021-03-29T22:00:00.000Z',
                __typename: 'VisitatieBeoordelingCategorieVraag',
              },
              {
                VisitatieBeoordelingCategorieVraagID: 'CA617F12-755A-447B-8033-A3E11F4B6478',
                VisitatieBeoordelingCategorieID: '2F6D8B19-0BE3-432E-B176-13065B52CDD0',
                CategorieTemplateID: 100,
                VraagTemplateID: 1004,
                Naam: 'Voorgenomen inhoud behandeld, event. incl thuisopdracht',
                Weging: 25,
                TotaalPunten: 25,
                Cijfer: 10,
                Toelichting: '',
                Versie: '1',
                VanafDatum: '2021-03-29T22:00:00.000Z',
                __typename: 'VisitatieBeoordelingCategorieVraag',
              },
            ],
            __typename: 'VisitatieBeoordelingCategorie',
          },
          {
            VisitatieBeoordelingCategorieID: '12B9FDD6-877D-4BA7-8A14-CB1DC07255DB',
            VisitatieID: 8708,
            CategorieTemplateID: 200,
            CategorieNaam: 'Aanpak',
            Weging: 30,
            TotaalPunten: 30,
            Cijfer: 10,
            Versie: '1',
            VanafDatum: '2021-03-29T22:00:00.000Z',
            Vragen: [
              {
                VisitatieBeoordelingCategorieVraagID: '08DFBD62-2DF4-49D6-9584-5BABD28E9A51',
                VisitatieBeoordelingCategorieID: '12B9FDD6-877D-4BA7-8A14-CB1DC07255DB',
                CategorieTemplateID: 200,
                VraagTemplateID: 2001,
                Naam: 'Werkwijze als gepland toegepast',
                Weging: 10,
                TotaalPunten: 10,
                Cijfer: 10,
                Toelichting: '',
                Versie: '1',
                VanafDatum: '2021-03-29T22:00:00.000Z',
                __typename: 'VisitatieBeoordelingCategorieVraag',
              },
              {
                VisitatieBeoordelingCategorieVraagID: '4F8F79EE-A08E-428B-9148-7A22E90389DE',
                VisitatieBeoordelingCategorieID: '12B9FDD6-877D-4BA7-8A14-CB1DC07255DB',
                CategorieTemplateID: 200,
                VraagTemplateID: 2002,
                Naam: 'Deelnemers actief betrokken',
                Weging: 10,
                TotaalPunten: 10,
                Cijfer: 10,
                Toelichting: '',
                Versie: '1',
                VanafDatum: '2021-03-29T22:00:00.000Z',
                __typename: 'VisitatieBeoordelingCategorieVraag',
              },
              {
                VisitatieBeoordelingCategorieVraagID: '7F2CDFB1-C37E-45B3-8729-598019397B8F',
                VisitatieBeoordelingCategorieID: '12B9FDD6-877D-4BA7-8A14-CB1DC07255DB',
                CategorieTemplateID: 200,
                VraagTemplateID: 2003,
                Naam: 'Deelnemers delen kennis en info',
                Weging: 10,
                TotaalPunten: 10,
                Cijfer: 10,
                Toelichting: '',
                Versie: '1',
                VanafDatum: '2021-03-29T22:00:00.000Z',
                __typename: 'VisitatieBeoordelingCategorieVraag',
              },
            ],
            __typename: 'VisitatieBeoordelingCategorie',
          },
          {
            VisitatieBeoordelingCategorieID: 'C87122DC-4F2B-4801-A5CD-1C80DDBBF2CC',
            VisitatieID: 8708,
            CategorieTemplateID: 300,
            CategorieNaam: 'Organisatie',
            Weging: 20,
            TotaalPunten: 18.5,
            Cijfer: 9.3,
            Versie: '1',
            VanafDatum: '2021-03-29T22:00:00.000Z',
            Vragen: [
              {
                VisitatieBeoordelingCategorieVraagID: '8F2AE29F-AE20-4960-B9B4-EFDAA1AACBA3',
                VisitatieBeoordelingCategorieID: 'C87122DC-4F2B-4801-A5CD-1C80DDBBF2CC',
                CategorieTemplateID: 300,
                VraagTemplateID: 3001,
                Naam: 'Samenvatting uitgereikt',
                Weging: 5,
                TotaalPunten: 5,
                Cijfer: 10,
                Toelichting: '',
                Versie: '1',
                VanafDatum: '2021-03-29T22:00:00.000Z',
                __typename: 'VisitatieBeoordelingCategorieVraag',
              },
              {
                VisitatieBeoordelingCategorieVraagID: '38808388-C972-4E5E-8BEA-E8595983F2EA',
                VisitatieBeoordelingCategorieID: 'C87122DC-4F2B-4801-A5CD-1C80DDBBF2CC',
                CategorieTemplateID: 300,
                VraagTemplateID: 3002,
                Naam: 'Inhoudelijk en organisatorisch geëvalueerd',
                Weging: 5,
                TotaalPunten: 5,
                Cijfer: 10,
                Toelichting: '',
                Versie: '1',
                VanafDatum: '2021-03-29T22:00:00.000Z',
                __typename: 'VisitatieBeoordelingCategorieVraag',
              },
              {
                VisitatieBeoordelingCategorieVraagID: 'AAF7DCD5-4EC5-4F11-8CBA-F31324C38ABA',
                VisitatieBeoordelingCategorieID: 'C87122DC-4F2B-4801-A5CD-1C80DDBBF2CC',
                CategorieTemplateID: 300,
                VraagTemplateID: 3003,
                Naam: 'Groepsgrootte als gepland',
                Weging: 5,
                TotaalPunten: 5,
                Cijfer: 10,
                Toelichting: '',
                Versie: '1',
                VanafDatum: '2021-03-29T22:00:00.000Z',
                __typename: 'VisitatieBeoordelingCategorieVraag',
              },
              {
                VisitatieBeoordelingCategorieVraagID: '360C283A-F33C-4204-B7DF-E7869086754A',
                VisitatieBeoordelingCategorieID: 'C87122DC-4F2B-4801-A5CD-1C80DDBBF2CC',
                CategorieTemplateID: 300,
                VraagTemplateID: 3004,
                Naam: 'Localiteit en (digi)techniek adequaat',
                Weging: 5,
                TotaalPunten: 3.5,
                Cijfer: 7,
                Toelichting: '',
                Versie: '1',
                VanafDatum: '2021-03-29T22:00:00.000Z',
                __typename: 'VisitatieBeoordelingCategorieVraag',
              },
            ],
            __typename: 'VisitatieBeoordelingCategorie',
          },
        ],
        __typename: 'Visitatie',
      },
    },
  },
};

const mockVisitationWithoutRatingsAndStatusIngediend = {
  request: {
    query: GetVisitationDocument,
    variables: {
      input: { visitatieId: 1 },
    },
  },
  result: {
    data: {
      Visitation: {
        VisitatieID: 8708,
        SessieID: 67979,
        Sessie: { SessieType: '', __typename: 'Sessie' },
        DatumVisitatie: '2021-02-09T23:00:00.000Z',
        DatumRapport: '2021-04-15T22:00:00.000Z',
        Rapportcijfer: 10,
        Rapport: '<p>Is de doelstelling bereikt: Ja1<br />Aantal deelnemers: Test<br /></p>',
        VragenJson:
          '{"meta":{"version":"0.9"},"questions":[{"question":"Is de doelstelling bereikt:","answer":"Ja1"},{"question":"Aantal deelnemers","answer":"Test"}]}',
        Status: 'Ingediend',
        VolgensIntentieAanbod: true,
        PersoonID: 112,
        Inspecteur: { SortableFullName: 'Schott, G.', __typename: 'Persoon' },
        DiscussieVisitaties: [
          {
            DiscussieVisitatieID: 358,
            PersoonID: 112,
            Commentaar: '12',
            DatumTijd: '2021-04-02T21:16:44.897Z',
            IsAuteurVakgroep: false,
            IsAuteurInspecteur: true,
            Persoon: { SortableFullName: 'Schott, G.', __typename: 'Persoon' },
            __typename: 'DiscussieVisitatie',
          },
        ],
        VisitatieBeoordelingCategorieen: [],
        __typename: 'Visitatie',
      },
    },
  },
};

describe('InspectionDetails', () => {
  it('should show ratings for status Ingediend and Inspecteur', async () => {
    window.history.pushState({}, 'T', '/details/1/2');
    const { getByText } = renderWithRouter(
      <Route path="/details/:visitatieId/:sessieId">
        <MockedProvider
          mocks={[mockInspector112, mockVisitationWithRatingsAndStatusIngediend]}
          addTypename={false}
        >
          <InspectionDetails />
        </MockedProvider>
      </Route>,
      { route: 'details/1/2' },
    );
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(getByText(/INSPECTIERAPPORT BEKIJKEN/i)).toBeInTheDocument();
    expect(getByText(/Versie 0\.9/i)).toBeInTheDocument();
    expect(getByText(/Vragen/i)).toBeInTheDocument();
  });

  it('should not show ratings for status Ingediend and Inspecteur if ratings are not supplied', async () => {
    window.history.pushState({}, 'T', '/details/1/2');
    const { queryByText } = renderWithRouter(
      <Route path="/details/:visitatieId/:sessieId">
        <MockedProvider
          mocks={[mockRector, mockVisitationWithoutRatingsAndStatusIngediend]}
          addTypename={false}
        >
          <InspectionDetails />
        </MockedProvider>
      </Route>,
      { route: 'details/1/2' },
    );
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(queryByText(/INSPECTIERAPPORT BEKIJKEN/i)).not.toBeInTheDocument();
  });

  // it.todo('should ')
});
