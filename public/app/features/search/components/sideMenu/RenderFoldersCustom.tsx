import React, { useEffect } from 'react';
import { css, cx } from 'emotion';
import { GrafanaTheme } from '@grafana/data';
import { stylesFactory, useTheme } from '@grafana/ui';
import { getBackendSrv } from '@grafana/runtime';
import { FileSectionCustom } from './FileSectionCustom';
import { SearchItemCustom } from './SearchItemCustom';
import { SectionHeaderCustom } from './SectionHeaderCustom';

export const RenderFoldersCustom = (props: any) => {
  // props
  const title: any = props.title;
  const uid: any = props.uid;
  const resetFile: any = props.resetFile;
  const assignFile: any = props.assignFile;
  const fileArray: any = props.fileArray;
  const results: any = props.results;
  const itemProps: any = props.itemProps;
  const onToggleSection: any = props.onToggleSection;
  const onToggleChecked: any = props.onToggleChecked;
  const editable: any = props.editable;
  const sectionLabel: any = props.sectionLabel;
  const itemsLabel: any = props.itemsLabel;
  const general: any = props.general;

  const theme = useTheme();
  const styles = getSectionStyles(theme);

  useEffect(() => {
    getBackendSrv()
      .post('/fileload', { title, uid })
      .then((data) => {
        resetFile(Array.from(new Set(data.filename)));
        assignFile(data.filename);
      });
  }, []);
  return (
    <div className={styles.wrapper}>
      {fileArray?.length === 0 ? (
        <div></div>
      ) : (
        <>
          {fileArray.map((item: any, index: number) => {
            return (
              <div
                key={index}
                className={css`
                  margin-bottom: 3px;
                  border: 1px solid ${theme.colors.border2};
                `}
              >
                <FileSectionCustom
                  fileName={item}
                  results={results}
                  itemProps={itemProps}
                  onToggleSection={onToggleSection}
                  onToggleChecked={onToggleChecked}
                  editable={editable}
                  sectionLabel={sectionLabel}
                  itemsLabel={itemsLabel}
                />
              </div>
            );
          })}
          {general.length > 0 ? (
            <div
              className={cx(
                styles.wrapper,
                css`
                  border: 1px solid ${theme.colors.border2};
                `
              )}
            >
              {general.map((section: any) => {
                return (
                  <div aria-label={sectionLabel} className={styles.section} key={section.id || section.title}>
                    <SectionHeaderCustom onSectionClick={onToggleSection} {...{ onToggleChecked, editable, section }} />
                    {section.expanded && (
                      <div aria-label={itemsLabel} className={styles.sectionItems}>
                        {section.items.map((item: any) => (
                          <SearchItemCustom key={item.id} {...itemProps} item={item} />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div></div>
          )}
        </>
      )}
    </div>
  );
};

const getSectionStyles = stylesFactory((theme: GrafanaTheme) => {
  const { md } = theme.spacing;
  return {
    wrapper: css`
      display: flex;
      flex-direction: column;
      background-color: ${theme.colors.bg2};
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
      /* border: 1px solid ${theme.colors.border1}; */
      border-radius: 3px;
    `,
    noResults: css`
      padding: ${md};
      background: ${theme.palette.gray15};
      font-style: italic;
      margin-top: ${theme.spacing.md};
    `,
    listModeWrapper: css`
      position: relative;
      height: 100%;
      padding: ${md};
    `,
    section: css`
      display: flex;
      flex-direction: column;
      background: ${theme.colors.panelBg};
    `,
    sectionItems: css`
      padding-top: 8px;
      padding-left: 8px;
      padding-right: 8px;
    `,
  };
});
