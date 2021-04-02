import React from 'react';
import { Panel } from '@erkenningen/ui/layout/panel';
import {
  GetVisitationDocument,
  GetVisitationQuery,
  useUpdateVisitationReportMutation,
  VisitatieBeoordelingCategorie,
  VisitatieBeoordelingCategorieFieldsFragment,
  VisitatieBeoordelingCategorieInput,
  VisitatieBeoorderlingCategorieVraagFieldsFragment,
  VisitatieStatusEnum,
} from '../../generated/graphql';
import { FormItem, FormText } from '@erkenningen/ui/components/form';
import { Button } from '@erkenningen/ui/components/button';
import * as yup from 'yup';
import Category from './Category';
import { FieldArray, Form, Formik } from 'formik';
import { useGrowlContext } from '@erkenningen/ui/components/growl';
import { Spinner } from '@erkenningen/ui/components/spinner';
import { convertTextQuestionsToReport } from '../../utils/strings';
import { getScores } from '../../utils/scoring';
import { getRatingsTemplate } from '../../utils/ratings-template';

export type IInspectionReport = {
  textQuestions: ITextQuestionTemplate[];
  textQuestionsVersion: string;
  textQuestionsDate: Date;
  ratings: VisitatieBeoordelingCategorie[];
  ratingsVersion: string;
  ratingsDate: Date;
};

export type ITextQuestionTemplate = {
  question: string;
  label: string;
  validation: string;
};

export type IQuestionType = {
  [key: string]: string;
};
type IQuestionValidationType = {
  [key: string]: any;
};

type IMeta = {
  version: string;
};

const CreateReport: React.FC<{
  visitatieId: number;
  status?: string;
  rapportTemplateJson?: string;
  vragenJson?: string;
  categories?: VisitatieBeoordelingCategorieFieldsFragment[];
}> = (props) => {
  const { showGrowl } = useGrowlContext();
  // const yupString = yup.string().max(500);
  // const yupTextQuestion = yup.string().max(5);
  // const yupWeighing = yup.number().min(0).max(100);
  // const yupRating = yup.number().min(0).max(10);
  // console.log('#DH# json', props.rapportJson);

  let meta: IMeta = { version: 'onbekend' };
  let textQuestionsTemplate: ITextQuestionTemplate[] = [];
  let ratingsTemplate: VisitatieBeoordelingCategorieInput[] = [];
  if (props.rapportTemplateJson && props?.rapportTemplateJson.length > 0) {
    const jsonTemplate = JSON.parse(props.rapportTemplateJson);
    meta = jsonTemplate.meta;
    textQuestionsTemplate = jsonTemplate.textQuestionsTemplate;
    ratingsTemplate =
      props.categories === undefined || props.categories?.length === 0
        ? getRatingsTemplate(props.visitatieId)
        : props.categories || getRatingsTemplate(props.visitatieId);
    // ratingsTemplate = getRatingsTemplate(props.visitatieId);
  }
  // console.log('#DH# ratingstemplate', props.categories);

  const [
    updateVisitationReport,
    { loading: updateVisitationReportLoading },
  ] = useUpdateVisitationReportMutation({
    onCompleted() {
      showGrowl({
        severity: 'success',
        summary: 'Rapport bijgewerkt',
        detail: 'Het rapport is succesvol opgeslagen.',
      });
    },
    onError(e) {
      showGrowl({
        severity: 'error',
        summary: 'Rapport niet bijgewerkt',
        sticky: true,
        detail: `Er is een fout opgetreden bij het bijwerken van het rapport: ${e.message}`,
      });
    },
    update(cache, result) {
      console.log('#DH# update', result);
      const updateVisitationReport = result?.data?.updateVisitationReport;
      if (!updateVisitationReport) {
        return;
      }
      const visitationData = cache.readQuery<GetVisitationQuery>({
        query: GetVisitationDocument,
        variables: { input: { visitatieId: props.visitatieId } },
      });

      const currentVisitationData = visitationData?.Visitation;

      if (!currentVisitationData) {
        return;
      }
      cache.writeQuery<GetVisitationQuery>({
        query: GetVisitationDocument,
        variables: { input: { visitatieId: props.visitatieId } },
        data: {
          Visitation: {
            ...currentVisitationData,
            ...updateVisitationReport,
            __typename: 'Visitatie',
          },
        },
      });
    },
  });

  let textQuestions = textQuestionsTemplate.reduce(
    (acc: IQuestionType, curr: IQuestionType) => ((acc[curr.question] = ''), acc),
    {},
  );
  // console.log('#DH# textQuestionsalll', textQuestions, props.vragenJson);
  textQuestions = props.vragenJson && JSON.parse(props.vragenJson);

  const yupTypes: any = {
    yupTextQuestion: yup.string().max(250),
  };

  const textQuestionsValidationScheme = textQuestionsTemplate.reduce(
    (acc: IQuestionValidationType, curr: IQuestionValidationType): any => (
      (acc[curr.question] = yupTypes[curr.validation]), acc
    ),
    {},
  );

  // console.log('#DH# scheme', textQuestionsValidationScheme);
  const schemaNormal = yup.object().shape({
    textQuestions: yup.object().shape(textQuestionsValidationScheme),
    // ratings: yup.array().of(
    //   yup.object().shape({
    //     categoryName: yupString,
    //     weighing: yupWeighing,
    //     rating: yupWeighing,
    //     questions: yup.array().of(
    //       yup.object().shape({
    //         name: yupString,
    //         weighing: yupWeighing,
    //         rating: yupRating,
    //         total: yupWeighing,
    //       }),
    //     ),
    //   }),
    // ),
  });
  const numberRatings: VisitatieBeoordelingCategorieInput[] = [...ratingsTemplate];

  // console.log('#DH# numberRatings', numberRatings);
  const initialValues = {
    // v01_Is_doelstelling_bereikt: '',
    // v02_Aantal_deelnemers: '',
    textQuestions: textQuestions,
    ratings: numberRatings,
  };
  // console.log('#DH# initial', initialValues.textQuestions);

  return (
    <Panel
      title={
        props?.status === VisitatieStatusEnum.Ingepland
          ? 'Inspectierapport maken'
          : 'Inspectierapport aanvullen'
      }
      doNotIncludeBody={true}
    >
      <div className="panel-body">
        <p>Vul het inspectie rapport in. (versie {meta?.version || 'onbekend'})</p>
        <h4>Vragen</h4>
      </div>
      {updateVisitationReportLoading && <Spinner text="Rapport wordt opgeslagen"></Spinner>}
      {!updateVisitationReportLoading && (
        <Formik
          initialValues={initialValues}
          validationSchema={schemaNormal}
          onSubmit={async (values: any) => {
            console.log('#DH# save values', values);
            const report = convertTextQuestionsToReport(values.textQuestions);

            const scorings = getScores(values.ratings);
            const ratings = values.ratings.map((c: VisitatieBeoordelingCategorieFieldsFragment) => {
              // c.__typename
              const { __typename, ...cat } = c;
              console.log('#DH# cat', cat);
              const catWithoutTypeName =
                cat?.Vragen?.map((q: VisitatieBeoorderlingCategorieVraagFieldsFragment) => {
                  const { __typename, ...question } = q;
                  return question;
                }) || undefined;
              return { ...cat, ...{ Vragen: catWithoutTypeName } };
            });
            console.log('#DH# ratings', ratings);
            await updateVisitationReport({
              variables: {
                input: {
                  VisitatieID: props.visitatieId,
                  Status: VisitatieStatusEnum.RapportWordtOpgesteld,
                  VragenJson: JSON.stringify(values.textQuestions),
                  Rapport: report,
                  Rapportcijfer: scorings?.RapportCijfer || 0,
                  VolgensIntentieAanbod: scorings?.VolgensIntentieAanbod || false,
                  DatumRapport: new Date(),
                  ratings: ratings,
                },
              },
            });
          }}
        >
          {(formik) => (
            <Form noValidate>
              <div className="form-horizontal">
                {Object.keys(initialValues.textQuestions)
                  .filter((q) => q !== 'ratings')
                  .map((question: string) => {
                    return (
                      <FormText
                        key={question}
                        name={`textQuestions.${question}`}
                        label={question
                          .replace(/_/g, ' ')
                          .replace('SLASH', '/')
                          .concat('?')
                          .substr(4, question.length)}
                        labelClassNames={'col-sm-4'}
                        formControlClassName="col-sm-8"
                        isTextArea={true}
                      />
                    );
                  })}

                <div className="panel-body">
                  <h4>Cijfers</h4>
                </div>

                <div className="form-group">
                  <label className="control-label col-sm-4"></label>
                  <div className="col-sm-3 form-control-static text-bold">Cijfer</div>
                  <div className="col-sm-1 form-control-static text-bold textRight">Weging</div>
                  <div className="col-sm-1 form-control-static text-bold textRight">Totaal</div>
                  <div className="col-sm-2 form-control-static text-bold">Toelichting</div>
                </div>
                {/* {console.log('Formik Values: ', formik.values)} */}
                <FieldArray name="numberRatings">
                  {() => (
                    <div>
                      {formik.values?.ratings?.map(
                        (cat: VisitatieBeoordelingCategorieInput, index) => (
                          <Category
                            key={cat.CategorieTemplateID}
                            subform={formik}
                            category={cat}
                            index={index}
                          ></Category>
                        ),
                      )}
                    </div>
                  )}
                </FieldArray>
                <FormItem
                  label={''}
                  labelClassNames={'col-sm-4'}
                  formControlClassName={'col-sm-8 col-sm-offset-4'}
                >
                  <Button label={'Rapport opslaan'} buttonType="submit" icon="pi pi-check" />
                </FormItem>
              </div>
            </Form>
          )}
        </Formik>
      )}
    </Panel>
  );
};

export default CreateReport;
