import React, { useState } from 'react';

import { Spinner } from '@erkenningen/ui/components/spinner';
import { Panel } from '@erkenningen/ui/layout/panel';

import { useGetSessionQuery } from '../../generated/graphql';
import { formatCapitalEnum, toDutchDate } from '@erkenningen/ui/utils';
import { FormStaticItem } from '../../components/FormStaticItem';
import { Button } from '@erkenningen/ui/components/button';
import { useGrowlContext } from '@erkenningen/ui/components/growl';
import { useParams } from 'react-router-dom';
import './SessionDetails.scss';

const SessionDetails: React.FC = () => {
  const { showGrowl } = useGrowlContext();
  const { sessieId } = useParams<any>();
  const [showAll, setShowAll] = useState<boolean>(false);

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

  if (sessionLoading) {
    return (
      <Panel title="Informatie over de bijeenkomst" className="form-horizontal">
        <Spinner text={'Gegevens laden...'} />
      </Panel>
    );
  }

  const vak = session?.Sessie?.Cursus?.Vak;

  return (
    <>
      <Panel
        title="Informatie over de bijeenkomst"
        className="form-horizontal"
        doNotIncludeBody={true}
      >
        <FormStaticItem label="Type" data-testid="sessieType">
          {formatCapitalEnum(session?.Sessie?.SessieType) || 'Fysieke bijeenkomst op locatie'}
        </FormStaticItem>
        <FormStaticItem label="Lokatie">{session?.Sessie?.Lokatie?.Naam}</FormStaticItem>
        <FormStaticItem label="Adres lokatie">
          {session?.Sessie?.Lokatie?.Contactgegevens.DisplayAddress}
        </FormStaticItem>
        <FormStaticItem label="Datum en tijd">
          {toDutchDate(session?.Sessie?.Datum)}
          {' van '}
          {new Date(session?.Sessie?.DatumBegintijd).toLocaleTimeString('nl-NL', {
            hour: '2-digit',
            minute: '2-digit',
          })}
          {' - '}
          {new Date(session?.Sessie?.DatumEindtijd).toLocaleTimeString('nl-NL', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </FormStaticItem>
        <FormStaticItem label="Aanbod/bijeenkomst">
          {session?.Sessie?.Cursus?.VakID} {session?.Sessie?.Cursus?.CursusID}
        </FormStaticItem>
        <FormStaticItem label="Titel">{session?.Sessie?.Cursus?.Titel}</FormStaticItem>
        <div className={`expand ${showAll ? 'showInfo' : 'hideInfo'}`}>
          <FormStaticItem label="Promotietekst">
            {session?.Sessie?.Cursus?.Promotietekst}
          </FormStaticItem>

          <FormStaticItem label="Thema">{vak?.ThemaNaam}</FormStaticItem>
          <FormStaticItem label="Competentie">{vak?.CompetentieNaam}</FormStaticItem>
          <FormStaticItem label="Aanbieder">
            {vak?.Vakgroep ? vak?.Vakgroep?.Naam : vak?.ExamenInstelling?.Naam}
          </FormStaticItem>
          <FormStaticItem label="Adres aanbieder">
            {vak?.Vakgroep
              ? vak?.Vakgroep?.Contactgegevens?.DisplayAddress
              : vak?.ExamenInstelling?.Contactgegevens?.DisplayAddress}
          </FormStaticItem>
          <FormStaticItem label="Contactpersoon">
            {vak?.Vakgroep
              ? vak?.Vakgroep?.Contactgegevens?.TerAttentieVan
              : vak?.ExamenInstelling?.Contactgegevens?.TerAttentieVan}
          </FormStaticItem>
          <FormStaticItem label="Telefoon">
            <a
              href={`tel:${
                vak?.Vakgroep
                  ? vak?.Vakgroep?.Contactgegevens?.Telefoon
                  : vak?.ExamenInstelling?.Contactgegevens?.Telefoon
              }`}
            >
              {vak?.Vakgroep
                ? vak?.Vakgroep?.Contactgegevens?.Telefoon
                : vak?.ExamenInstelling?.Contactgegevens?.Telefoon}
            </a>
          </FormStaticItem>
          <FormStaticItem label="Email">
            <a
              href={`mailto:${
                vak?.Vakgroep
                  ? vak?.Vakgroep?.Contactgegevens?.Email
                  : vak?.ExamenInstelling?.Contactgegevens?.Email
              }`}
            >
              {vak?.Vakgroep
                ? vak?.Vakgroep?.Contactgegevens?.Email
                : vak?.ExamenInstelling?.Contactgegevens?.Email}
            </a>
          </FormStaticItem>
        </div>
        <FormStaticItem label="">
          <Button
            label={showAll ? 'Toon minder' : 'Toon alles'}
            buttonType="button"
            onClick={() => setShowAll(!showAll)}
          ></Button>
        </FormStaticItem>
      </Panel>
    </>
  );
};

export default SessionDetails;
