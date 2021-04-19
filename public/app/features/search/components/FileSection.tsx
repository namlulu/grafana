import { GrafanaTheme } from '@grafana/data';
import { Icon, stylesFactory, useTheme } from '@grafana/ui';
import React, { useState } from 'react';
import { css } from 'emotion';
import { SearchItem } from './SearchItem';
import { SectionHeader } from './SectionHeader';

export const FileSection = ({
  fileName,
  results,
  sectionLabel,
  itemsLabel,
  itemProps,
  onToggleSection,
  onToggleChecked,
  editable,
}: any) => {
  const [isVisable, setIsVisable] = useState<boolean>(true);
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
          width: 100%;
          font-size: 14px;
          padding-right: 2px;
          height: 50px;
        `}
      >
        <div
          className={css`
            padding: 12px;
          `}
        >
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
          <span>{fileName}</span>
        </div>
        <div>{isVisable ? <Icon name="angle-down" /> : <Icon name="angle-right" />}</div>
      </div>
      <div className={styles.fileSection}>
        {results.map((section: any) => {
          if (section.files === fileName) {
            return (
              <div aria-label={sectionLabel} className={styles.section} key={section.id || section.title}>
                <SectionHeader onSectionClick={onToggleSection} {...{ onToggleChecked, editable, section }} />
                {section.expanded && (
                  <div aria-label={itemsLabel} className={styles.sectionItems}>
                    {section.items.map((item: any) => (
                      <SearchItem key={item.id} {...itemProps} item={item} />
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
      margin: 0 24px 0 32px;
    `,
    fileSection: css`
      display: ${isVisable ? 'block' : 'none'};
    `,
  };
});
