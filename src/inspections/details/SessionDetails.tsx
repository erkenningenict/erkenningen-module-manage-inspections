import React, { useState } from 'react';

import { Spinner } from '@erkenningen/ui/components/spinner';
import { Panel } from '@erkenningen/ui/layout/panel';

import { SessionInfoFragment } from '../../generated/graphql';
import { toDutchDate } from '@erkenningen/ui/utils';
import { FormStaticItem } from '../../components/FormStaticItem';
// import './InspectionDetails.css';
import { Button } from '@erkenningen/ui/components/button';

const SessionDetails: React.FC<{
  sessie?: SessionInfoFragment;
  sessionLoading: boolean;
  showAll: boolean;
}> = (props) => {
  const [showAll, setShowAll] = useState<boolean>(props.showAll);
  if (props.sessionLoading) {
    return (
      <Panel title="Informatie over de bijeenkomst" className="form-horizontal">
        <Spinner text={'Gegevens laden...'} />
      </Panel>
    );
  }

  const vak = props.sessie?.Cursus?.Vak;

  return (
    <>
      <Panel
        title="Informatie over de bijeenkomst"
        className="form-horizontal"
        doNotIncludeBody={true}
      >
        <FormStaticItem label="Type" data-testid="sessieType">
          {props.sessie?.SessieType || 'Fysieke bijeenkomst op locatie'}
        </FormStaticItem>
        <FormStaticItem label="Lokatie">{props.sessie?.Lokatie?.Naam}</FormStaticItem>
        <FormStaticItem label="Adres lokatie">
          {props.sessie?.Lokatie?.Contactgegevens.DisplayAddress}
        </FormStaticItem>
        <FormStaticItem label="Datum">{toDutchDate(props.sessie?.Datum)}</FormStaticItem>
        <FormStaticItem label="Begin/eindtijd">
          {new Date(props.sessie?.DatumBegintijd).toLocaleTimeString('nl-NL', {
            hour: '2-digit',
            minute: '2-digit',
          })}
          {' - '}
          {new Date(props.sessie?.DatumEindtijd).toLocaleTimeString('nl-NL', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </FormStaticItem>
        <FormStaticItem label="Aanbodcode">{props.sessie?.Cursus?.VakID}</FormStaticItem>
        <FormStaticItem label="Bijeenkomstcode">{props.sessie?.Cursus?.CursusID}</FormStaticItem>
        <FormStaticItem label="Titel">{props.sessie?.Cursus?.Titel}</FormStaticItem>
        {showAll && (
          <>
            <FormStaticItem label="Promotietekst">
              {props.sessie?.Cursus?.Promotietekst}
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
          </>
        )}
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
