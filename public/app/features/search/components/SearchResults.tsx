import React, { FC, useCallback, useEffect } from 'react';
import { css } from 'emotion';
import { FixedSizeList } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { GrafanaTheme } from '@grafana/data';
import { stylesFactory, useTheme, Spinner } from '@grafana/ui';
import { selectors } from '@grafana/e2e-selectors';
import { DashboardSection, OnToggleChecked, SearchLayout } from '../types';
import { SEARCH_ITEM_HEIGHT, SEARCH_ITEM_MARGIN } from '../constants';
import { SearchItem } from './SearchItem';
import { FileSection } from './FileSection';
import { getBackendSrv } from '@grafana/runtime';

export interface Props {
  editable?: boolean;
  loading?: boolean;
  onTagSelected: (name: string) => any;
  onToggleChecked?: OnToggleChecked;
  onToggleSection: (section: DashboardSection) => void;
  results: DashboardSection[];
  layout?: string;
  fileArray?: any;
  assignFile?: any;
  resetFile?: any;
}

const { section: sectionLabel, items: itemsLabel } = selectors.components.Search;

export const SearchResults: FC<Props> = ({
  editable,
  loading,
  onTagSelected,
  onToggleChecked,
  onToggleSection,
  results,
  layout,
  fileArray,
  assignFile,
  resetFile,
}) => {
  const theme = useTheme();
  const styles = getSectionStyles(theme);
  const itemProps = { editable, onToggleChecked, onTagSelected };
  const renderFolders = useCallback(() => {
    const title = results.map((item: any) => item.title.toLowerCase());
    const uid = results.map((item: any) => item.uid);
    console.log({ title, uid });
    useEffect(() => {
      getBackendSrv()
        .post('/fileload', { title, uid })
        .then((data) => {
          console.log(data);
          console.log(Array.from(new Set(data.filename)));
          resetFile(Array.from(new Set(data.filename)));
          assignFile(data.filename);
        });
    }, []);
    return (
      <div className={styles.wrapper}>
        {fileArray?.length === 0 ? (
          <div></div>
        ) : (
          fileArray.map((item: any, index: number) => {
            return (
              <FileSection
                key={index}
                fileName={item}
                results={results}
                itemProps={itemProps}
                onToggleSection={onToggleSection}
                onToggleChecked={onToggleChecked}
                editable={editable}
                sectionLabel={sectionLabel}
                itemsLabel={itemsLabel}
              />
            );
          })
        )}
      </div>
    );
  }, [results]);
  const renderDashboards = () => {
    const items = results[0]?.items;
    return (
      <div className={styles.listModeWrapper}>
        <AutoSizer disableWidth>
          {({ height }) => (
            <FixedSizeList
              aria-label="Search items"
              className={styles.wrapper}
              innerElementType="ul"
              itemSize={SEARCH_ITEM_HEIGHT + SEARCH_ITEM_MARGIN}
              height={height}
              itemCount={items.length}
              width="100%"
            >
              {({ index, style }) => {
                const item = items[index];
                // The wrapper div is needed as the inner SearchItem has margin-bottom spacing
                // And without this wrapper there is no room for that margin
                return (
                  <div style={style}>
                    <SearchItem key={item.id} {...itemProps} item={item} />
                  </div>
                );
              }}
            </FixedSizeList>
          )}
        </AutoSizer>
      </div>
    );
  };

  if (loading) {
    return <Spinner className={styles.spinner} />;
  } else if (!results || !results.length) {
    return <div className={styles.noResults}>No dashboards matching your query were found.</div>;
  }

  return (
    <div className={styles.resultsContainer}>
      {layout === SearchLayout.Folders ? renderFolders() : renderDashboards()}
    </div>
  );
};

const getSectionStyles = stylesFactory((theme: GrafanaTheme) => {
  const { md } = theme.spacing;

  return {
    wrapper: css`
      display: flex;
      flex-direction: column;
    `,
    section: css`
      display: flex;
      flex-direction: column;
      background: ${theme.colors.panelBg};
      border-bottom: solid 1px ${theme.colors.border2};
    `,
    sectionItems: css`
      margin: 0 24px 0 32px;
    `,
    spinner: css`
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100px;
    `,
    resultsContainer: css`
      position: relative;
      flex-grow: 10;
      margin-bottom: ${md};
      background: ${theme.colors.bg1};
      border: 1px solid ${theme.colors.border1};
      border-radius: 3px;
      height: 100%;
    `,
    noResults: css`
      padding: ${md};
      background: ${theme.colors.bg2};
      font-style: italic;
      margin-top: ${theme.spacing.md};
    `,
    listModeWrapper: css`
      position: relative;
      height: 100%;
      padding: ${md};
    `,
  };
});
