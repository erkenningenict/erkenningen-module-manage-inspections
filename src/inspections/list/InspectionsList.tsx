import React, { useEffect, useState } from 'react';

import { useHistory, useLocation } from 'react-router-dom';
import * as qs from 'query-string';
import * as yup from 'yup';
import { Column } from 'primereact/column';
import { Tooltip } from 'primereact/tooltip';

import { Alert } from '@erkenningen/ui/components/alert';
import { Button } from '@erkenningen/ui/components/button';
import {
  SortDirectionEnum,
  useGetVisitationsLazyQuery,
  Visitatie,
  VisitatieStatusEnum,
} from 'generated/graphql';
import { DataTable } from '@erkenningen/ui/components/datatable';
import { Panel } from '@erkenningen/ui/layout/panel';
import { toDutchDate } from '@erkenningen/ui/utils';
import { useGrowlContext } from '@erkenningen/ui/components/growl';
import add from 'date-fns/add';

import styles from './InspectionsList.module.scss';
import Form from 'components/Form';
import { FormCalendar, FormItem, FormSelect, FormText } from '@erkenningen/ui/components/form';
import { isAfter } from 'date-fns';
import { nrOfMonthsAfterWhichCommentsAreNotAllowed } from '../../utils/time';

type IPagination = {
  pageNumber: number;
  pageSize: number;
  first: number;
};

type ISort = {
  field: string;
  direction: number;
};

type IFilter = {
  courseCode?: string;
  title?: string;
  from?: number;
  to?: number;
  status?: VisitatieStatusEnum;
};

type IPaginationAndSort = IPagination & ISort & IFilter;

const QUERY_PARAMS_KEY = 'erkenningen-module-manage-inspections-list-query-params';

const InspectionsList: React.FC<unknown> = () => {
  const history = useHistory();
  const { search } = useLocation();
  const { showGrowl } = useGrowlContext();
  // const confirm = useConfirm();

  const setQueryParam = (queryData: IPaginationAndSort) => {
    history.push({
      search: `?pageNumber=${queryData.pageNumber}&pageSize=${queryData.pageSize}&field=${
        queryData.field
      }&direction=${queryData.direction}&courseCode=${queryData.courseCode}&title=${
        queryData.title
      }&from=${queryData.from || ''}&to=${queryData.to || ''}`,
    });
  };

  const parseQueryParams = (): IPaginationAndSort => {
    const parsed = qs.parse(search, { parseNumbers: true });

    // Check if a previous stored query exists
    if (!Object.keys(parsed).length) {
      const queryData = sessionStorage.getItem(QUERY_PARAMS_KEY);
      if (queryData) {
        const queryDataParsed = JSON.parse(queryData);
        setQueryParam(queryDataParsed);
        return queryDataParsed;
      }
    }

    let pageNumber = 0;
    if (Number.isInteger(parsed.pageNumber)) {
      pageNumber = parsed.pageNumber as number;
    }
    let pageSize = 10;
    if (Number.isInteger(parsed.pageSize)) {
      pageSize = parsed.pageSize as number;
    }
    let field = 'DatumVisitatie';
    if (parsed.field) {
      field = parsed.field as string;
    }
    let direction = -1;
    if (parsed.direction) {
      direction = parsed.direction as number;
    }

    let courseCode = '';
    if (parsed.courseCode) {
      courseCode = parsed.courseCode as string;
    }

    let title = '';
    if (parsed.title) {
      title = parsed.title as string;
    }

    let from = undefined;
    if (parsed.from) {
      from = parsed.from as number;
    }

    let to = undefined;
    if (parsed.to) {
      to = parsed.to as number;
    }
    let status = undefined;
    if (parsed.status) {
      status = parsed.status as VisitatieStatusEnum;
    }

    return {
      first: pageNumber * pageSize,
      pageNumber,
      pageSize,
      field,
      status,
      direction,
      courseCode,
      title,
      from,
      to,
    };
  };

  const [pagination, setPagination] = useState<IPaginationAndSort>(parseQueryParams());

  const [getInspections, { loading, data, error }] = useGetVisitationsLazyQuery({
    fetchPolicy: 'cache-and-network',
    variables: {
      input: {
        pageNumber: pagination.pageNumber,
        pageSize: pagination.pageSize || 10,
        orderBy: {
          field: pagination.field,
          sortDirection:
            pagination.direction === 1 ? SortDirectionEnum.Asc : SortDirectionEnum.Desc,
        },
        courseCode: pagination.courseCode,
        status: pagination.status,
        title: pagination.title,
        from: pagination.from,
        to: pagination.to,
      },
    },
    onError() {
      showGrowl({
        severity: 'error',
        summary: 'Examenvakken ophalen',
        sticky: true,
        detail: `Er is een fout opgetreden bij het ophalen van de examenvakken. Controleer uw invoer of neem contact met ons op.`,
      });
    },
  });

  // const [deleteExam] = useDeleteExamMutation({
  //   onCompleted() {
  //     showGrowl({
  //       severity: 'success',
  //       summary: 'Examen verwijderd',
  //       detail: 'Het examen is succesvol verwijderd.',
  //     });
  //     if (refetch) {
  //       refetch();
  //     }
  //   },
  //   onError(e) {
  //     showGrowl({
  //       severity: 'error',
  //       summary: 'Examen niet verwijderd',
  //       sticky: true,
  //       detail: `Er is een fout opgetreden bij het verwijderen van het examen: ${e.message}`,
  //     });
  //   },
  // });

  useEffect(() => {
    getInspections();
  }, [pagination.pageNumber, pagination.pageSize, pagination.direction, pagination.field]);

  const setStateAndQueryParam = (updatePagination: IPaginationAndSort) => {
    setQueryParam(updatePagination);
    setPagination({ ...updatePagination });
  };

  if (error) {
    console.log('error', error);
    return (
      <Alert type="danger">
        Er is een fout opgetreden, probeer het later opnieuw. Fout informatie:{' '}
        <>
          {error?.graphQLErrors.map((e, index) => (
            <div key={index}>{e.message}</div>
          ))}
        </>
      </Alert>
    );
  }

  return (
    <div>
      <Panel title="Inspecties">
        <div className="form-horizontal">
          <Form
            schema={{
              courseCode: [pagination.courseCode, yup.string().max(10)],
              title: [pagination.title, yup.string().max(255)],
              status: [
                pagination.status ? pagination.status : null,
                yup.string().max(15).nullable(),
              ],
              from: [pagination.from ? new Date(pagination.from) : null, yup.date().nullable()],
              to: [pagination.to ? new Date(pagination.to) : null, yup.date().nullable()],
            }}
            onSubmit={(values: any) => {
              setStateAndQueryParam({
                ...pagination,
                pageNumber: 0,
                first: 0,
                courseCode: values.courseCode,
                title: values.title,
                status: values.status,
                from: values.from?.getTime(),
                to: values.to?.getTime(),
              });
            }}
          >
            {() => (
              <>
                <div className="row">
                  <div className="col-sm-6">
                    <FormText
                      name={'courseCode'}
                      label={'Cursuscode'}
                      labelClassNames={'col-sm-4'}
                      formControlClassName="col-sm-8"
                    />
                    <FormText
                      name={'title'}
                      label={'Titel'}
                      labelClassNames={'col-sm-4'}
                      formControlClassName="col-sm-8"
                    />
                    <FormSelect
                      name={'status'}
                      label={'Status'}
                      labelClassNames={'col-sm-4'}
                      formControlClassName="col-sm-8"
                      options={[
                        { label: 'Alles', value: null },
                        {
                          label: VisitatieStatusEnum.Ingepland,
                          value: VisitatieStatusEnum.Ingepland,
                        },
                        {
                          label: 'Rapport wordt opgesteld',
                          value: VisitatieStatusEnum.RapportWordtOpgesteld,
                        },
                        {
                          label: VisitatieStatusEnum.Ingediend,
                          value: VisitatieStatusEnum.Ingediend,
                        },
                      ]}
                    />
                  </div>
                  <div className="col-sm-6">
                    <FormCalendar
                      name={'from'}
                      label={'Datum inspectie van'}
                      showButtonBar={true}
                      labelClassNames={'col-sm-4'}
                      formControlClassName="col-sm-8"
                    />
                    <FormCalendar
                      name={'to'}
                      label={'Datum inspectie tot/met'}
                      showButtonBar={true}
                      labelClassNames={'col-sm-4'}
                      formControlClassName="col-sm-8"
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-6">
                    <FormItem
                      label={''}
                      labelClassNames={'col-sm-4'}
                      formControlClassName={'col-sm-8 col-sm-offset-4'}
                    >
                      <Button label={'Zoeken'} buttonType="submit" />
                    </FormItem>
                  </div>
                </div>
              </>
            )}
          </Form>
        </div>

        <DataTable
          value={data?.Visitations?.nodes}
          lazy={true}
          dataKey="VisitatieID"
          emptyMessage="Geen inspecties gevonden. Controleer filter criteria."
          autoLayout={true}
          loading={loading}
          paginator={true}
          rows={pagination.pageSize || 10}
          rowsPerPageOptions={[10, 25, 50, 100]}
          first={pagination.first}
          onPage={(e: { first: number; rows: number; page: number; pageCount: number }) => {
            if (e.pageCount === 1) {
              return;
            }
            setStateAndQueryParam({
              ...pagination,
              pageNumber: e.page,
              pageSize: e.rows,
              first: e.first,
            });
          }}
          sortField={pagination.field}
          sortOrder={pagination.direction}
          onSort={(e: { sortField: string; sortOrder: number; multiSortMeta: any }) => {
            setStateAndQueryParam({ ...pagination, field: e.sortField, direction: e.sortOrder });
          }}
          totalRecords={data?.Visitations?.totalCount}
          currentPageReportTemplate="{first} tot {last} van {totalRecords}"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        >
          <Column
            bodyClassName={styles.center}
            body={(row: Visitatie) => (
              <>
                <Button
                  label={''}
                  icon="fas fa-info"
                  onClick={() => history.push(`/details/${row.VisitatieID}/${row.SessieID}`)}
                  style={{ fontSize: '1rem' }}
                  tooltip="Bekijk details van deze inspectie"
                  type={'info'}
                />
              </>
            )}
          />
          <Column
            bodyClassName={styles.center}
            body={(row: Visitatie) => (
              <>
                {row.DatumRapport &&
                  isAfter(
                    add(new Date(row.DatumRapport), {
                      months: nrOfMonthsAfterWhichCommentsAreNotAllowed,
                    }),
                    new Date(),
                  ) && (
                    <Button
                      label={''}
                      icon="fas fa-comment"
                      onClick={() =>
                        history.push(`/commentaar-geven/${row.VisitatieID}/${row.SessieID}`)
                      }
                      tooltip="Commentaar geven"
                      style={{ fontSize: '1rem' }}
                    />
                  )}
              </>
            )}
          />
          <Column
            bodyClassName={styles.center}
            body={(row: Visitatie) => (
              <>
                {row.Status === VisitatieStatusEnum.Ingepland && (
                  <Button
                    label={''}
                    icon="fas fa-file-alt"
                    onClick={() =>
                      history.push(`/rapport-maken/${row.VisitatieID}/${row.SessieID}`)
                    }
                    tooltip="Rapport maken"
                    style={{ fontSize: '1rem' }}
                  />
                )}
              </>
            )}
          />
          <Column
            field="DatumVisitatie"
            header={'Inspectie'}
            sortable={true}
            sortField={'DatumVisitatie'}
            body={(row: any) => toDutchDate(row.DatumVisitatie)}
            style={{ minWidth: '92px' }}
          />
          <Column
            field="DatumRapport"
            header={'Rapport'}
            sortable={true}
            sortField={'DatumRapport'}
            body={(row: any) => toDutchDate(row.DatumRapport)}
            style={{ minWidth: '92px' }}
          />
          <Column
            field="Rapportcijfer"
            header={'Cijfer'}
            sortable={true}
            sortField={'Rapportcijfer'}
            body={(row: any) => (
              <>
                <div className={styles.reportNumberColumn}>
                  <div style={{ width: '20px' }} className={styles.reportNumber}>
                    {row.Rapportcijfer ? row.Rapportcijfer : ''}
                  </div>
                  <div className={styles.icon}>
                    {row.Rapportcijfer < 5 && row.Status === 'Ingediend' && (
                      <>
                        <Tooltip target=".negative" position={'top'} />
                        <i
                          className="fas fa-check-circle negative"
                          style={{ color: 'red' }}
                          data-pr-tooltip="Negatief"
                        ></i>
                      </>
                    )}
                    {row.Rapportcijfer > 5 && row.Status === 'Ingediend' && (
                      <>
                        <Tooltip target=".positive" position={'top'} />
                        <i
                          className="fas fa-times-circle positive"
                          style={{ color: 'green' }}
                          data-pr-tooltip="Positief"
                        ></i>
                      </>
                    )}
                  </div>
                  <div style={{ width: '20px' }}>
                    {row.VolgensIntentieAanbod === false && (
                      <>
                        <Tooltip target=".notToIntention" position={'top'} />
                        <i
                          className="fas fa-exclamation-circle notToIntention"
                          style={{ color: 'yellow', background: '#333', borderRadius: '8px' }}
                          data-pr-tooltip="Niet volgens de intentie van het aanbod"
                        ></i>
                      </>
                    )}
                  </div>
                </div>
              </>
            )}
            style={{ minWidth: '58px' }}
          />
          <Column
            field="CursusCode"
            header={'Cursuscode'}
            sortable={true}
            style={{ minWidth: '110px' }}
            body={(row: any) => row.Cursus.CursusCode}
          />
          <Column
            field="Titel"
            header={'Titel'}
            sortable={true}
            body={(row: any) => row.Cursus.Titel}
          />
          <Column
            field="Status"
            header={''}
            sortable={false}
            body={(row: any) =>
              (row.Status === 'Ingepland' && (
                <>
                  <Tooltip target=".planned" position={'top'} />
                  <i className="fas fa-calendar-day planned" data-pr-tooltip="Ingepland"></i>
                </>
              )) ||
              (row.Status === 'Ingediend' && (
                <>
                  <Tooltip target=".submitted" position={'top'} />
                  <i className="fas fa-file-signature submitted" data-pr-tooltip="Ingediend"></i>
                </>
              ))
            }
          />
          <Column
            field="LastChangeDate"
            header={'Commentaar gegeven'}
            sortable={true}
            body={(row: any) => (
              <>
                <div>
                  {row.LastChangeDate
                    ? toDutchDate(row.LastChangeDate, { includeTime: true })
                    : toDutchDate(row.DatumRapport, { includeTime: true })}
                </div>
                <div className="">{row.LastChangeBy}</div>
              </>
            )}
          />
          {/* <Column
            field="Lokatie"
            header={'Locatie'}
            sortField={'Sessies:Lokatie:Naam'}
            sortable={true}
            body={(row: any) =>
              `${row.Sessies[0]?.Lokatie?.Naam} | ${
                row.Sessies[0]?.Lokatie?.Contactgegevens?.Woonplaats || ''
              }`
            }
            style={{ minWidth: '180px' }}
          />
          <Column
            field="AantalCursusDeelnames"
            sortField={'AantalCursusDeelnames'}
            sortable={true}
            headerStyle={{ width: '6rem' }}
            bodyClassName={styles.center}
            header={
              <>
                <Tooltip target=".numParticipants" position={'top'} />
                <i className={'fas fa-users numParticipants'} data-pr-tooltip="Aantal deelnemers" />
              </>
            }
          /> */}
        </DataTable>
      </Panel>
    </div>
  );
};

export default InspectionsList;
