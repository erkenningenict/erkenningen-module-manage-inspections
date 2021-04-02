import React from 'react';

import { useGrowlContext } from '@erkenningen/ui/components/growl';
import { Spinner } from '@erkenningen/ui/components/spinner';
import { Panel } from '@erkenningen/ui/layout/panel';

import { useGetSessionQuery, useGetVisitationQuery } from '../../generated/graphql';
import { useHistory, useParams, useRouteMatch } from 'react-router-dom';
import { Row } from '@erkenningen/ui/layout/row';
import { Col } from '@erkenningen/ui/layout/col';
import { toDutchDate } from '@erkenningen/ui/utils';
import { FormStaticItem } from '../../components/FormStaticItem';
import './InspectionDetails.css';
import SessionDetails from './SessionDetails';
import DiscussionDetails from './DiscussionDetails';
import { add, isAfter } from 'date-fns';
import { nrOfMonthsAfterWhichCommentsAreNotAllowed } from '../../utils/time';
import PrintButton from '../../components/PrintButton';
import { Alert } from '@erkenningen/ui/components/alert';
import CreateReport from '../create-report/CreateReport';
import { useAuth } from '../../shared/Auth';

const InspectionDetails: React.FC<unknown> = () => {
  const { showGrowl } = useGrowlContext();
  const auth = useAuth();
  const history = useHistory();
  const isCreateReportRoute = useRouteMatch('/rapport-maken/:visitatieId/:sessieId');

  const { visitatieId: visitatieId, sessieId: sessieId } = useParams<any>();

  const { loading: inspectionLoading, data: inspection } = useGetVisitationQuery({
    // fetchPolicy: 'cache-and-network',
    variables: { input: { visitatieId: +visitatieId } },
    onError() {
      showGrowl({
        severity: 'error',
        summary: 'Inspectie ophalen',
        sticky: true,
        detail: `Er is een fout opgetreden bij het ophalen van de inspectie. Controleer uw invoer of neem contact met ons op.`,
      });
    },
  });

  const { loading: sessionLoading, data: session } = useGetSessionQuery({
    fetchPolicy: 'network-only',
    variables: { sessieId: +sessieId },
    onError() {
      showGrowl({
        severity: 'error',
        summary: 'Inspectie ophalen',
        sticky: true,
        detail: `Er is een fout opgetreden bij het ophalen van de inspectie. Controleer uw invoer of neem contact met ons op.`,
      });
    },
  });

  if (inspectionLoading) {
    return (
      <Panel title="Informatie over de inspectie" className="form-horizontal">
        <Spinner text={'Gegevens laden...'} />
      </Panel>
    );
  }

  const visitatie = inspection?.Visitation;

  return (
    <>
      <a
        onClick={history.goBack}
        style={{ cursor: 'pointer', marginBottom: '15px', display: 'block' }}
      >
        Terug naar overzicht
      </a>
      <Row>
        <Col size={'col-md-12'}>
          <a
            style={{ cursor: 'pointer' }}
            onClick={() => {
              const element = document.getElementById('discussie');
              element?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Ga naar discussie
          </a>
        </Col>
      </Row>
      <div id="printContainer">
        <Row>
          <Col size={'col-md-6'}>
            <Panel title="Informatie over de inspectie" className="form-horizontal">
              <FormStaticItem label="Status">{visitatie?.Status}</FormStaticItem>
              <FormStaticItem label="Inspecteur">
                {visitatie?.Inspecteur?.SortableFullName}
              </FormStaticItem>
              <FormStaticItem label="Inspectiedatum">
                {toDutchDate(visitatie?.DatumVisitatie)}
              </FormStaticItem>
              {!visitatie?.DatumRapport && (
                <div>
                  <Alert type="info">Er is nog geen rapport gemaakt.</Alert>
                  {/* {auth.my?.Persoon?.PersoonID === visitatie?.PersoonID && (
                    <Button
                      buttonType="button"
                      label="Rapport maken"
                      onClick={() => console.log('#DH# ')}
                    ></Button>
                  )} */}
                </div>
              )}
              {visitatie?.DatumRapport && (
                <>
                  <FormStaticItem label="Rapportdatum">
                    {toDutchDate(visitatie?.DatumRapport)}
                  </FormStaticItem>
                  <FormStaticItem label="Rapportcijfer">
                    {visitatie?.Rapportcijfer === 0
                      ? 'Nog geen rapport gemaakt'
                      : visitatie?.Rapportcijfer}{' '}
                    {visitatie?.VolgensIntentieAanbod === false && (
                      <>
                        <i
                          className="fas fa-exclamation-circle notToIntention"
                          style={{ color: 'yellow', background: '#333', borderRadius: '8px' }}
                          data-pr-tooltip="Niet volgens de intentie van het aanbod"
                        ></i>{' '}
                        <strong>Afwijkend van aanbod</strong>
                      </>
                    )}
                  </FormStaticItem>
                </>
              )}

              {visitatie?.Rapport && (
                <FormStaticItem
                  label="Rapporttekst"
                  fieldClassNames="col-sm-8 form-control-static reportText"
                >
                  <div
                    dangerouslySetInnerHTML={{
                      __html:
                        visitatie?.Rapport?.replace('<p>', '')
                          .replace('</p>', '')
                          .replace(/<BR><BR>/g, '')
                          .replace(`SLASH`, '/')
                          .replace(
                            /<BR>----------------------------------------------------------/g,
                            '<br/>',
                          )
                          .replace(/<BR>/g, '<br/>')
                          .replace(
                            /----------------------------------------------------------/g,
                            '<br/>',
                          )
                          .replace(
                            'Is de doelstelling bereikt: ',
                            '<span class="question">Is de doelstelling bereikt: </span>',
                          )
                          .replace(
                            'Aantal deelnemers: ',
                            '<span class="question">Aantal deelnemers: </span>',
                          )
                          .replace(
                            'Docenten/inleiders: ',
                            '<span class="question">Docenten/inleiders: </span>',
                          )
                          .replace(
                            'Lokatie in relatie tot doelstelling: ',
                            '<span class="question">Lokatie in relatie tot doelstelling: </span>',
                          )
                          .replace(
                            'Wordt binnen de competentie gewerkt en worden de genoemde vaardigheden behandeld: ',
                            '<span class="question">Wordt binnen de competentie gewerkt en worden de genoemde vaardigheden behandeld: </span>',
                          )
                          .replace(
                            'Hulpmiddelen en toepassingswijze: ',
                            '<span class="question">Hulpmiddelen en toepassingswijze: </span>',
                          )
                          .replace(
                            'Kwaliteit van samenvatting: ',
                            '<span class="question">Aanvullende opmerkingen: </span>',
                          )
                          .replace(
                            'Aanvullende opmerkingen: ',
                            '<span class="question">Aanvullende opmerkingen: </span>',
                          ) || '',
                    }}
                  ></div>
                </FormStaticItem>
              )}
            </Panel>
          </Col>
          <Col size="col-md-6">
            {visitatie && (
              <SessionDetails
                sessie={session?.Sessie}
                sessionLoading={sessionLoading}
                showAll={isCreateReportRoute === null}
              ></SessionDetails>
            )}
          </Col>
        </Row>
        {isCreateReportRoute !== null && auth.my?.Persoon?.PersoonID === visitatie?.PersoonID && (
          <Row>
            <Col>
              <CreateReport
                visitatieId={+visitatieId}
                status={visitatie?.Status}
                rapportTemplateJson={visitatie?.RapportTemplateJson}
                vragenJson={visitatie?.VragenJson}
                categories={visitatie?.VisitatieBeoordelingCategorieen}
              ></CreateReport>
            </Col>
          </Row>
        )}
        <Row>
          <Col>
            {visitatie && (
              <DiscussionDetails
                discussions={visitatie?.DiscussieVisitaties}
                visitatieId={visitatie?.VisitatieID}
                alloNewDiscussion={
                  visitatie.DatumRapport &&
                  isAfter(
                    add(new Date(visitatie.DatumRapport), {
                      months: nrOfMonthsAfterWhichCommentsAreNotAllowed,
                    }),
                    new Date(),
                  )
                }
              ></DiscussionDetails>
            )}
          </Col>
        </Row>
      </div>
      <PrintButton element="printContainer"></PrintButton>
      <a
        onClick={history.goBack}
        style={{ cursor: 'pointer', marginBottom: '15px', marginTop: '15px', display: 'block' }}
      >
        Terug naar overzicht
      </a>
    </>
  );
};

export default InspectionDetails;
