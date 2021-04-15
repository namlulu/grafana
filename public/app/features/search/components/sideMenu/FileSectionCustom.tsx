import { GrafanaTheme } from '@grafana/data';
import { Icon, stylesFactory, useTheme } from '@grafana/ui';
import React, { useState } from 'react';
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
}: any) => {
  const [isVisable, setIsVisable] = useState<boolean>(false);
  const theme = useTheme();
  const styles = getSectionStyles(theme, isVisable);
  return (
    <>
      <div
        onClick={() => setIsVisable(!isVisable)}
        className={css`
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px;
          font-size: 14px;
          background-color: ${theme.palette.dark3};
          color: ${theme.palette.gray3};
          &:hover {
            color: ${theme.palette.gray98};
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
      background: ${theme.palette.dark3};
    `,
    sectionItems: css`
      margin: 0 24px 0 32px;
    `,
    fileSection: css`
      display: ${isVisable ? 'block' : 'none'};
    `,
  };
});
