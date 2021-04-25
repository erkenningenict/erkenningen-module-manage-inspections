import React from 'react';

import { useGrowlContext } from '@erkenningen/ui/components/growl';
import { Spinner } from '@erkenningen/ui/components/spinner';
import { Panel } from '@erkenningen/ui/layout/panel';

import { useGetVisitationQuery, VisitatieStatusEnum } from '../../generated/graphql';
import { useHistory, useParams } from 'react-router-dom';
import { Row } from '@erkenningen/ui/layout/row';
import { Col } from '@erkenningen/ui/layout/col';
import { toDutchDate, formatCapitalEnum } from '@erkenningen/ui/utils';
import { FormStaticItem } from '../../components/FormStaticItem';
import './InspectionDetails.css';
import SessionDetails from './SessionDetails';
import DiscussionDetails from './DiscussionDetails';
import { add, isAfter } from 'date-fns';
import { nrOfMonthsAfterWhichCommentsAreNotAllowed } from '../../utils/time';
import PrintButton from '../../components/PrintButton';
import { Alert } from '@erkenningen/ui/components/alert';
import EditReport from '../create-report/EditReport';
import { hasRole, Roles, useAuth } from '../../shared/Auth';
import ParseReportText from './ParseReportText';

const InspectionDetails: React.FC<any> = (props) => {
  const { showGrowl } = useGrowlContext();
  const auth = useAuth();
  const history = useHistory<any>();

  const { visitatieId: visitatieId } = useParams<{
    visitatieId: string;
  }>();

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

  if (inspectionLoading) {
    return (
      <Panel title="Informatie over de inspectie" className="form-horizontal">
        <Spinner text={'Gegevens laden...'} />
      </Panel>
    );
  }

  const visitatie = inspection?.Visitation;

  const isAssignedInspector = auth.my?.Persoon?.PersoonID === visitatie?.PersoonID;
  const hasData = visitatie?.VisitatieBeoordelingCategorieen?.length !== 0;
  const isRector = hasRole(Roles.Rector, auth?.my?.Roles);

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
            <Panel
              title="Informatie over de inspectie"
              className="form-horizontal"
              doNotIncludeBody={true}
            >
              <FormStaticItem label="Status">
                {formatCapitalEnum(visitatie?.Status, 'Onbekende status')}
              </FormStaticItem>
              <FormStaticItem label="Inspecteur">
                {visitatie?.Inspecteur?.SortableFullName}
              </FormStaticItem>
              <FormStaticItem label="Inspectiedatum">
                {toDutchDate(visitatie?.DatumVisitatie)}
              </FormStaticItem>
              {visitatie?.Status !== VisitatieStatusEnum.Ingediend && (
                <div className="panel-body">
                  <Alert type="info">Er is nog geen (definitief) rapport gemaakt.</Alert>
                </div>
              )}
              {visitatie?.Status === VisitatieStatusEnum.Ingediend && (
                <>
                  <FormStaticItem label="Rapportdatum">
                    {toDutchDate(visitatie?.DatumRapport)}
                  </FormStaticItem>
                  <FormStaticItem label="Rapportcijfer">
                    {visitatie?.Rapportcijfer}{' '}
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
                  <FormStaticItem
                    label="Rapporttekst"
                    fieldClassNames="col-sm-8 form-control-static reportText"
                  >
                    <ParseReportText report={visitatie?.Rapport}></ParseReportText>
                  </FormStaticItem>
                </>
              )}
            </Panel>
          </Col>
          <Col size="col-md-6">{visitatie && <SessionDetails></SessionDetails>}</Col>
        </Row>
        {!(visitatie?.Status === VisitatieStatusEnum.Ingediend && !hasData) && (
          <Row>
            <Col>
              <EditReport
                visitatieId={+visitatieId}
                status={visitatie?.Status}
                vragenJson={visitatie?.VragenJson}
                categories={visitatie?.VisitatieBeoordelingCategorieen}
                isAssignedInspector={isAssignedInspector}
                isRector={isRector}
                sessieType={visitatie?.Sessie?.SessieType}
              ></EditReport>
            </Col>
          </Row>
        )}
        <Row>
          <Col>
            {visitatie && (
              <DiscussionDetails
                {...props}
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
