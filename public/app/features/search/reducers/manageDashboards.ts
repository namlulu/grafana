import { DashboardSection, DashboardSectionItem, SearchAction } from '../types';
import {
  TOGGLE_ALL_CHECKED,
  TOGGLE_CHECKED,
  MOVE_ITEMS,
  DELETE_ITEMS,
  TEST,
  ADD_FILE,
  DELETE_FILE,
  ASSIGN_FILE,
  RESET_FILE,
  MOVE_UP_FOLDER,
  MOVE_DOWN_FOLDER,
  MOVE_UP_DASHBOARD,
  MOVE_DOWN_DASHBOARD,
  ARRANGE_FOLDER,
  ARRANGE_DASHBOARD,
} from './actionTypes';
import { dashboardsSearchState, DashboardsSearchState, searchReducer } from './dashboardSearch';
import { mergeReducers } from '../utils';
import { getBackendSrv } from '@grafana/runtime';

export interface ManageDashboardsState extends DashboardsSearchState {
  fileArray: any;
  allChecked: boolean;
}

export const manageDashboardsState: ManageDashboardsState = {
  ...dashboardsSearchState,
  allChecked: false,
  fileArray: [],
};

const reducer = (state: ManageDashboardsState, action: SearchAction) => {
  switch (action.type) {
    case TOGGLE_ALL_CHECKED:
      const newAllChecked = !state.allChecked;
      return {
        ...state,
        results: state.results.map((result) => {
          return {
            ...result,
            checked: newAllChecked,
            items: result.items.map((item) => ({ ...item, checked: newAllChecked })),
          };
        }),
        allChecked: newAllChecked,
      };
    case TOGGLE_CHECKED:
      const { id } = action.payload;
      return {
        ...state,
        results: state.results.map((result) => {
          if (result.id === id) {
            return {
              ...result,
              checked: !result.checked,
              items: result.items.map((item) => ({ ...item, checked: !result.checked })),
            };
          }
          return {
            ...result,
            items: result.items.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item)),
          };
        }),
      };
    case MOVE_ITEMS: {
      const dashboards: DashboardSectionItem[] = action.payload.dashboards;
      const folder: DashboardSection = action.payload.folder;
      const uids = dashboards.map((db) => db.uid);
      return {
        ...state,
        results: state.results.map((result) => {
          if (folder.id === result.id) {
            return result.expanded
              ? {
                  ...result,
                  items: [...result.items, ...dashboards.map((db) => ({ ...db, checked: false }))],
                  checked: false,
                }
              : result;
          } else {
            return { ...result, items: result.items.filter((item) => !uids.includes(item.uid)) };
          }
        }),
      };
    }
    case DELETE_ITEMS: {
      const { folders, dashboards } = action.payload;
      if (!folders.length && !dashboards.length) {
        return state;
      }
      return {
        ...state,
        results: state.results.reduce((filtered, result) => {
          if (!folders.includes(result.uid)) {
            return [...filtered, { ...result, items: result.items.filter((item) => !dashboards.includes(item.uid)) }];
          }
          return filtered;
        }, []),
      };
    }
    case ADD_FILE: {
      const { fileName } = action.payload;
      const fileArray = [...state.fileArray];
      fileArray.push(fileName);
      return {
        ...state,
        fileArray,
      };
    }
    case DELETE_FILE: {
      const { fileName } = action.payload;
      const fileArray = [...state.fileArray];
      const newFileArray = fileArray.filter((element) => element !== fileName);
      return {
        ...state,
        fileArray: newFileArray,
      };
    }
    case ASSIGN_FILE: {
      const { files } = action.payload;
      const fileResults = [...state.results];
      const newResults = fileResults.map((element: any, index: number) => {
        element['files'] = files[index];
        return element;
      });
      return {
        ...state,
        results: newResults,
      };
    }
    case RESET_FILE: {
      const { files } = action.payload;
      return {
        ...state,
        fileArray: files,
      };
    }
    case MOVE_UP_FOLDER: {
      const { folder } = action.payload;
      const fileName = folder?.files;
      //
      const filterResult = [...state.results].filter((item: any, index: number) => {
        return item?.files === fileName;
      });
      const addOn = [...state.results].filter((item: any, index: number) => {
        return item?.files !== fileName;
      });
      const findIndex = filterResult.findIndex((item: any) => {
        return item?.title === folder?.title;
      });

      if (findIndex >= 1) {
        let tmp = filterResult[findIndex];
        filterResult[findIndex] = filterResult[findIndex - 1];
        filterResult[findIndex - 1] = tmp;
      }

      const answer = addOn.concat(filterResult);
      const uid = answer.filter((element) => element.title !== 'General').map((item) => item.uid);

      getBackendSrv()
        .post('filedashboardsave', {
          uid,
        })
        .then((data) => console.log(data));

      return {
        ...state,
        results: answer,
      };
    }
    case MOVE_DOWN_FOLDER: {
      const { folder } = action.payload;
      const fileName = folder?.files;
      //
      const filterResult = [...state.results].filter((item: any, index: number) => {
        return item?.files === fileName;
      });
      const addOn = [...state.results].filter((item: any, index: number) => {
        return item?.files !== fileName;
      });
      const findIndex = filterResult.findIndex((item: any) => {
        return item?.title === folder?.title;
      });

      if (filterResult?.length === 0) {
        return {
          ...state,
        };
      }

      console.log(findIndex);
      console.log(filterResult?.length);

      if (findIndex < filterResult?.length - 1) {
        let tmp = filterResult[findIndex];
        filterResult[findIndex] = filterResult[findIndex + 1];
        filterResult[findIndex + 1] = tmp;
      }

      const answer = addOn.concat(filterResult);
      const uid = answer.filter((element) => element.title !== 'General').map((item) => item.uid);

      getBackendSrv()
        .post('filedashboardsave', {
          uid,
        })
        .then((data) => console.log(data));

      return {
        ...state,
        results: answer,
      };
    }
    case MOVE_UP_DASHBOARD: {
      const { dash } = action.payload;
      const index = state?.results.findIndex((item: any) => {
        return item?.items.includes(dash);
      });
      const newItems = [...state?.results[index]?.items];

      const findIndex = newItems.findIndex((item: any) => {
        return item === dash;
      });

      if (findIndex >= 1) {
        let tmp = newItems[findIndex];
        newItems[findIndex] = newItems[findIndex - 1];
        newItems[findIndex - 1] = tmp;
      }

      const newResults = JSON.parse(JSON.stringify(state?.results));
      newResults[index].items = newItems;
      const uid = newItems.filter((element) => element.title !== 'General').map((item) => item.uid);

      getBackendSrv()
        .post('filedashboardsave', {
          uid,
        })
        .then((data) => console.log(data));

      return {
        ...state,
        results: newResults,
      };
    }
    case MOVE_DOWN_DASHBOARD: {
      const { dash } = action.payload;
      const index = state?.results.findIndex((item: any) => {
        return item?.items.includes(dash);
      });
      const newItems = [...state?.results[index]?.items];

      const findIndex = newItems.findIndex((item: any) => {
        return item === dash;
      });

      console.log(findIndex);
      console.log(newItems.length);

      if (findIndex < newItems?.length - 1) {
        let tmp = newItems[findIndex];
        newItems[findIndex] = newItems[findIndex + 1];
        newItems[findIndex + 1] = tmp;
      }

      const newResults = JSON.parse(JSON.stringify(state?.results));
      newResults[index].items = newItems;
      const uid = newItems.filter((element) => element?.title !== 'General').map((item) => item.uid);

      getBackendSrv()
        .post('filedashboardsave', {
          uid,
        })
        .then((data) => console.log(data));

      return {
        ...state,
        results: newResults,
      };
    }
    case ARRANGE_FOLDER: {
      const { order, uidOrder } = action.payload;
      const indexArray = order.map((item: number) => item - 1);
      let answer: any = Array(indexArray.length);
      const newState = [...state.results.filter((item) => item?.title !== 'General')];
      const newGeneral = [...state.results.filter((item) => item?.title === 'General')];

      for (let i = 0; i < uidOrder.length; i++) {
        answer[i] = uidOrder[indexArray.indexOf(i)];
      }

      let realAnswer = [];
      for (let i = 0; i < uidOrder.length; i++) {
        for (let j = 0; j < uidOrder.length; j++) {
          if (answer[i] === newState[j]?.uid) {
            realAnswer.push(newState[j]);
          }
        }
      }

      const userFolder = realAnswer.concat(newGeneral);

      return {
        ...state,
        results: userFolder.length === 0 ? [...state.results] : userFolder,
      };
    }
    case ARRANGE_DASHBOARD: {
      const { order, uidOrder } = action.payload;
      const indexArray = order.map((item: number) => item - 1);
      let answer: any = Array(indexArray.length);
      // const newState = [...state.results.filter((item) => item?.title !== 'General')];
      // const newGeneral = [...state.results.filter((item) => item?.title === 'General')];

      for (let i = 0; i < uidOrder.length; i++) {
        answer[i] = uidOrder[indexArray.indexOf(i)];
      }

      const findIndex: any = [...state.results].findIndex((item: any) => {
        return (
          item?.items.findIndex((element: any) => {
            return element?.uid === uidOrder[0];
          }) >= 0
        );
      });

      const target: any = [...state.results][findIndex];

      let realAnswer: any = [];
      for (let i = 0; i < uidOrder.length; i++) {
        for (let j = 0; j < uidOrder.length; j++) {
          if (answer[i] === target?.items[j]?.uid) {
            realAnswer.push(target?.items[j]);
          }
        }
      }

      if (target === undefined) {
        return {
          ...state,
        };
      } else {
        const superAnswer: any = [...state.results];
        superAnswer[findIndex]['items'] = realAnswer;
        console.log(answer);
        console.log(target);
        console.log(realAnswer);
        console.log(superAnswer);
        return {
          ...state,
          result: superAnswer,
        };
      }
    }
    case TEST: {
      return state;
    }
    default:
      return state;
  }
};

export const manageDashboardsReducer = mergeReducers([searchReducer, reducer]);
