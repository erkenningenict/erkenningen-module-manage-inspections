import React, { useEffect, useState } from 'react';
import { Control, useWatch } from 'react-hook-form';

const InvoiceTotal: React.FC<{
  control: Control<{
    NrOfKilometers: number;
    PublicTransport: number;
    NrOfDayParts: number;
    Other: number;
    OtherDescription: string;
  }>;
  tariffKm?: number;
  tariffDaypart?: number;
  isValid: boolean;
}> = ({ control, tariffDaypart, tariffKm, isValid }) => {
  const [total, setTotal] = useState<number>(0);
  const c = useWatch({ control });
  let t = 0;
  if (!tariffDaypart || !tariffKm) {
    return null;
  }

  if (c) {
    t = (c?.NrOfKilometers || 0) * tariffKm;
  }
  if (c.PublicTransport) {
    t += c.PublicTransport;
  }
  if (c.NrOfDayParts) {
    t += (c.NrOfDayParts || 0) * tariffDaypart;
  }
  if (c.Other) {
    t += c.Other;
  }
  useEffect(() => {
    setTotal(t);
  });
  if (!isValid) {
    return null;
  }

  return (
    <>
      <div className={`form-group`}>
        <label className="control-label col-sm-4">Totaal</label>
        <div className="col-sm-6 form-control-static">
          {total?.toFixed(2).replace('.', ',')} euro
        </div>
      </div>
    </>
  );
};

export default InvoiceTotal;
