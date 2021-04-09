import React from 'react';
import { Panel } from '@erkenningen/ui/layout/panel';
import {
  GetVisitationDocument,
  GetVisitationQuery,
  useUpdateVisitationReportMutation,
  VisitatieBeoordelingCategorieFieldsFragment,
  VisitatieBeoordelingCategorieInput,
  VisitatieBeoorderlingCategorieVraagFieldsFragment,
  VisitatieStatusEnum,
} from '../../generated/graphql';
import { Button } from '@erkenningen/ui/components/button';
import * as yup from 'yup';
import { useGrowlContext } from '@erkenningen/ui/components/growl';
import { Spinner } from '@erkenningen/ui/components/spinner';
import { convertTextQuestionsToReport } from '../../utils/strings';
import { getScores } from '../../utils/scoring';
import { getRatingsTemplate } from '../../utils/ratings-template';
import { useFieldArray, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import TextQuestions from './TextQuestions';
import { getTextQuestionTemplate } from '../../utils/questions-template';
import { IQuestionType } from '../../types/text-questions';
import RatingCategories from './RatingCategories';

export type ITextQuestionTemplate = {
  question: string;
  label: string;
  validation: string;
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
  // let textQuestionsTemplate: ITextQuestionTemplate[] = [];
  let ratingsTemplate: VisitatieBeoordelingCategorieInput[] = [];

  if (props.rapportTemplateJson && props?.rapportTemplateJson.length > 0) {
    const jsonTemplate = JSON.parse(props.rapportTemplateJson);
    meta = jsonTemplate.meta;
    // textQuestionsTemplate = jsonTemplate.textQuestionsTemplate;
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

  const textQuestions =
    props.vragenJson === undefined || props.categories?.length === 0
      ? getTextQuestionTemplate()
      : (JSON.parse(props.vragenJson) as IQuestionType[]);

  const yupTypes: any = {
    yupTextQuestion: yup.string().max(4),
    yupRating: yup
      .number()
      .integer('Alleen gehele getallen tussen 0 en 10')
      .min(0, 'Cijfer tussen 0 en 10')
      .max(10, 'Cijfer tussen 0 en 10')
      .required(),
  };

  // console.log('#DH# scheme', textQuestionsValidationScheme);
  const schemaNormal = yup.object().shape({
    textQuestions: yup.array().of(
      yup.object().shape({
        answer: yupTypes['yupTextQuestion'],
      }),
    ),
    ratings: yup.array().of(
      yup.object().shape({
        // categoryName: yupString,
        // weighing: yupWeighing,
        // rating: yupWeighing,
        Vragen: yup.array().of(
          yup.object().shape({
            Cijfer: yupTypes['yupRating'],
            Toelichting: yupTypes['yupTextQuestion'],
            // name: yupString,
            // weighing: yupWeighing,
            // rating: yupRating,
            // total: yupWeighing,
          }),
        ),
      }),
    ),
  });
  // console.log('#DH# schema', schemaNormal);
  const numberRatings: VisitatieBeoordelingCategorieInput[] = [...ratingsTemplate];

  const defaultValues = {
    textQuestions: textQuestions,
    ratings: numberRatings,
  };
  // console.log('#DH# defaultValues', defaultValues);

  const {
    register,
    handleSubmit,
    control,
    getValues,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm({ mode: 'onChange', resolver: yupResolver(schemaNormal), defaultValues });
  const { fields: textFields } = useFieldArray({
    name: 'textQuestions' as `textQuestions`,
    control,
  });
  const { fields: ratingFields } = useFieldArray({
    name: 'ratings' as `ratings`,
    control,
  });

  const onSubmit = async (values: any) => {
    console.log('#DH# SAVEDDDDDD', values);
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
  };
  console.log('#DH# defaultValues', defaultValues);

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
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-horizontal">
            <>
              <TextQuestions
                register={register}
                errors={errors}
                fields={textFields}
              ></TextQuestions>
            </>
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
            <RatingCategories
              {...{ control, register, watch, defaultValues, getValues, setValue, errors }}
              fields={ratingFields}
            ></RatingCategories>

            <div className="form-group">
              <div className="col-sm-8 col-sm-offset-4">
                <Button
                  disabled={!isValid}
                  label={'Rapport opslaan'}
                  buttonType="submit"
                  icon="pi pi-check"
                />
              </div>
            </div>
          </div>
        </form>
      )}
    </Panel>
  );
};

export default CreateReport;
