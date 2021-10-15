import React from 'react';
import { VisitatieBeoordelingCategorieInput } from '../../generated/graphql';
import { getScores } from '../../utils/scoring';

const ReportTotal: React.FC<{ numberRatings: VisitatieBeoordelingCategorieInput[] }> = (props) => {
  const scorings = getScores(props.numberRatings);
  return (
    <>
      <div className="form-group">
        <label className="control-label col-sm-4">Rapportcijfer</label>
        <div className="col-sm-8 form-control-static">
          <strong>
            {scorings?.RapportCijfer} (obv van {scorings?.TotaalPunten || 0} van 100 punten)
          </strong>
        </div>
      </div>
      <div className="form-group">
        <label className="control-label col-sm-4">Volgens intentie van het aanbod</label>
        <div className="col-sm-8 form-control-static">
          {scorings?.VolgensIntentieAanbod ? (
            <strong>Ja</strong>
          ) : (
            <>
              <i
                className="fas fa-exclamation-circle notToIntention"
                style={{ color: 'yellow', background: '#333', borderRadius: '8px' }}
                data-pr-tooltip="Niet volgens de intentie van het aanbod"
              ></i>{' '}
              <strong>Afwijkend van aanbod (minder dan 28 punten)</strong>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ReportTotal;
