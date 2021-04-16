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
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import TextQuestions from './TextQuestions';
import { getTextQuestionTemplate } from '../../utils/questions-template';
import { IQuestionType } from '../../types/text-questions';
import RatingCategories from './RatingCategories';
import ReportTotal from './ReportTotal';

export type ITextQuestionTemplate = {
  question: string;
  label: string;
  validation: string;
};

type IMeta = {
  version: string;
};

const EditReport: React.FC<{
  visitatieId: number;
  status?: VisitatieStatusEnum;
  rapportTemplateJson?: string;
  vragenJson?: string;
  categories?: VisitatieBeoordelingCategorieFieldsFragment[];
}> = (props) => {
  const { showGrowl } = useGrowlContext();

  let meta: IMeta = { version: 'Onbekend' };
  let ratingsTemplate: VisitatieBeoordelingCategorieInput[] = [];
  let textQuestions: IQuestionType[] = [];
  console.log('#DH# t tem ', props.vragenJson);
  if (
    props.vragenJson === undefined ||
    props.vragenJson === null ||
    props.categories?.length === 0
  ) {
    textQuestions = getTextQuestionTemplate();
    meta = { version: '1.0' };
  } else {
    const jsonTemplate = JSON.parse(props.vragenJson);
    meta = jsonTemplate?.meta;
    textQuestions = jsonTemplate.questions as IQuestionType[];
  }

  if (
    props.categories === undefined ||
    props.categories === null ||
    props.categories?.length === 0
  ) {
    ratingsTemplate = getRatingsTemplate(props.visitatieId);
  } else {
    ratingsTemplate = props.categories || getRatingsTemplate(props.visitatieId);
  }

  console.log('#DH# cats', props.categories);

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

  const yupTypes: any = {
    yupTextQuestion: yup.string().max(500),
    yupRating: yup
      .number()
      .integer('Alleen gehele getallen tussen 0 en 10')
      .min(0, 'Cijfer tussen 0 en 10')
      .max(10, 'Cijfer tussen 0 en 10')
      .required(),
    yupRatingsRemark: yup.string().max(500),
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
        Vragen: yup.array().of(
          yup.object().shape({
            Cijfer: yupTypes['yupRating'],
            Toelichting: yupTypes['yupRatingsRemark'],
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

  const { fields: ratingFields } = useFieldArray({
    name: 'ratings' as `ratings`,
    control,
  });
  const ratings = useWatch({ control, name: `ratings` });

  const submitAndClose = () => {
    update(getValues(), true);
  };

  const onSubmit = async (values: any) => {
    update(values);
  };

  const update = async (values: any, close = false) => {
    console.log('#DH# SAVEDDDDDD', values);
    const report = convertTextQuestionsToReport(values.textQuestions);

    const scorings = getScores(values.ratings);
    const ratings = values.ratings.map((c: VisitatieBeoordelingCategorieFieldsFragment) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { __typename, ...cat } = c;
      console.log('#DH# cat', cat);
      const catWithoutTypeName =
        cat?.Vragen?.map((q: VisitatieBeoorderlingCategorieVraagFieldsFragment) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
          Status: close ? VisitatieStatusEnum.Ingediend : VisitatieStatusEnum.RapportWordtOpgesteld,
          VragenJson: JSON.stringify({ meta: meta, questions: values.textQuestions }),
          Rapport: report,
          Rapportcijfer: scorings?.RapportCijfer || 0,
          VolgensIntentieAanbod: scorings?.VolgensIntentieAanbod || false,
          DatumRapport: close ? new Date() : null,
          ratings: ratings,
        },
      },
    });
  };

  // console.log('#DH# defaultValues', defaultValues);

  return (
    <Panel
      title={
        props?.status === VisitatieStatusEnum.Ingepland
          ? 'Inspectierapport maken'
          : props?.status === VisitatieStatusEnum.RapportWordtOpgesteld
          ? 'Inspectierapport aanvullen'
          : 'Inspectierapport bekijken'
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
            {/* ERRORS: {JSON.stringify(errors)} */}
            <TextQuestions
              {...{ control, register, errors }}
              isReadOnly={props.status === VisitatieStatusEnum.Ingediend}
            ></TextQuestions>
            <div className="panel-body">
              <h4>Cijfers</h4>
            </div>
            <RatingCategories
              {...{ control, register, watch, defaultValues, getValues, setValue, errors }}
              fields={ratingFields}
              isReadOnly={props.status === VisitatieStatusEnum.Ingediend}
            ></RatingCategories>
            <ReportTotal numberRatings={ratings}></ReportTotal>
            {props.status !== VisitatieStatusEnum.Ingediend && (
              <div className="form-group">
                <div className="col-sm-8 col-sm-offset-4">
                  <Button
                    disabled={!isValid}
                    label={'Rapport opslaan'}
                    buttonType="submit"
                    icon="pi pi-check"
                    tooltip={`Een rapport kan meerdere worden aangepast voordat deze wordt ingediend.`}
                  />
                  <Button
                    disabled={!isValid}
                    label={'Rapport opslaan en indienen'}
                    buttonType="button"
                    onClick={() => submitAndClose()}
                    icon="pi pi-check"
                    tooltip={`Een ingediend rapport kan niet meer worden aangepast.`}
                  />
                </div>
              </div>
            )}
          </div>
        </form>
      )}
    </Panel>
  );
};

export default EditReport;
