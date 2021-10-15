import React, { useState } from 'react';
import { Panel } from '@erkenningen/ui/layout/panel';
import { Spinner } from '@erkenningen/ui/components/spinner';
import { useGrowlContext } from '@erkenningen/ui/components/growl';
import { Redirect, useHistory, useParams } from 'react-router-dom';
import {
  CreateDeclarationInvoiceMutation,
  useCreateDeclarationInvoiceMutation,
  useGetVisitationDeclarationInfoQuery,
} from '../generated/graphql';
import { toDutchDate } from '@erkenningen/ui/utils';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '@erkenningen/ui/components/button';
import TextareaAutosize from 'react-autosize-textarea';
import InvoiceTotal from './InvoiceTotal';

const CreateDeclaration: React.FC<any> = () => {
  const { showGrowl } = useGrowlContext();
  const [invoiceCreated, setInvoiceCreated] = useState<CreateDeclarationInvoiceMutation>();
  const history = useHistory<any>();
  const { visitatieId: visitatieId } = useParams<{
    visitatieId: string;
  }>();

  const goBackToListView = () => (
    <a
      onClick={() => history.push('/')}
      style={{ cursor: 'pointer', marginBottom: '15px', display: 'block' }}
    >
      Terug naar overzicht
    </a>
  );

  const yupValidateMoney = (fieldName: string) => {
    return yup
      .mixed()
      .required(`${fieldName} is verplicht (min. 0)`)
      .test('type', 'Moet een decimaal zijn (min. 0)', (value) => !isNaN(value))
      .test('validPrices', 'Moet een geldig Euro bedrag zijn tussen 0 en 999', (value) =>
        /^[0-9]{1,3}(|[,.][0-9]{1,2})$/.test(value),
      );
  };

  const schema = yup.object().shape({
    NrOfKilometers: yup.number().integer().min(0, '0 of meer').max(500, 'Max 500 km.'),
    PublicTransport: yupValidateMoney('OV'),
    NrOfDayParts: yup.number().min(0, '0 of meer').max(9, 'Max 9'),
    Other: yupValidateMoney('Overige'),
    OtherDescription: yup.string(),
  });

  const defaultValues = {
    NrOfKilometers: 0,
    PublicTransport: 0,
    NrOfDayParts: 0,
    Other: 0,
    OtherDescription: '',
  };

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm({ mode: 'onChange', resolver: yupResolver(schema), defaultValues });

  const { loading, data } = useGetVisitationDeclarationInfoQuery({
    fetchPolicy: 'no-cache',
    variables: { input: { visitatieId: +visitatieId } },
    onError(error) {
      if (error.message === 'Inspectie is niet aan u toegewezen') {
        showGrowl({
          severity: 'error',
          summary: 'Validatie fout',
          sticky: true,
          detail: 'Inspectie is niet aan u toegewezen en daarom mag u geen declaratie aanmaken',
        });
        history.push('/');
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

  const [
    createDeclarationInvoice,
    { loading: createDeclarationInvoiceLoading },
  ] = useCreateDeclarationInvoiceMutation({
    onCompleted(data) {
      showGrowl({
        severity: 'success',
        summary: 'Factuur aangemaakt',
        detail: 'De factuur is succesvol toegevoegd.',
      });

      setInvoiceCreated(data);
    },
    onError(e) {
      showGrowl({
        severity: 'error',
        summary: 'Factuur niet aangemaakt',
        sticky: true,
        detail: `Er is een fout opgetreden bij het aanmaken van de factuur: ${e.message}`,
      });
    },
  });

  if (loading) {
    return (
      <Panel title="Informatie over de inspectie" className="form-horizontal">
        <Spinner text={'Gegevens laden...'} />
      </Panel>
    );
  }

  if (createDeclarationInvoiceLoading) {
    return (
      <Panel title="Factuur wordt aangemaakt" className="form-horizontal">
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

  if (invoiceCreated) {
    return (
      <Panel title="Factuur van inspectie" className="form-horizontal">
        <p>
          Factuur nummer: {invoiceCreated.createDeclarationInvoice.FactuurNummer} is aangemaakt.
        </p>
        <div
          dangerouslySetInnerHTML={getInvoiceJsLink(
            invoiceCreated.createDeclarationInvoice.InvoiceLink,
            'Bekijk factuur',
          )}
        ></div>
        <br />
        <br />
        {goBackToListView()}
      </Panel>
    );
  }

  if (data?.VisitationDeclaration?.HasInvoice) {
    return <Redirect to={`/factuur-bekijken/${visitatieId}`}></Redirect>;
  }

  const visit = data?.VisitationDeclaration?.Visitatie;

  return (
    <>
      {goBackToListView()}
      <Panel title="Declaratie indienen" className="form-horizontal" doNotIncludeBody={true}>
        <div className="panel-body">
          <p>
            Voor de bijeenkomst op {toDutchDate(visit?.DatumVisitatie)} in{' '}
            {visit?.Sessie?.Lokatie?.Contactgegevens?.Woonplaats} van `
            {visit?.Cursus?.Vak?.Vakgroep
              ? visit?.Cursus?.Vak?.Vakgroep?.Naam
              : visit?.Cursus?.Vak?.ExamenInstelling?.Naam}
            ` heb ik de volgende kosten gemaakt:
          </p>
        </div>
        <form
          onSubmit={handleSubmit(async (data) => {
            await createDeclarationInvoice({
              variables: {
                input: {
                  VisitatieID: +visitatieId,
                  NrOfDayParts: +data.NrOfDayParts,
                  NrOfKilometers: +data.NrOfKilometers,
                  PublicTransport: +data.PublicTransport,
                  Other: +data.Other,
                  OtherDescription: data.OtherDescription,
                },
              },
            });
          })}
        >
          <div className="form-horizontal">
            <div className={`form-group ${errors?.NrOfKilometers ? 'has-error' : ''}`}>
              <label className="control-label col-sm-4">Aantal kilometers per auto</label>
              <div className="col-sm-2">
                <input
                  className="form-control"
                  type="number"
                  min={0}
                  max={500}
                  {...register(`NrOfKilometers`, { valueAsNumber: true })}
                />

                {errors?.NrOfKilometers && (
                  <span className="help-block">{errors?.NrOfKilometers.message}</span>
                )}
              </div>
              <div className="col-sm-6 form-control-static">
                km (€ {data?.VisitationDeclaration?.TariffKm} per km)
              </div>
            </div>
            <div className={`form-group ${errors?.PublicTransport ? 'has-error' : ''}`}>
              <label className="control-label col-sm-4">Kosten openbaar vervoer</label>
              <div className="col-sm-2">
                <input
                  className="form-control"
                  type="number"
                  {...register(`PublicTransport`, { valueAsNumber: true })}
                  min={0}
                  max={500}
                  step=".01"
                />
                {errors?.PublicTransport && (
                  <span className="help-block">{errors?.PublicTransport.message}</span>
                )}
              </div>
              <div className="col-sm-6 form-control-static">euro</div>
            </div>
            <div className={`form-group ${errors.NrOfDayParts ? 'has-error' : ''}`}>
              <label className="control-label col-sm-4">Aantal dagdelen</label>
              <div className="col-sm-2">
                <input
                  className="form-control"
                  type="number"
                  {...register(`NrOfDayParts`, { valueAsNumber: true })}
                />
                {errors?.NrOfDayParts && (
                  <span className="help-block">{errors?.NrOfDayParts.message}</span>
                )}
              </div>
              <div className="col-sm-6 form-control-static">
                dagdelen (€ {data?.VisitationDeclaration?.TariffDayPart} per dagdeel)
              </div>
            </div>
            <div className={`form-group ${errors.Other ? 'has-error' : ''}`}>
              <label className="control-label col-sm-4">Overige kosten</label>
              <div className="col-sm-2">
                <input
                  className="form-control"
                  type="number"
                  {...register(`Other`, { valueAsNumber: true })}
                  min={0}
                  max={500}
                  step=".01"
                />
                {errors?.Other && <span className="help-block">{errors?.Other.message}</span>}
              </div>
              <div className="col-sm-1 form-control-static">euro</div>
              <div className="col-sm-5">
                <TextareaAutosize
                  className="form-control"
                  placeholder="Omschrijving overige kosten"
                  {...register('OtherDescription')}
                />
              </div>
            </div>

            <InvoiceTotal
              control={control}
              tariffKm={data?.VisitationDeclaration?.TariffKm}
              tariffDaypart={data?.VisitationDeclaration?.TariffDayPart}
              isValid={isValid}
            ></InvoiceTotal>

            <div className="form-group">
              <div className="col-sm-8 col-sm-offset-4">
                <Button
                  disabled={!isValid}
                  label={'Declaratie indienen'}
                  buttonType="submit"
                  icon="pi pi-check"
                  tooltip={`Dien de declaratie in, hierna wordt de factuur getoond.`}
                />
              </div>
            </div>
          </div>
        </form>
      </Panel>
      {goBackToListView()}
    </>
  );
};

export default CreateDeclaration;
