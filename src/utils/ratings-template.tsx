import {
  VisitatieBeoordelingCategorieInput,
  VisitatieBeoordelingCategorieVraagInput,
} from '../generated/graphql';
import { v4 as uuidv4 } from 'uuid';

export function getRatingsTemplate(visitatieId: number): VisitatieBeoordelingCategorieInput[] {
  const version = '1';
  const versionDate = new Date(2021, 3, 1);

  const newQuestion = (
    categoryTemplateId: number,
    categorieId: string,
    questionTemplateId: number,
    name: string,
    weighing: number,
  ): VisitatieBeoordelingCategorieVraagInput => {
    return {
      VisitatieBeoordelingCategorieVraagID: uuidv4().toUpperCase(),
      VisitatieBeoordelingCategorieID: categorieId,
      CategorieTemplateID: categoryTemplateId,
      VraagTemplateID: questionTemplateId,
      Naam: name,
      Weging: weighing,
      Cijfer: 0,
      TotaalPunten: 0,
      Toelichting: '',
      //   AangemaaktDoor: '',
      //   DatumAangemaakt: new Date(),
      //   GewijzigdDoor: '',
      //   DatumGewijzigd: new Date(),
      VanafDatum: versionDate,
      Versie: version,
    };
  };

  const newCategory = (
    categoryId: number,
    name: string,
    weighing: number,
    questions: VisitatieBeoordelingCategorieVraagInput[],
  ): VisitatieBeoordelingCategorieInput => {
    return {
      VisitatieID: visitatieId,
      VisitatieBeoordelingCategorieID: uuidv4().toUpperCase(),
      CategorieTemplateID: categoryId,
      CategorieNaam: name,
      Weging: weighing,
      Cijfer: 0,
      TotaalPunten: 0,
      //   AangemaaktDoor: '',
      //   DatumAangemaakt: new Date(),
      //   GewijzigdDoor: '',
      //   DatumGewijzigd: new Date(),
      VanafDatum: versionDate,
      Versie: version,
      Vragen: questions,
    };
  };

  const catId1 = 100;
  const catId2 = 200;
  const catId3 = 300;

  return [
    newCategory(catId1, 'Uitvoering van doel en inhoud', 50, [
      newQuestion(catId1, uuidv4().toUpperCase(), 1001, 'Beginsituatie deelnemers nagegaan', 5),
      newQuestion(
        catId1,
        uuidv4().toUpperCase(),
        1002,
        'Op- en aanmerkingen beoordelaar verwerkt',
        7,
      ),
      newQuestion(catId1, uuidv4().toUpperCase(), 1003, 'Doelstelling behaald', 13),
      newQuestion(
        catId1,
        uuidv4().toUpperCase(),
        1004,
        'Voorgenomen inhoud behandeld, event. incl thuisopdracht',
        25,
      ),
    ]),
    newCategory(catId2, 'Aanpak', 30, [
      newQuestion(catId2, uuidv4().toUpperCase(), 2001, 'Werkwijze als gepland toegepast', 10),
      newQuestion(catId2, uuidv4().toUpperCase(), 2002, 'Deelnemers actief betrokken', 10),
      newQuestion(catId2, uuidv4().toUpperCase(), 2003, 'Deelnemers delen kennis en info', 10),
    ]),
    newCategory(catId3, 'Organisatie', 20, [
      newQuestion(catId3, uuidv4().toUpperCase(), 3001, 'Samenvatting uitgereikt', 5),
      newQuestion(
        catId3,
        uuidv4().toUpperCase(),
        3002,
        'Inhoudelijk en organisatorisch geëvalueerd',
        5,
      ),
      newQuestion(catId3, uuidv4().toUpperCase(), 3003, 'Groepsgrootte als gepland', 5),
      newQuestion(catId3, uuidv4().toUpperCase(), 3004, 'Localiteit en (digi)techniek adequaat', 5),
    ]),
  ];
}
