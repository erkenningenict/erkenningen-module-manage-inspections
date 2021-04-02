import {
  VisitatieBeoordelingCategorie,
  VisitatieBeoordelingCategorieInput,
  VisitatieBeoordelingCategorieVraag,
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
      VisitatieBeoordelingCategorieVraagID: uuidv4(),
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
      VisitatieBeoordelingCategorieID: uuidv4(),
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
      newQuestion(catId1, uuidv4(), 1001, 'Beginsituatie_deelnemers_nagegaan', 5),
      newQuestion(catId1, uuidv4(), 1002, 'Op-_en_aanmerkingen_beoordelaar_verwerkt', 7),
      newQuestion(catId1, uuidv4(), 1003, 'Doelstelling_behaald', 13),
      newQuestion(catId1, uuidv4(), 1004, 'Voorgenomen_inhoud_behandeld', 25),
    ]),
    newCategory(catId2, 'Aanpak', 30, [
      newQuestion(catId2, uuidv4(), 2001, 'Werkwijze_als_gepland_toegepast', 10),
      newQuestion(catId2, uuidv4(), 2002, 'Deelnemers_actief_betrokken', 10),
      newQuestion(catId2, uuidv4(), 2003, 'Deelnemers_delen_kennis_en_info', 10),
    ]),
    newCategory(catId3, 'Organisatie', 20, [
      newQuestion(catId3, uuidv4(), 3001, 'Samenvatting_uitgereikt', 5),
      newQuestion(catId3, uuidv4(), 3002, 'Inhoudelijk_en_organisatorisch_geëvalueerd', 5),
      newQuestion(catId3, uuidv4(), 3003, 'Groepsgrootte_als_gepland', 5),
      newQuestion(catId3, uuidv4(), 3004, 'Localiteit_adequaat', 5),
    ]),
  ];
}
