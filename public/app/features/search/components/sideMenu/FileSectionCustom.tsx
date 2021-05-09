import React, { useState, useEffect } from 'react';
import { GrafanaTheme } from '@grafana/data';
import { Icon, stylesFactory, useTheme } from '@grafana/ui';
import { css } from 'emotion';
import { SearchItemCustom } from './SearchItemCustom';
import { SectionHeaderCustom } from './SectionHeaderCustom';

export const FileSectionCustom = ({
  fileName,
  results,
  sectionLabel,
  itemsLabel,
  itemProps,
  onToggleSection,
  onToggleChecked,
  editable,
  arrangeDashboard,
}: any) => {
  const [isVisable, setIsVisable] = useState<boolean>(false);
  const theme = useTheme();
  const styles = getSectionStyles(theme, isVisable);

  useEffect(() => {
    const setFileExpanded: any = localStorage.getItem('openFile');
    const setSectionExpanded: any = localStorage.getItem('openDefault');
    const labName: string = JSON.parse(setFileExpanded);
    const equiipName: string = JSON.parse(setSectionExpanded);
    const findSection: any = results.find((item: any) => item?.title === equiipName);

    if (fileName === labName) {
      setIsVisable(true);
      if (findSection?.title === equiipName) {
        onToggleSection(findSection);
      }
    }
  }, []);

  console.log(results);

  return (
    <>
      <div
        onClick={() => setIsVisable(!isVisable)}
        className={css`
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px;
          padding-left: 10px;
          font-size: 14px;
          color: ${theme.colors.textWeak};
          background-color: ${theme.colors.dropdownBg};
          border-radius: 5px;
          font-family: 'Roboto', 'Helvetica Neue', Arial, sans-serif;
          &:hover {
            color: ${theme.colors.textStrong};
          }
        `}
      >
        <div>
          {isVisable ? (
            <Icon
              className={css`
                margin-right: 5px;
              `}
              name="folder-open"
            />
          ) : (
            <Icon
              className={css`
                margin-right: 5px;
              `}
              name="folder"
            />
          )}
          <span className={css``}>{fileName}</span>
        </div>
        <div>{isVisable ? <Icon name="angle-down" /> : <Icon name="angle-right" />}</div>
      </div>
      <div className={styles.fileSection}>
        {results.map((section: any) => {
          if (section.files === fileName) {
            return (
              <div aria-label={sectionLabel} className={styles.section} key={section.id || section.title}>
                <SectionHeaderCustom
                  onSectionClick={onToggleSection}
                  {...{ onToggleChecked, editable, section, results, arrangeDashboard }}
                />
                {section.expanded && section.waferMark && (
                  <div aria-label={itemsLabel} className={styles.sectionItems}>
                    {section.items.map((item: any) => (
                      <SearchItemCustom key={item.id} {...itemProps} item={item} />
                    ))}
                  </div>
                )}
              </div>
            );
          } else {
            return;
          }
        })}
      </div>
    </>
  );
};

const getSectionStyles = stylesFactory((theme: GrafanaTheme, isVisable: boolean) => {
  return {
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
    fileSection: css`
      display: ${isVisable ? 'block' : 'none'};
    `,
  };
});
