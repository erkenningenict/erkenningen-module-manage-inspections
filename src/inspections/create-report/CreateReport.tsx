import React from 'react';
import { Panel } from '@erkenningen/ui/layout/panel';
import {
  useUpdateVisitationReportMutation,
  VisitatieBeoordelingCategorieFieldsFragment,
  VisitatieStatusEnum,
} from '../../generated/graphql';
// import Form, { FormikSchema } from '../../components/Form';
import { FormItem, FormText } from '@erkenningen/ui/components/form';
import { Button } from '@erkenningen/ui/components/button';
import * as yup from 'yup';
import Category from './Category';
import { FieldArray, Form, Formik } from 'formik';
import { useGrowlContext } from '@erkenningen/ui/components/growl';
import { Spinner } from '@erkenningen/ui/components/spinner';

export type IInspectionReport = {
  textQuestions: ITextQuestionTemplate[];
  textQuestionsVersion: string;
  textQuestionsDate: Date;
  ratings: ICategory[];
  ratingsVersion: string;
  ratingsDate: Date;
};

export type ITextQuestionTemplate = {
  question: string;
  label: string;
  validation: string;
};

export type ICategory = {
  id?: string;
  categoryName: string;
  weighing: number;
  rating: number; // cijfer
  total: number; // totaal
  questions: IRatingQuestion[];
  version: string;
  date: Date;
};

// export type ICategory = ICategoryTemplate & {};

// export type IRatingQuestion = IRatingQuestionTemplate & {};

export type IRatingQuestion = {
  id?: string;
  categoryId?: string;
  name: string;
  weighing: number;
  rating: number;
  total: number;
  version: string;
  date: Date;
  remark?: string;
};

type IQuestionType = {
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
  let ratingsTemplate: ICategory[] = [];
  if (props.rapportTemplateJson && props?.rapportTemplateJson.length > 0) {
    const jsonTemplate = JSON.parse(props.rapportTemplateJson);
    meta = jsonTemplate.meta;
    textQuestionsTemplate = jsonTemplate.textQuestionsTemplate;
    ratingsTemplate = jsonTemplate.ratingsTemplate;
  }

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
    // update(cache, result) {
    //   const discussieVisitatie = result?.data?.addVisitationComment;
    //   if (!discussieVisitatie) {
    //     return;
    //   }
    //   const visitationData = cache.readQuery<GetVisitationQuery>({
    //     query: GetVisitationDocument,
    //     variables: { input: { visitatieId: props.visitatieId } },
    //   });

    //   const newVisitationData = visitationData?.Visitation;

    //   if (!newVisitationData) {
    //     return;
    //   }
    //   cache.writeQuery<GetVisitationQuery>({
    //     query: GetVisitationDocument,
    //     variables: { input: { visitatieId: props.visitatieId } },
    //     data: {
    //       Visitation: {
    //         ...(newVisitationData.DiscussieVisitaties?.concat(discussieVisitatie) as any),
    //         __typename: 'Visitatie',
    //       },
    //     },
    //   });
    // },
  });

  // [
  //   {
  //     question: 'v01_Is_doelstelling_bereikt',
  //     label: 'Is doelstelling bereikt?',
  //     validation: 'yupTextQuestion',
  //   },
  //   {
  //     question: 'v02_Aantal_deelnemers',
  //     label: 'Aantal deelnemers?',
  //     validation: 'yupTextQuestion',
  //   },
  //   {
  //     question: 'v03_DocentenSLASHinleiders',
  //     label: 'Docenten / inleiders',
  //     validation: 'yupTextQuestion',
  //   },
  // ];

  // console.log('#DH# textQ Tem', textQuestionsTemplate);
  // const numberRatingsTemplate: ICategoryTemplate[] = [
  //   {
  //     categoryName: 'Uitvoering van doel en inhoud',
  //     weighing: 50,
  //     total: 0,
  //     rating: 0,
  //     version: '1',
  //     date: new Date(),
  //     questions: [
  //       {
  //         name: 'Beginsituatie deelnemers nagegaan',
  //         weighing: 5,
  //         rating: 0,
  //         remark: '',
  //         total: 0,
  //         version: '1',
  //         date: new Date(),
  //       },
  //       {
  //         name: 'Op_en_aanmerkingen_beoordelaar_verwerkt',
  //         weighing: 7,
  //         rating: 0,
  //         remark: '',
  //         total: 0,
  //         version: '1',
  //         date: new Date(),
  //       },
  //       {
  //         name: 'Doelstelling_behaald',
  //         weighing: 13,
  //         rating: 0,
  //         remark: '',
  //         total: 0,
  //         version: '1',
  //         date: new Date(),
  //       },
  //       {
  //         name: 'Voorgenomen_inhoud_behandeld',
  //         weighing: 25,
  //         rating: 0,
  //         remark: '',
  //         total: 0,
  //         version: '1',
  //         date: new Date(),
  //       },
  //     ],
  //   },
  // ];

  // const textQuestionsData: IQuestionType = {
  //   v01_Is_doelstelling_bereikt: 'Ja',
  //   v02_Aantal_deelnemers: '15 maar was teveel',
  //   v03_DocentenSLASHinleiders: 'Waren erg goed',
  // };

  let textQuestions = textQuestionsTemplate.reduce(
    (acc: IQuestionType, curr: IQuestionType) => ((acc[curr.question] = ''), acc),
    {},
  );
  console.log('#DH# textQuestionsalll', textQuestions, props.vragenJson);
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
  const numberRatings: ICategory[] = [...ratingsTemplate];

  console.log('#DH# numberRatings', numberRatings);
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

            await updateVisitationReport({
              variables: {
                input: {
                  visitatieId: props.visitatieId,
                  ratings: '',
                  status: VisitatieStatusEnum.RapportWordtOpgesteld,
                  textQuestions: JSON.stringify(values.textQuestions),
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
                  <div className="col-sm-1 form-control-static text-bold textRight">Weging</div>
                  <div className="col-sm-1 form-control-static text-bold textRight">Waardering</div>
                  <div className="col-sm-1 form-control-static text-bold textRight">
                    Totaal categorie
                  </div>
                  <div className="col-sm-1 form-control-static text-bold textRight">
                    Toelichting
                  </div>
                </div>
                {/* {console.log('Formik Values: ', formik.values)} */}
                <FieldArray name="numberRatings">
                  {() => (
                    <div>
                      {formik.values?.ratings?.map((cat, index) => (
                        <Category
                          key={index}
                          subform={formik}
                          category={cat}
                          index={index}
                        ></Category>
                      ))}
                    </div>
                  )}
                </FieldArray>
                <FormItem
                  label={''}
                  labelClassNames={'col-sm-4'}
                  formControlClassName={'col-sm-8 col-sm-offset-4'}
                >
                  <Button label={'Opslaan'} buttonType="submit" />
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
