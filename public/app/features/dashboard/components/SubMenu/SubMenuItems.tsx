import React, { FunctionComponent, useEffect, useState } from 'react';
import { VariableHide, VariableModel } from '../../../variables/types';
import { selectors } from '@grafana/e2e-selectors';
import { PickerRenderer } from '../../../variables/pickers/PickerRenderer';
import { css } from 'emotion';

interface Props {
  variables: VariableModel[];
}

export const SubMenuItems: FunctionComponent<Props> = ({ variables }) => {
  const groupArray = Array.from(new Set(variables.map((item) => item.group)), (element) => element);
  const [visibleVariables, setVisibleVariables] = useState<VariableModel[]>([]);
  useEffect(() => {
    setVisibleVariables(variables.filter((state) => state.hide !== VariableHide.hideVariable));
  }, [variables]);

  if (visibleVariables.length === 0) {
    return null;
  }

  return (
    <>
      {groupArray.length !== 0
        ? groupArray.map((item: any, index: number) => {
            return (
              <div key={index}>
                <span>{item}</span>
                <div
                  className={css`
                    display: flex;
                    flex-wrap: wrap;
                  `}
                >
                  {visibleVariables
                    .filter((element) => element.group === item)
                    .map((variable) => {
                      return (
                        <div
                          key={variable.id}
                          className="submenu-item gf-form-inline"
                          aria-label={selectors.pages.Dashboard.SubMenu.submenuItem}
                        >
                          <PickerRenderer variable={variable} />
                        </div>
                      );
                    })}
                </div>
              </div>
            );
          })
        : visibleVariables.map((variable) => {
            return (
              <div
                key={variable.id}
                className="submenu-item gf-form-inline"
                aria-label={selectors.pages.Dashboard.SubMenu.submenuItem}
              >
                <PickerRenderer variable={variable} />
              </div>
            );
          })}
      {/* {visibleVariables.map((variable) => {
        return (
          <div
            key={variable.id}
            className="submenu-item gf-form-inline"
            aria-label={selectors.pages.Dashboard.SubMenu.submenuItem}
          >
            <PickerRenderer variable={variable} />
          </div>
        );
      })} */}
    </>
  );
};
