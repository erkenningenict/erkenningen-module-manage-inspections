import React, { useState } from 'react';
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
import {
  getTextQuestionForDigitalSpecialtyTemplate,
  getTextQuestionTemplate,
} from '../../utils/questions-template';
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
  vragenJson?: string;
  categories?: VisitatieBeoordelingCategorieFieldsFragment[];
  isRector: boolean;
  isAssignedInspector: boolean;
  sessieType?: string;
}> = (props) => {
  const { showGrowl } = useGrowlContext();
  const [required, setRequired] = useState<boolean>(false);

  let meta: IMeta = { version: 'Onbekend' };
  let ratingsTemplate: VisitatieBeoordelingCategorieInput[] = [];
  let textQuestions: IQuestionType[] = [];

  if (
    props.vragenJson === undefined ||
    props.vragenJson === null ||
    props.categories?.length === 0
  ) {
    switch (props.sessieType) {
      case 'DigitaalAanbodInspectie':
        textQuestions = getTextQuestionForDigitalSpecialtyTemplate();
        break;
      default:
        textQuestions = getTextQuestionTemplate();
    }

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
    yupTextQuestion: yup.string().max(2000),
    yupTextQuestionRequired: yup.string().max(2000).required(),
    yupRating: yup
      .number()
      .integer('Alleen gehele getallen tussen 0 en 10')
      .min(0, 'Cijfer tussen 0 en 10')
      .max(10, 'Cijfer tussen 0 en 10'),
    yupRatingRequired: yup
      .number()
      .integer('Alleen gehele getallen tussen 1 en 10')
      .min(1, 'Cijfer tussen 1 en 10')
      .max(10, 'Cijfer tussen 1 en 10')
      .required(),
    yupRatingsRemark: yup.string().max(2000),
  };

  const schemaNormal = yup.object().shape({
    textQuestions: yup.array().of(
      yup.object().shape({
        answer: required ? yupTypes['yupTextQuestionRequired'] : yupTypes['yupTextQuestion'],
      }),
    ),
    ratings: yup.array().of(
      yup.object().shape({
        Vragen: yup.array().of(
          yup.object().shape({
            Cijfer: required ? yupTypes['yupRatingRequired'] : yupTypes['yupRating'],
            Toelichting: yupTypes['yupRatingsRemark'],
          }),
        ),
      }),
    ),
  });

  const numberRatings: VisitatieBeoordelingCategorieInput[] = [...ratingsTemplate];

  const defaultValues = {
    textQuestions: textQuestions,
    ratings: numberRatings,
  };

  const {
    register,
    handleSubmit,
    control,
    getValues,
    setValue,
    watch,
    trigger,
    formState: { errors, isValid, isDirty },
  } = useForm({ mode: 'onChange', resolver: yupResolver(schemaNormal), defaultValues });

  const { fields: ratingFields } = useFieldArray({
    name: 'ratings' as `ratings`,
    control,
  });
  const ratings = useWatch({ control, name: `ratings` });

  const submitAndClose = async () => {
    setTimeout(async () => {
      setRequired(true);
      const invalidFields = await trigger();
      if (invalidFields) {
        update(getValues(), true);
      }
    }, 1);
  };

  const onSubmit = async (values: any) => {
    setRequired(false);
    trigger();
    update(values);
  };

  const update = async (values: any, close = false) => {
    const report = convertTextQuestionsToReport(values.textQuestions);

    const scorings = getScores(values.ratings);
    const ratings = values.ratings.map((c: VisitatieBeoordelingCategorieFieldsFragment) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { __typename, ...cat } = c;
      const catWithoutTypeName =
        cat?.Vragen?.map((q: VisitatieBeoorderlingCategorieVraagFieldsFragment) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { __typename, ...question } = q;
          return question;
        }) || undefined;
      return { ...cat, ...{ Vragen: catWithoutTypeName } };
    });
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

  const isReadOnly =
    props.status === VisitatieStatusEnum.Ingediend ||
    (!props.isRector && !props.isAssignedInspector);

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
              isReadOnly={isReadOnly}
            ></TextQuestions>
            <div className="panel-body">
              <h4>Cijfers</h4>
            </div>
            <RatingCategories
              {...{ control, register, watch, defaultValues, getValues, setValue, errors, trigger }}
              fields={ratingFields}
              isReadOnly={isReadOnly}
            ></RatingCategories>
            <ReportTotal numberRatings={ratings}></ReportTotal>
            {props.status !== VisitatieStatusEnum.Ingediend && (
              <div className="form-group">
                <div className="col-sm-8 col-sm-offset-4">
                  <Button
                    disabled={!isValid && isDirty}
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
