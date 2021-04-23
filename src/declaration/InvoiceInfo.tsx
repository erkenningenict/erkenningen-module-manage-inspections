import { useGrowlContext } from '@erkenningen/ui/components/growl';
import { Spinner } from '@erkenningen/ui/components/spinner';
import { Panel } from '@erkenningen/ui/layout/panel';
import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useGetVisitationDeclarationInfoQuery } from '../generated/graphql';

const InvoiceInfo: React.FC = () => {
  const { showGrowl } = useGrowlContext();
  const history = useHistory<any>();
  const { visitatieId: visitatieId } = useParams<{
    visitatieId: string;
  }>();
  const { loading, data } = useGetVisitationDeclarationInfoQuery({
    fetchPolicy: 'no-cache',
    variables: { input: { visitatieId: +visitatieId } },
    onError(error) {
      if (error.message === 'Inspectie is niet aan u toegewezen') {
        showGrowl({
          severity: 'error',
          summary: 'Validatie fout',
          sticky: true,
          detail: 'Inspectie is niet aan u toegewezen en daarom mag de factuur niet inzien',
        });
        history.goBack();
        return;
      }
      showGrowl({
        severity: 'error',
        summary: 'Inspectie ophalen',
        sticky: true,
        detail: error.message,
      });
    },
  });

  if (loading) {
    return (
      <Panel title="Informatie over de inspectie factuur" className="form-horizontal">
        <Spinner text={'Gegevens laden...'} />
      </Panel>
    );
  }

  const getInvoiceJsLink = (link: string | undefined, labelText: string): { __html: string } => {
    if (!link) {
      return { __html: '' };
    }
    return {
      __html: `<a href="javascript: void(0)" class="btn btn-primary" onclick="${link};return false;">${labelText}</a>`,
    };
  };

  return (
    <>
      <Panel title="Factuur van inspectie" className="form-horizontal">
        <p>Factuur nummer: {data?.VisitationDeclaration?.FactuurNummer} is aangemaakt.</p>
        <div
          dangerouslySetInnerHTML={getInvoiceJsLink(
            data?.VisitationDeclaration?.InvoiceLink,
            'Bekijk factuur',
          )}
        ></div>
        <br />
        <br />
        <a
          onClick={history.goBack}
          style={{ cursor: 'pointer', marginBottom: '15px', display: 'block' }}
        >
          Terug naar overzicht
        </a>
      </Panel>
    </>
  );
};

export default InvoiceInfo;
