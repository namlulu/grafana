import { useMemo, useReducer } from 'react';
import { FolderDTO } from 'app/types';
import { contextSrv } from 'app/core/services/context_srv';
import { DashboardQuery, DashboardSection, OnDeleteItems, OnMoveItems, OnToggleChecked } from '../types';
import {
  DELETE_ITEMS,
  MOVE_ITEMS,
  TEST,
  TOGGLE_ALL_CHECKED,
  TOGGLE_CHECKED,
  ADD_FILE,
  DELETE_FILE,
  ASSIGN_FILE,
  RESET_FILE,
} from '../reducers/actionTypes';
import { manageDashboardsReducer, manageDashboardsState, ManageDashboardsState } from '../reducers/manageDashboards';
import { useSearch } from './useSearch';
import { GENERAL_FOLDER_ID } from '../constants';

export const useManageDashboards = (
  query: DashboardQuery,
  state: Partial<ManageDashboardsState> = {},
  folder?: FolderDTO
) => {
  const reducer = useReducer(manageDashboardsReducer, {
    ...manageDashboardsState,
    ...state,
  });

  const {
    state: { results, loading, initialLoading, allChecked, fileArray },
    onToggleSection,
    dispatch,
  } = useSearch<ManageDashboardsState>(query, reducer, {});

  const onToggleChecked: OnToggleChecked = (item) => {
    dispatch({ type: TOGGLE_CHECKED, payload: item });
  };

  const onToggleAllChecked = () => {
    dispatch({ type: TOGGLE_ALL_CHECKED });
  };

  const onDeleteItems: OnDeleteItems = (folders, dashboards) => {
    dispatch({ type: DELETE_ITEMS, payload: { folders, dashboards } });
  };

  const onMoveItems: OnMoveItems = (selectedDashboards, folder) => {
    dispatch({ type: MOVE_ITEMS, payload: { dashboards: selectedDashboards, folder } });
  };

  const canMove = useMemo(
    () => results.some((result: DashboardSection) => result.items && result.items.some((item) => item.checked)),
    [results]
  );
  const canDelete = useMemo(
    () => canMove || results.some((result: DashboardSection) => result.checked && result.id !== GENERAL_FOLDER_ID),
    [canMove, results]
  );

  const addFile = (fileName: string) => {
    dispatch({ type: ADD_FILE, payload: { fileName } });
  };

  const deleteFile = (fileName: string) => {
    dispatch({ type: DELETE_FILE, payload: { fileName } });
  };

  const assignFile = (files: string[]) => {
    dispatch({ type: ASSIGN_FILE, payload: { files } });
  };

  const resetFile = (files: string[]) => {
    dispatch({ type: RESET_FILE, payload: { files } });
  };

  const testRedux = () => {
    dispatch({ type: TEST });
  };

  const canSave = folder?.canSave;
  const hasEditPermissionInFolders = folder ? canSave : contextSrv.hasEditPermissionInFolders;
  const noFolders = canSave && folder?.id && results.length === 0 && !loading && !initialLoading;

  return {
    results,
    loading,
    initialLoading,
    canSave,
    allChecked,
    hasEditPermissionInFolders,
    canMove,
    canDelete,
    onToggleSection,
    onToggleChecked,
    onToggleAllChecked,
    onDeleteItems,
    onMoveItems,
    noFolders,
    testRedux,
    addFile,
    deleteFile,
    assignFile,
    resetFile,
    fileArray,
  };
};
