import React, { FC, useCallback } from 'react';
import { css, cx } from 'emotion';
import { selectors as e2eSelectors } from '@grafana/e2e-selectors';
import { TagList, Card, useStyles } from '@grafana/ui';
import { GrafanaTheme } from '@grafana/data';
import { DashboardSectionItem, OnToggleChecked } from '../../types';
import { SEARCH_ITEM_HEIGHT_CUSTOM } from '../../constantsCustom';
import { Branding } from 'app/core/components/Branding/Branding';

export interface Props {
  item: DashboardSectionItem;
  editable?: boolean;
  onTagSelected: (name: string) => any;
  onToggleChecked?: OnToggleChecked;
}

const selectors = e2eSelectors.pages.Dashboards;

export const SearchItemCustom: FC<Props> = ({ item, editable, onToggleChecked, onTagSelected }) => {
  const styles = useStyles(getStyles);
  const tagSelected = useCallback((tag: string, event: React.MouseEvent<HTMLElement>) => {
    onTagSelected(tag);
  }, []);

  return (
    <Card
      aria-label={selectors.dashboards(item.title)}
      heading={item.title}
      href={item.url}
      style={{ minHeight: SEARCH_ITEM_HEIGHT_CUSTOM }}
      className={cx(styles.container, styles.list)}
    >
      <Card.Figure align={'center'}>
        <Branding.DashboardLightIcon />
      </Card.Figure>
      <Card.Tags>
        <TagList tags={item.tags} onClick={tagSelected} />
      </Card.Tags>
    </Card>
  );
};

const getStyles = (theme: GrafanaTheme) => {
  return {
    container: css`
      background-color: ${theme.palette.gray85};
    `,
    list: css`
      color: ${theme.palette.white};
    `,
  };
};
