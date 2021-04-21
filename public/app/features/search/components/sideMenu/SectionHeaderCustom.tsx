import React, { FC, useEffect } from 'react';
import { css, cx } from 'emotion';
import { useLocalStorage } from 'react-use';
import { GrafanaTheme } from '@grafana/data';
import { Icon, Spinner, stylesFactory, useTheme } from '@grafana/ui';
import { DashboardSection, OnToggleChecked } from '../../types';
// import { SearchCheckbox } from './SearchCheckbox';
import { getSectionIcon, getSectionStorageKey } from '../../utils';
import { getBackendSrv } from '@grafana/runtime';

interface SectionHeaderProps {
  editable?: boolean;
  onSectionClick: (section: DashboardSection) => void;
  onToggleChecked?: OnToggleChecked;
  section: DashboardSection;
  results: any;
  arrangeDashboard?: any;
}

export const SectionHeaderCustom: FC<SectionHeaderProps> = ({
  section,
  onSectionClick,
  onToggleChecked,
  editable = false,
  results,
  arrangeDashboard,
}) => {
  const theme = useTheme();
  const styles = getSectionHeaderStyles(theme, section.selected, editable);
  const setSectionExpanded = useLocalStorage(getSectionStorageKey(section.title), true)[1];

  const uid = results
    .filter((element: any) => element?.title === section?.title)[0]
    ?.items.map((item: any) => item.uid);
  const title = results
    .filter((element: any) => element?.title === section?.title)[0]
    ?.items.map((item: any) => item.title);

  useEffect(() => {
    getBackendSrv()
      .post('/fileload', { uid, title })
      .then((data: any) => {
        // arrangeDashboard({ order: data?.order, uidOrder: data?.uid });
      });
  }, [section]);

  const onSectionExpand = () => {
    setSectionExpanded(!section.expanded);
    onSectionClick(section);
  };

  return (
    <div
      className={styles.wrapper}
      onClick={onSectionExpand}
      aria-label={section.expanded ? `Collapse folder ${section.id}` : `Expand folder ${section.id}`}
    >
      <div className={styles.icon}>
        <Icon name={getSectionIcon(section)} />
      </div>
      <div className={styles.text}>{section.title}</div>
      {section.itemsFetching ? (
        <Spinner />
      ) : (
        <div
          className={css`
            margin-right: 5px;
          `}
        >
          <Icon name={section.expanded ? 'angle-down' : 'angle-right'} />
        </div>
      )}
    </div>
  );
};

const getSectionHeaderStyles = stylesFactory((theme: GrafanaTheme, selected = false, editable: boolean) => {
  const { sm } = theme.spacing;
  return {
    wrapper: cx(
      css`
        display: flex;
        align-items: center;
        font-size: ${theme.typography.size.base};
        padding: 8px;
        color: ${theme.colors.textWeak};
        background-color: ${theme.colors.dropdownBg};

        &:hover {
          color: ${theme.colors.textStrong};
        }
      `,
      'pointer',
      { selected }
    ),
    icon: css`
      padding: 0 ${sm} 0 ${editable ? 0 : sm};
    `,
    text: css`
      flex-grow: 1;
      line-height: 24px;
    `,
    link: css`
      padding: 2px 10px 0;
      color: ${theme.colors.textWeak};
      opacity: 0;
      transition: opacity 150ms ease-in-out;
    `,
    separator: css`
      margin-right: 6px;
    `,
  };
});
