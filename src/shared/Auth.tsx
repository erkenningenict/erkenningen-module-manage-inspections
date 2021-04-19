import React from 'react';

import { DeepPartial } from 'ts-essentials';
import { My, useGetMyQuery } from '../generated/graphql';

export enum Roles {
  Beoordelaar = 'Beoordelaar',
  Boekhouder = 'Boekhouder',
  Examinator = 'Examinator',
  Hoogleraar = 'Hoogleraar',
  Inspecteur = 'Inspecteur',
  Rector = 'Rector',
  Student = 'Student',
}

export const UserContext = React.createContext<DeepPartial<My> | undefined>(undefined);

export const useAuth = (): {
  loading: boolean;
  error: boolean;
  authenticated: boolean;
  my?: DeepPartial<My>;
} => {
  const { loading, error, data } = useGetMyQuery();

  let authenticated = false;
  let hasError = false;

  if (error) {
    // Check if it's an authentication error
    if (error.graphQLErrors) {
      for (const err of error.graphQLErrors) {
        if (!err.extensions || err.extensions.code !== 'UNAUTHENTICATED') {
          hasError = true;
        }
      }
    }
  } else if (data && data.my && data.my.Persoon) {
    authenticated = true;
  }

  return { loading, error: hasError, authenticated, my: data?.my };
};

export const hasRole = (role: Roles, currentRoles?: string[]): boolean =>
  currentRoles ? currentRoles.includes(role) : false;

export const hasOneOfRoles = (roles: Roles[], currentRoles?: string | string[]): boolean =>
  currentRoles ? roles.some((role: Roles) => currentRoles.includes(role)) : false;

export const hasAllRoles = (roles: Roles[], currentRoles?: string[]): boolean =>
  currentRoles ? roles.every((role: Roles) => currentRoles.includes(role)) : false;
