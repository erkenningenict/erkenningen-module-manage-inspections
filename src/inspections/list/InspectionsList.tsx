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

import styles from './InspectionsList.module.css';
import { isAfter } from 'date-fns';
import { nrOfMonthsAfterWhichCommentsAreNotAllowed } from '../../utils/time';
import { Row } from '@erkenningen/ui/layout/row';
import { Col } from '@erkenningen/ui/layout/col';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Datepicker } from '@erkenningen/ui/components/datepicker';
import { Select } from '@erkenningen/ui/components/select';
import { DataTableSortOrderType } from 'primereact/datatable';

type IPagination = {
  pageNumber: number;
  pageSize: number;
  first: number;
};

type ISort = {
  field: string;
  direction: DataTableSortOrderType;
};

type IFilter = {
  courseCode?: string;
  title?: string;
  from?: number;
  to?: number;
  status?: VisitatieStatusEnum | 'Alles';
};

type IPaginationAndSort = IPagination & ISort & IFilter;

const QUERY_PARAMS_KEY = 'erkenningen-module-manage-inspections-list-query-params';

const InspectionsList: React.FC<unknown> = () => {
  const history = useHistory();
  const { search } = useLocation();
  const { showGrowl } = useGrowlContext();

  const setQueryParam = (queryData: IPaginationAndSort) => {
    history.push({
      search: `?pageNumber=${queryData.pageNumber}&pageSize=${queryData.pageSize}&field=${
        queryData.field
      }&direction=${queryData.direction}&courseCode=${queryData.courseCode}&title=${
        queryData.title
      }&from=${queryData.from || ''}&to=${queryData.to || ''}&status=${
        queryData.status || 'Alles'
      }`,
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
    let direction: DataTableSortOrderType = -1;
    if (parsed.direction) {
      direction = parsed.direction as DataTableSortOrderType;
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

  const schema = yup.object().shape({
    courseCode: yup.string().max(10),
    title: yup.string().max(255),
    status: yup.string().max(50).nullable(),
    from: yup.date().nullable(),
    to: yup.date().nullable(),
  });

  const defaultValues = {
    courseCode: pagination.courseCode,
    title: pagination.title,
    status: pagination.status || 'Alles',
    from: pagination.from ? new Date(pagination.from) : null,
    to: pagination.to ? new Date(pagination.to) : null,
  };

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm({ mode: 'onChange', resolver: yupResolver(schema), defaultValues });

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
        status: pagination.status === 'Alles' ? undefined : pagination.status,
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
      <Panel title="Inspecties" doNotIncludeBody={true}>
        <Row>
          <Col>&nbsp;</Col>
        </Row>
        <div className="form-horizontal">
          <form
            onSubmit={handleSubmit((values) => {
              setStateAndQueryParam({
                ...pagination,
                pageNumber: 0,
                first: 0,
                courseCode: values.courseCode,
                title: values.title,
                status: values.status === null ? undefined : (values.status as VisitatieStatusEnum),
                from: values.from?.getTime(),
                to: values.to?.getTime(),
              });
            })}
          >
            <>
              <div className="row">
                <div className="col-sm-6">
                  <div className={`form-group ${errors?.courseCode ? 'has-error' : ''}`}>
                    <label className="control-label col-sm-4">Cursuscode</label>
                    <div className="col-sm-8">
                      <input
                        className="form-control"
                        {...register(`courseCode`)}
                        placeholder="Zoek op cursus code"
                      />

                      {errors?.courseCode && (
                        <span className="help-block">{errors?.courseCode.message}</span>
                      )}
                    </div>
                  </div>
                  <div className={`form-group ${errors?.title ? 'has-error' : ''}`}>
                    <label className="control-label col-sm-4">Titel</label>
                    <div className="col-sm-8">
                      <input
                        className="form-control"
                        {...register(`title`)}
                        placeholder="Zoek op deel van de titel"
                      />

                      {errors?.title && <span className="help-block">{errors?.title.message}</span>}
                    </div>
                  </div>
                  <div className={`form-group ${errors?.status ? 'has-error' : ''}`}>
                    <label className="control-label col-sm-4">Status</label>
                    <div className="col-sm-8">
                      <Controller
                        name="status"
                        control={control}
                        render={({ field: { onChange, value, name } }) => (
                          <Select
                            options={[
                              { label: 'Alles', value: 'Alles' },
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
                            value={value}
                            onChange={onChange}
                            name={name}
                            style={{ width: '100%' }}
                          ></Select>
                        )}
                      />

                      {errors?.title && <span className="help-block">{errors?.title.message}</span>}
                    </div>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className={`form-group ${errors?.from ? 'has-error' : ''}`}>
                    <label className="control-label col-sm-6">Inspectie datum van</label>
                    <div className="col-sm-6">
                      <Controller
                        name="from"
                        control={control}
                        render={({ field: { onChange, value, name } }) => (
                          <Datepicker
                            style={{ width: '100%' }}
                            name={name}
                            onChange={onChange}
                            value={value === null ? undefined : (new Date(value) as Date)}
                            showButtonBar={true}
                            placeholder="Inspectie datum van"
                            showIcon={true}
                            showWeek={true}
                            monthNavigator={true}
                            yearRange="2007:2030"
                          ></Datepicker>
                        )}
                      />

                      {errors?.from && <span className="help-block">{errors?.from.message}</span>}
                    </div>
                  </div>
                  <div className={`form-group ${errors?.to ? 'has-error' : ''}`}>
                    <label className="control-label col-sm-6">Inspectie tot/met</label>
                    <div className="col-sm-6">
                      <Controller
                        name="to"
                        control={control}
                        render={({ field: { onChange, value, name } }) => (
                          <Datepicker
                            style={{ width: '100%' }}
                            name={name}
                            onChange={onChange}
                            value={value === null ? undefined : (value as Date)}
                            showButtonBar={true}
                            placeholder="Inspectie datum tot/met"
                            showIcon={true}
                            showWeek={true}
                            monthNavigator={true}
                            yearNavigator={true}
                            yearRange="2007:2030"
                          ></Datepicker>
                        )}
                      />

                      {errors?.to && <span className="help-block">{errors?.to.message}</span>}
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-6">
                  <div className="form-group">
                    <div className="col-sm-8 col-sm-offset-4">
                      <Button
                        label={'Zoeken'}
                        disabled={!isValid}
                        type="submit"
                        icon="fas fa-search"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </>
          </form>
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
          onSort={(e: {
            sortField: string;
            sortOrder: DataTableSortOrderType;
            multiSortMeta: any;
          }) => {
            setStateAndQueryParam({ ...pagination, field: e.sortField, direction: e.sortOrder });
          }}
          totalRecords={data?.Visitations?.totalCount}
          currentPageReportTemplate="{first} tot {last} van {totalRecords}"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        >
          <Column
            bodyClassName={styles.center}
            body={(row: Visitatie) => (
              <div style={{ display: 'flex' }}>
                <Button
                  label={''}
                  icon="fas fa-info"
                  onClick={() => history.push(`/details/${row.VisitatieID}/${row.SessieID}`)}
                  style={{ fontSize: '1.5rem' }}
                  tooltip="Bekijk details van deze inspectie"
                  buttonType={'info'}
                  title={`${row.VisitatieID}`}
                />

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
                        history.push(
                          `/commentaar-geven/${row.VisitatieID}/${row.SessieID}#discussie`,
                        )
                      }
                      tooltip="Commentaar geven"
                      style={{ fontSize: '1.5rem' }}
                    />
                  )}

                {(row.Status === VisitatieStatusEnum.Ingepland ||
                  row.Status === VisitatieStatusEnum.RapportWordtOpgesteld) &&
                  !row.IsDeclarationPossible &&
                  !row.IsDeclarationSubmitted && (
                    <Button
                      label={''}
                      icon="fas fa-file-alt"
                      onClick={() =>
                        history.push(`/rapport-maken/${row.VisitatieID}/${row.SessieID}`)
                      }
                      tooltip="Rapport maken of wijzigen"
                      style={{ fontSize: '1.5rem' }}
                    />
                  )}
                {row.Status === VisitatieStatusEnum.Ingediend &&
                  row.IsDeclarationPossible &&
                  !row.IsDeclarationSubmitted && (
                    <Button
                      label={''}
                      icon="fas fa-receipt"
                      onClick={() => history.push(`/declaratie-indienen/${row.VisitatieID}`)}
                      tooltip="Declaratie indienen"
                      buttonType="secondary"
                      style={{ fontSize: '1.5rem' }}
                    />
                  )}
                {row.Status === VisitatieStatusEnum.Ingediend &&
                  !row.IsDeclarationPossible &&
                  row.IsDeclarationSubmitted && (
                    <Button
                      label={''}
                      icon="fas fa-file-invoice"
                      onClick={() => history.push(`/factuur-bekijken/${row.VisitatieID}`)}
                      buttonType="info"
                      tooltip="Factuur beschikbaar"
                      style={{ fontSize: '1.5rem' }}
                    />
                  )}
              </div>
            )}
          />
          <Column
            field="DatumVisitatie"
            header={'Inspectie'}
            sortable={true}
            sortField={'DatumVisitatie'}
            body={(row: any) => (
              <>
                {toDutchDate(row.DatumVisitatie)}
                <br />
                <span style={{ fontSize: '90%' }}>{row.Inspecteur.SortableFullName}</span>
              </>
            )}
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
            body={(row: Visitatie) => {
              return (
                row.Status === VisitatieStatusEnum.Ingediend && (
                  <>
                    <div className={styles.reportNumberColumn}>
                      <div style={{ width: '20px' }} className={styles.reportNumber}>
                        {row.Rapportcijfer ? row.Rapportcijfer : ''}
                      </div>
                      <div className={styles.icon}>
                        {row.Rapportcijfer && row?.Rapportcijfer < 5 && row.Status === 'Ingediend' && (
                          <>
                            <Tooltip target=".negative" position={'top'} />
                            <i
                              className="fas fa-times-circle negative"
                              style={{ color: 'red' }}
                              data-pr-tooltip="Negatief"
                            ></i>
                          </>
                        )}
                        {row.Rapportcijfer && row?.Rapportcijfer > 5 && row.Status === 'Ingediend' && (
                          <>
                            <Tooltip target=".positive" position={'top'} />
                            <i
                              className="fas fa-check-circle positive"
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
                )
              );
            }}
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
            field="Cursus:Titel"
            header={'Titel'}
            sortable={true}
            body={(row: any) => row.Cursus.Titel}
          />
          <Column
            field="Status"
            header={''}
            sortable={false}
            body={(row: any) =>
              (row.Status === VisitatieStatusEnum.Ingepland && (
                <>
                  <Tooltip target=".planned" position={'top'} />
                  <i
                    className="fas fa-calendar-day planned"
                    style={{ color: 'orange' }}
                    data-pr-tooltip="Ingepland"
                  ></i>
                </>
              )) ||
              (row.Status === VisitatieStatusEnum.RapportWordtOpgesteld && (
                <>
                  <Tooltip target=".reportInProgress" position={'top'} />
                  <i
                    className="fas fa-calendar-day reportInProgress"
                    style={{ color: 'blue' }}
                    data-pr-tooltip="Rapport wordt opgesteld..."
                  ></i>
                </>
              )) ||
              (row.Status === VisitatieStatusEnum.Ingediend && (
                <>
                  <Tooltip target=".submitted" position={'top'} />
                  <i
                    className="fas fa-file-signature submitted"
                    style={{ color: 'green' }}
                    data-pr-tooltip="Ingediend"
                  ></i>
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
                    : toDutchDate(row.DatumRapport)}
                </div>
                <div style={{ fontSize: '90%' }}>{row.LastChangeBy}</div>
              </>
            )}
          />
        </DataTable>
      </Panel>
    </div>
  );
};

export default InspectionsList;
