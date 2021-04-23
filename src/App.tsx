import React from 'react';

import { Switch, Route, HashRouter, Redirect } from 'react-router-dom';
// import { FormatErrorParams } from 'yup';
import * as yup from 'yup';

import { Alert } from '@erkenningen/ui/components/alert';
import { GrowlProvider } from '@erkenningen/ui/components/growl';
import { ThemeBureauErkenningen } from '@erkenningen/ui/layout/theme';
import { ThemeContext } from '@erkenningen/ui/layout/theme';
import { ConfirmProvider } from '@erkenningen/ui/components/confirm';

import { UserContext, useAuth, Roles, hasOneOfRoles } from './shared/Auth';
import InspectionsList from 'inspections/list/InspectionsList';
import InspectionDetails from './inspections/details/InspectionDetails';
import CreateDeclaration from './declaration/CreateDeclaration';
import InvoiceInfo from './declaration/InvoiceInfo';

// @TODO Move to lib?
yup.setLocale({
  mixed: {
    default: 'Ongeldig',
    required: 'Verplicht',
    notType: (params: any) => {
      if (!params.value) {
        return 'Verplicht';
      }

      switch (params.type) {
        case 'number':
          return 'Moet een getal zijn';
        case 'date':
          return 'Verplicht';
        default:
          return 'Ongeldige waarde';
      }
    },
  },
  string: {
    email: 'Ongeldig e-mailadres',
    min: 'Minimaal ${min} karakters', // eslint-disable-line no-template-curly-in-string
    max: 'Maximaal ${max} karakters', // eslint-disable-line no-template-curly-in-string
  },
});

const App: React.FC<unknown> = () => {
  const auth = useAuth();

  if (auth.loading) {
    return <p>Gegevens worden geladen...</p>;
  }

  if (auth.error) {
    return (
      <Alert type="danger">
        Er is een fout opgetreden bij het ophalen van de accountgegevens. Probeer het nog een keer
        of neem contact op met de helpdesk.
      </Alert>
    );
  }

  if (!auth.authenticated) {
    return <Alert type="danger">U moet ingelogd zijn.</Alert>;
  }

  if (
    !hasOneOfRoles(
      [Roles.Rector, Roles.Inspecteur, Roles.Hoogleraar, Roles.Examinator],
      auth.my?.Roles,
    )
  ) {
    return <Alert type="danger">U heeft geen toegang tot deze module.</Alert>;
  }

  return (
    <HashRouter>
      <ThemeBureauErkenningen>
        <UserContext.Provider value={auth.my}>
          <ThemeContext.Provider value={{ mode: 'admin' }}>
            <GrowlProvider>
              <ConfirmProvider>
                <Switch>
                  {/* <Route path="/wijzig/:id" component={CourseEdit} /> */}
                  <Route path="/details/:visitatieId/:sessieId" component={InspectionDetails} />
                  <Route
                    path="/commentaar-geven/:visitatieId/:sessieId"
                    component={InspectionDetails}
                  />
                  <Route
                    path="/rapport-maken/:visitatieId/:sessieId"
                    component={InspectionDetails}
                  />
                  <Route path="/declaratie-indienen/:visitatieId" component={CreateDeclaration} />
                  <Route path="/factuur-bekijken/:visitatieId" component={InvoiceInfo} />
                  {/*
                  <Route path="/nieuw" component={CourseNewSelectSpecialty} />
                  <Route path="/gereed/:examVersionId" component={CourseReady} /> */}
                  <Route path="/overzicht" component={InspectionsList} />
                  <Route path="/">
                    <Redirect
                      to={{
                        pathname: '/overzicht',
                      }}
                    />
                  </Route>
                  <Route>
                    Route not found, please set a route in the url hash (e.g. /overzicht,
                    /wijzig/1234 or /nieuw)
                  </Route>
                </Switch>
              </ConfirmProvider>
            </GrowlProvider>
          </ThemeContext.Provider>
        </UserContext.Provider>
      </ThemeBureauErkenningen>
    </HashRouter>
  );
};

export default App;
