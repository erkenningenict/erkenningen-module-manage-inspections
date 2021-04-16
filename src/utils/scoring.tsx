import { VisitatieBeoordelingCategorieInput } from '../generated/graphql';

export type IGetScoreReturnValues = {
  RapportCijfer: number;
  VolgensIntentieAanbod: boolean;
};

export function getScores(
  categories: VisitatieBeoordelingCategorieInput[] | undefined,
): IGetScoreReturnValues | undefined {
  if (categories === undefined) {
    return undefined;
  }
  const findCategory = (categoryName: string) =>
    categories.find((c) => c.CategorieNaam === categoryName);
  const findQuestion = (category: VisitatieBeoordelingCategorieInput, questionName: string) =>
    category.Vragen?.find((q) => q.Naam === questionName);
  const categoryUitvoering: VisitatieBeoordelingCategorieInput | undefined = findCategory(
    'Uitvoering van doel en inhoud',
  );
  const categoryAanpak: VisitatieBeoordelingCategorieInput | undefined = findCategory('Aanpak');

  let goalTotal = 0;
  if (categoryUitvoering) {
    const doelstellingBehaald = findQuestion(categoryUitvoering, 'Doelstelling behaald');
    goalTotal += doelstellingBehaald?.TotaalPunten || 0;
    const voorgenomenInhoudBehandeld = findQuestion(
      categoryUitvoering,
      'Voorgenomen inhoud behandeld',
    );
    goalTotal += voorgenomenInhoudBehandeld?.TotaalPunten || 0;
  }
  if (categoryAanpak) {
    const werkwijzeAlsGeplandToegepast = findQuestion(
      categoryAanpak,
      'Werkwijze als gepland toegepast',
    );
    goalTotal += werkwijzeAlsGeplandToegepast?.TotaalPunten || 0;
  }

  let volgensIntentieAanbod = true;
  if (goalTotal < 28) {
    volgensIntentieAanbod = false;
  }
  const ratingsTotal = categories.reduce(
    (total: number, c: VisitatieBeoordelingCategorieInput) => (c?.TotaalPunten || 0) + total,
    0,
  );

  if (categories === undefined) {
    return {
      RapportCijfer: 0,
      VolgensIntentieAanbod: false,
    };
  }

  if (ratingsTotal < 30) {
    return {
      RapportCijfer: 2,
      VolgensIntentieAanbod: volgensIntentieAanbod,
    };
  }
  if (ratingsTotal < 50) {
    return {
      RapportCijfer: 4,
      VolgensIntentieAanbod: volgensIntentieAanbod,
    };
  }
  if (ratingsTotal < 70) {
    return {
      RapportCijfer: 6,
      VolgensIntentieAanbod: volgensIntentieAanbod,
    };
  }
  if (ratingsTotal < 90) {
    return {
      RapportCijfer: 8,
      VolgensIntentieAanbod: volgensIntentieAanbod,
    };
  }
  if (ratingsTotal <= 100) {
    return {
      RapportCijfer: 10,
      VolgensIntentieAanbod: volgensIntentieAanbod,
    };
  }

  return undefined;
}
