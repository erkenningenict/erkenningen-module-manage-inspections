import { Alert } from '@erkenningen/ui/components/alert';
import { Button } from '@erkenningen/ui/components/button';
import { FormItem, FormText } from '@erkenningen/ui/components/form';
import { Col } from '@erkenningen/ui/layout/col';
import { Panel } from '@erkenningen/ui/layout/panel';
import { Row } from '@erkenningen/ui/layout/row';
import { toDutchDate } from '@erkenningen/ui/utils';
import React, { useState } from 'react';
import Form from '../../components/Form';
import {
  DiscussieVisitatieFieldsFragment,
  GetVisitationDocument,
  GetVisitationQuery,
  useAddVisitationCommentMutation,
} from '../../generated/graphql';
import './DiscussionDetails.css';
import * as yup from 'yup';
import { useGrowlContext } from '@erkenningen/ui/components/growl';

const DiscussionDetails: React.FC<{
  discussions?: DiscussieVisitatieFieldsFragment[];
  alloNewDiscussion: boolean;
  visitatieId: number;
}> = (props) => {
  const { showGrowl } = useGrowlContext();

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
      <Panel title="Discussie rond de inspectie" className="form-horizontal">
        {props.alloNewDiscussion && (
          <>
            <Form
              className="hidden-print"
              schema={{
                comment: ['', yup.string().max(1000).required()],
              }}
              onSubmit={async (values: any, { resetForm }) => {
                await addVisitationComment({
                  variables: {
                    input: {
                      commentaar: values.comment,
                      visitatieId: props.visitatieId,
                    },
                  },
                });
                resetForm();
              }}
            >
              {() => (
                <>
                  <div className="row">
                    <FormText
                      name={'comment'}
                      isTextArea={true}
                      label={'Commentaar'}
                      labelClassNames={'col-sm-3'}
                      formControlClassName="col-sm-9"
                    />
                  </div>
                  <div className="row">
                    <FormItem
                      label={''}
                      labelClassNames={'col-sm-3'}
                      formControlClassName={'col-sm-8 col-sm-offset-3'}
                    >
                      <Button
                        label={'Opslaan'}
                        icon="pi pi-check"
                        buttonType="submit"
                        loading={addCommentLoading}
                      />
                    </FormItem>
                  </div>
                </>
              )}
            </Form>
          </>
        )}
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
                <div className="dateTime">{toDutchDate(d.DatumTijdUTC, { includeTime: true })}</div>
                <div className="">{d?.Persoon?.SortableFullName}</div>
                <div className="source">
                  {d?.IsAuteurInspecteur ? 'Inspecteur' : 'Kennisaanbieder'}
                </div>
              </Col>
              <Col size="col-sm-9">{d?.Commentaar}</Col>
            </Row>
          ))}
      </Panel>
    </div>
  );
};

export default DiscussionDetails;
