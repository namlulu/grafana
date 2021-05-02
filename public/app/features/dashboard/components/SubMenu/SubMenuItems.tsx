import React, { FunctionComponent, useEffect, useState } from 'react';
import { VariableHide, VariableModel } from '../../../variables/types';
import { selectors } from '@grafana/e2e-selectors';
import { PickerRenderer } from '../../../variables/pickers/PickerRenderer';
import { css } from 'emotion';

interface Props {
  variables: VariableModel[];
}

export const SubMenuItems: FunctionComponent<Props> = ({ variables }) => {
  const [groupArray, setGroupArray] = useState<any[]>([]);
  const [visibleVariables, setVisibleVariables] = useState<VariableModel[]>([]);

  useEffect(() => {
    setGroupArray(Array.from(new Set(variables.map((item) => item.group || 'Option Group')), (element) => element));
    setVisibleVariables(variables.filter((state) => state.hide !== VariableHide.hideVariable));
  }, [variables]);

  if (visibleVariables.length === 0) {
    return null;
  }

  return (
    <div
      className={css`
        display: flex;
        justify-content: space-around;
      `}
    >
      {groupArray.length >= 2
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
                  {item !== 'Option Group'
                    ? visibleVariables
                        .filter((element) => {
                          return element.group === item;
                        })
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
                        })
                    : visibleVariables
                        .filter((element) => {
                          return element.group === null;
                        })
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
    </div>
  );
};
