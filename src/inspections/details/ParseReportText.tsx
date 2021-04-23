import React from 'react';

const ParseReportText: React.FC<{ report: string | undefined }> = ({ report }) => {
  if (!report) {
    return null;
  }
  return (
    <div
      dangerouslySetInnerHTML={{
        __html:
          report
            .replace('<p>', '')
            .replace('</p>', '')
            .replace(/<BR><BR>/g, '')
            .replace(
              /<BR>----------------------------------------------------------/g,
              '<br class="line"/>',
            )
            .replace(/<br \/>/g, '<br class="line"/>')
            .replace(/<BR>/g, '<br class="line"/>')
            .replace(
              /----------------------------------------------------------/g,
              '<br class="line"/>',
            )
            .replace(
              'Is de doelstelling bereikt: ',
              '<div class="question">Is de doelstelling bereikt: </div>',
            )
            .replace('Aantal deelnemers: ', '<div class="question">Aantal deelnemers: </div>')
            .replace('Docenten/inleiders: ', '<div class="question">Docenten/inleiders: </div>')
            .replace(
              'Lokatie in relatie tot doelstelling: ',
              '<div class="question">Lokatie in relatie tot doelstelling: </div>',
            )
            .replace(
              'Wordt binnen de competentie gewerkt en worden de genoemde vaardigheden behandeld: ',
              '<div class="question">Wordt binnen de competentie gewerkt en worden de genoemde vaardigheden behandeld: </div>',
            )
            .replace(
              'Hulpmiddelen en toepassingswijze: ',
              '<div class="question">Hulpmiddelen en toepassingswijze: </div>',
            )
            .replace(
              'Kwaliteit van samenvatting: ',
              '<div class="question">Kwaliteit van samenvatting: </div>',
            )
            .replace(
              'Aanvullende opmerkingen: ',
              '<div class="question">Aanvullende opmerkingen: </div>',
            )
            // Digital specialties
            .replace(
              'Administratieve intake: ',
              '<div class="question">Administratieve intake: </div>',
            )
            .replace(
              'Inrichting persoonsverificatie: ',
              '<div class="question">Inrichting persoonsverificatie: </div>',
            )
            .replace(
              'Afhandeling forum bijdrage: ',
              '<div class="question">Afhandeling forum bijdrage: </div>',
            )
            .replace(
              'Verwerking voltooide deelnemers: ',
              '<div class="question">Verwerking voltooide deelnemers: </div>',
            )
            .replace('Opmerkingen: ', '<div class="question">Opmerkingen: </div>') || '',
      }}
    ></div>
  );
};

export default ParseReportText;
