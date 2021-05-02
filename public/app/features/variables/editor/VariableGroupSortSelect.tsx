import React, { PropsWithChildren, useMemo } from 'react';
import { SelectableValue, VariableType } from '@grafana/data';
import { selectors } from '@grafana/e2e-selectors';

import { VariableSelectField } from '../editor/VariableSelectField';
import { VariableHide } from '../types';

interface Props {
  onChange: (option: SelectableValue<VariableHide>) => void;
  groupSort: 'asc' | 'desc' | any;
  type: VariableType;
}

const HIDE_OPTIONS = [
  { label: 'In order of creation', value: null },
  { label: 'Asc', value: 'asc' },
  { label: 'Desc', value: 'desc' },
];

export function VariableGroupSortSelect({ onChange, groupSort, type }: PropsWithChildren<Props>) {
  const value = useMemo(() => HIDE_OPTIONS.find((o) => o.value === groupSort) ?? HIDE_OPTIONS[0], [groupSort]);

  if (type === 'constant') {
    return null;
  }

  console.log(groupSort);
  console.log(type);

  return (
    <VariableSelectField
      name="Group Sort"
      value={value}
      options={HIDE_OPTIONS}
      onChange={onChange}
      ariaLabel={selectors.pages.Dashboard.Settings.Variables.Edit.General.generalHideSelect}
    />
  );
}
