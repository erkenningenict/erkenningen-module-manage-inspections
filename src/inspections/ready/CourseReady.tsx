import React from 'react';
import { Link } from 'react-router-dom';

import { Panel } from '@erkenningen/ui/layout/panel';
import { Button } from '@erkenningen/ui/components/button';

import styles from './CourseReady.module.scss';

const CourseReady: React.FC<unknown> = () => {
  return (
    <>
      <Panel title="Nieuw examen maken en plannen">
        <Link to="/nieuw">
          <Button label={'Nog een examen maken'} icon="pi pi-plus" className={styles.firstButton} />
        </Link>

        <Link to="/overzicht">
          <Button label={'Naar overzicht'} type="secondary" icon="pi pi-list" />
        </Link>
      </Panel>
    </>
  );
};

export default CourseReady;
