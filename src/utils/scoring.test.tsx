import { VisitatieBeoordelingCategorie } from '../generated/graphql';
import { getScores } from './scoring';

describe('scorings', () => {
  describe('getScorings', () => {
    it('should return undefined', () => {
      const res = getScores(undefined);

      expect(res).toEqual(undefined);
    });

    it('should negative for incomplete', () => {
      const ratings: VisitatieBeoordelingCategorie[] = [
        {
          CategorieNaam: 'Aanpak',
          DatumAangemaakt: new Date(),
          TotaalPunten: 0,
          Weging: 0,
          Cijfer: 0,
          Vragen: [],
          Versie: '1',
          VisitatieID: 0,
          VisitatieBeoordelingCategorieID: '1',
          CategorieTemplateID: 1,
          AangemaaktDoor: '',
          DatumGewijzigd: new Date(),
          GewijzigdDoor: '',
          VanafDatum: new Date(),
        },
      ];
      const res = getScores(ratings);

      expect(res).toEqual({ RapportCijfer: 2, VolgensIntentieAanbod: false });
    });

    it('should not intended = false', () => {
      const ratings: VisitatieBeoordelingCategorie[] = [
        {
          CategorieNaam: 'Uitvoering van doel en inhoud',
          CategorieTemplateID: 1,
          DatumAangemaakt: new Date(),
          TotaalPunten: 0,
          Weging: 0,
          Cijfer: 0,
          Vragen: [
            {
              CategorieTemplateID: 1,
              VraagTemplateID: 1001,
              VisitatieBeoordelingCategorieVraagID: '1',
              VisitatieBeoordelingCategorieID: '1',
              Weging: 0,
              DatumAangemaakt: new Date(),
              Naam: 'Doelstelling behaald',
              Cijfer: 2,
              TotaalPunten: 2,
              Versie: '1',
              AangemaaktDoor: '',
              DatumGewijzigd: new Date(),
              GewijzigdDoor: '',
              VanafDatum: new Date(),
            },
            {
              CategorieTemplateID: 1,
              VraagTemplateID: 1002,
              VisitatieBeoordelingCategorieVraagID: '1',
              VisitatieBeoordelingCategorieID: '1',
              Weging: 0,
              DatumAangemaakt: new Date(),
              Naam: 'Voorgenomen inhoud behandeld, event. incl thuisopdracht',
              Cijfer: 2,
              TotaalPunten: 2,
              Versie: '1',
              AangemaaktDoor: '',
              DatumGewijzigd: new Date(),
              GewijzigdDoor: '',
              VanafDatum: new Date(),
            },
          ],
          Versie: '1',
          VisitatieID: 0,
          VisitatieBeoordelingCategorieID: '1',
          AangemaaktDoor: '',
          DatumGewijzigd: new Date(),
          GewijzigdDoor: '',
          VanafDatum: new Date(),
        },
        {
          CategorieNaam: 'Aanpak',
          CategorieTemplateID: 2,
          DatumAangemaakt: new Date(),
          TotaalPunten: 0,
          Weging: 0,
          Cijfer: 0,
          Vragen: [
            {
              CategorieTemplateID: 2,
              VraagTemplateID: 2001,
              VisitatieBeoordelingCategorieVraagID: '2',
              VisitatieBeoordelingCategorieID: '2',
              Weging: 0,
              DatumAangemaakt: new Date(),
              Naam: 'Werkwijze als gepland toegepast',
              Cijfer: 2,
              TotaalPunten: 2,
              Versie: '1',
              AangemaaktDoor: '',
              DatumGewijzigd: new Date(),
              GewijzigdDoor: '',
              VanafDatum: new Date(),
            },
          ],
          Versie: '1',
          VisitatieID: 0,
          VisitatieBeoordelingCategorieID: '1',
          AangemaaktDoor: '',
          DatumGewijzigd: new Date(),
          GewijzigdDoor: '',
          VanafDatum: new Date(),
        },
      ];
      const res = getScores(ratings);

      expect(res).toEqual({ RapportCijfer: 2, VolgensIntentieAanbod: false });
    });
    it('should not intended = true', () => {
      const ratings: VisitatieBeoordelingCategorie[] = [
        {
          CategorieNaam: 'Uitvoering van doel en inhoud',
          CategorieTemplateID: 1,
          DatumAangemaakt: new Date(),
          TotaalPunten: 38,
          Weging: 50,
          Cijfer: 8,
          Vragen: [
            {
              CategorieTemplateID: 1,
              VraagTemplateID: 1001,
              VisitatieBeoordelingCategorieVraagID: '1',
              VisitatieBeoordelingCategorieID: '2',
              Weging: 13,
              DatumAangemaakt: new Date(),
              Naam: 'Doelstelling behaald',
              Cijfer: 10,
              TotaalPunten: 13,
              Versie: '1',
              AangemaaktDoor: '',
              DatumGewijzigd: new Date(),
              GewijzigdDoor: '',
              VanafDatum: new Date(),
            },
            {
              CategorieTemplateID: 1,
              VraagTemplateID: 1002,
              VisitatieBeoordelingCategorieVraagID: '1',
              VisitatieBeoordelingCategorieID: '2',
              Weging: 25,
              DatumAangemaakt: new Date(),
              Naam: 'Voorgenomen inhoud behandeld, event. incl thuisopdracht',
              Cijfer: 10,
              TotaalPunten: 25,
              Versie: '1',
              AangemaaktDoor: '',
              DatumGewijzigd: new Date(),
              GewijzigdDoor: '',
              VanafDatum: new Date(),
            },
          ],
          Versie: '1',
          VisitatieID: 0,
          VisitatieBeoordelingCategorieID: '1',
          AangemaaktDoor: '',
          DatumGewijzigd: new Date(),
          GewijzigdDoor: '',
          VanafDatum: new Date(),
        },
        {
          CategorieNaam: 'Aanpak',
          CategorieTemplateID: 2,
          DatumAangemaakt: new Date(),
          TotaalPunten: 10,
          Weging: 30,
          Cijfer: 10,
          Vragen: [
            {
              CategorieTemplateID: 2,
              VraagTemplateID: 2001,
              VisitatieBeoordelingCategorieVraagID: '1',
              VisitatieBeoordelingCategorieID: '2',
              Weging: 10,
              DatumAangemaakt: new Date(),
              Naam: 'Werkwijze als gepland toegepast',
              Cijfer: 10,
              TotaalPunten: 10,
              Versie: '1',
              AangemaaktDoor: '',
              DatumGewijzigd: new Date(),
              GewijzigdDoor: '',
              VanafDatum: new Date(),
            },
          ],
          Versie: '1',
          VisitatieID: 0,
          VisitatieBeoordelingCategorieID: '1',
          AangemaaktDoor: '',
          DatumGewijzigd: new Date(),
          GewijzigdDoor: '',
          VanafDatum: new Date(),
        },
      ];
      const res = getScores(ratings);

      expect(res).toEqual({ RapportCijfer: 4, VolgensIntentieAanbod: true });
    });
  });
});
