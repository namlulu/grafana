import React, { FC, useCallback } from 'react';
import { css, cx } from 'emotion';
import { selectors as e2eSelectors } from '@grafana/e2e-selectors';
import { TagList, Card, useStyles, useTheme } from '@grafana/ui';
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
  const theme = useTheme();

  const handleOnClick = (event: any) => {
    const itemArray = document.querySelectorAll('#dashboardItem');
    itemArray.forEach((element) => {
      console.log(element);
    });
    event?.target?.classList.add(cx(styles.emphasize));
    console.log(event);
    console.log(itemArray);
  };

  return (
    <div onClick={handleOnClick} id={'dashboardItem'}>
      <Card
        aria-label={selectors.dashboards(item?.title)}
        heading={item?.title}
        href={item?.url}
        style={{ minHeight: SEARCH_ITEM_HEIGHT_CUSTOM }}
        className={cx(styles.container)}
      >
        <Card.Figure align={'center'}>
          {theme.isLight ? <Branding.DashboardLightIcon /> : <Branding.DashboardDarkIcon />}
        </Card.Figure>
        <Card.Tags>
          <TagList tags={item?.tags} onClick={tagSelected} />
        </Card.Tags>
      </Card>
    </div>
  );
};

const getStyles = (theme: GrafanaTheme) => {
  return {
    container: css`
      background-color: ${theme.colors.bg2};
      padding: 8px;
      &:hover {
        background-color: ${theme.colors.bg3};
      }
    `,
    emphasize: css`
      color: red;
    `,
  };
};
