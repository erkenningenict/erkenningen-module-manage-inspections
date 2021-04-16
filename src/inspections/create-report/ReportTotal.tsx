import React, { useState } from 'react';
import { useDeepCompareEffect } from 'use-deep-compare';
import { VisitatieBeoordelingCategorieInput } from '../../generated/graphql';
import { getScores, IGetScoreReturnValues } from '../../utils/scoring';

const ReportTotal: React.FC<{ numberRatings: VisitatieBeoordelingCategorieInput[] }> = (props) => {
  const [scorings, setScorings] = useState<IGetScoreReturnValues | undefined>(undefined);
  useDeepCompareEffect(() => {
    setScorings(getScores(props.numberRatings));
  }, [props.numberRatings]);
  return (
    <>
      <div className="form-group">
        <label className="control-label col-sm-4">Rapportcijfer</label>
        <div className="col-sm-8 form-control-static">
          <strong>{scorings?.RapportCijfer}</strong>
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
              <strong>Afwijkend van aanbod</strong>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ReportTotal;