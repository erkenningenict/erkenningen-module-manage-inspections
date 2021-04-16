import { Alert } from '@erkenningen/ui/components/alert';
import { Button } from '@erkenningen/ui/components/button';
import { Col } from '@erkenningen/ui/layout/col';
import { Panel } from '@erkenningen/ui/layout/panel';
import { Row } from '@erkenningen/ui/layout/row';
import { toDutchDate } from '@erkenningen/ui/utils';
import React, { useState } from 'react';
import {
  DiscussieVisitatieFieldsFragment,
  GetVisitationDocument,
  GetVisitationQuery,
  useAddVisitationCommentMutation,
} from '../../generated/graphql';
import './DiscussionDetails.css';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useGrowlContext } from '@erkenningen/ui/components/growl';
import { useForm } from 'react-hook-form';
import TextareaAutosize from 'react-autosize-textarea';

const DiscussionDetails: React.FC<{
  discussions?: DiscussieVisitatieFieldsFragment[];
  alloNewDiscussion: boolean;
  visitatieId: number;
}> = (props) => {
  const { showGrowl } = useGrowlContext();
  const schema = yup.object().shape({
    comment: yup.string().max(1000).required(),
  });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<{ comment: string }>({ mode: 'onChange', resolver: yupResolver(schema) });

  const onSubmit = async (values: any) => {
    await addVisitationComment({
      variables: {
        input: {
          commentaar: values.comment,
          visitatieId: props.visitatieId,
        },
      },
    });
    reset();
  };
  const discussions = props.discussions;
  const [orderDesc, setOrderDesc] = useState<boolean>(true);

  const desc = orderDesc ? 1 : -1;

  const [addVisitationComment, { loading: addCommentLoading }] = useAddVisitationCommentMutation({
    onCompleted() {
      showGrowl({
        severity: 'success',
        summary: 'Commentaar toegevoegd',
        detail: 'Het commentaar is succesvol toegevoegd.',
      });
    },
    onError(e) {
      showGrowl({
        severity: 'error',
        summary: 'Commentaar niet toegevoegd',
        sticky: true,
        detail: `Er is een fout opgetreden bij het toevoegen van het commentaar: ${e.message}`,
      });
    },
    update(cache, result) {
      const discussieVisitatie = result?.data?.addVisitationComment;
      if (!discussieVisitatie) {
        return;
      }
      const visitationData = cache.readQuery<GetVisitationQuery>({
        query: GetVisitationDocument,
        variables: { input: { visitatieId: props.visitatieId } },
      });

      const newVisitationData = visitationData?.Visitation;

      if (!newVisitationData) {
        return;
      }
      cache.writeQuery<GetVisitationQuery>({
        query: GetVisitationDocument,
        variables: { input: { visitatieId: props.visitatieId } },
        data: {
          Visitation: {
            ...(newVisitationData.DiscussieVisitaties?.concat(discussieVisitatie) as any),
            __typename: 'Visitatie',
          },
        },
      });
    },
  });

  return (
    <div id="discussie">
      <Panel title="Discussie rond de inspectie" doNotIncludeBody={true}>
        {props.alloNewDiscussion && (
          <form className="form form-horizontal" onSubmit={handleSubmit(onSubmit)}>
            <div
              className={`form-group ${errors.comment ? 'has-error' : ''}`}
              style={{ marginTop: '15px' }}
            >
              <label className="control-label col-sm-3">Commentaar</label>
              <div className="col-sm-9">
                <TextareaAutosize
                  className="form-control col-sm-9"
                  {...register('comment')}
                  placeholder="Voeg uw commentaar toe"
                />
                {errors.comment && <span className="help-block">{errors.comment.message}</span>}
              </div>
            </div>
            <div className="form-group">
              <div className="col-sm-8 col-sm-offset-3">
                <Button
                  label={'Commentaar opslaan'}
                  icon="pi pi-check"
                  disabled={!isValid}
                  buttonType="submit"
                  loading={addCommentLoading}
                />
              </div>
            </div>
          </form>
        )}
        <div className="panel-body">
          {!discussions ||
            (discussions.length === 0 && (
              <Alert type="info">Er is (nog) geen discussie gevoerd.</Alert>
            ))}
          {discussions && discussions.length > 0 && (
            <Button
              className="hidden-print"
              label={orderDesc ? 'Sorteer oud naar nieuw' : 'Sorteer nieuw naar oud'}
              buttonType="button"
              icon={`pi ${orderDesc ? 'pi-sort-up' : 'pi-sort-down'}`}
              onClick={() => setOrderDesc(!orderDesc)}
              style={{ marginBottom: '15px' }}
            />
          )}

          {discussions
            ?.slice()
            ?.sort((a, b) => (a.DatumTijdUTC < b.DatumTijdUTC ? desc : -1 * desc))
            ?.map((d: DiscussieVisitatieFieldsFragment, index: number) => (
              <Row
                key={d.DatumTijdUTC}
                className={`row discussionRow ${index % 2 === 1 ? 'even' : 'odd'}`}
              >
                <Col size="col-sm-3">
                  <div className="dateTime">
                    {toDutchDate(d.DatumTijdUTC, { includeTime: true })}
                  </div>
                  <div>{d?.Persoon?.SortableFullName}</div>
                  <div className="source">
                    {d?.IsAuteurInspecteur ? 'Inspecteur' : 'Kennisaanbieder'}
                  </div>
                </Col>
                <div
                  className="visible-xs-block"
                  style={{ borderTop: '1px solid #ccc', margin: '5px 0' }}
                ></div>
                <Col size="col-sm-9">{d?.Commentaar}</Col>
              </Row>
            ))}
        </div>
      </Panel>
    </div>
  );
};

export default DiscussionDetails;
