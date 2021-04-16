import React, { FC, memo, useCallback, useEffect, useRef, useState } from 'react';
import { css, cx } from 'emotion';
import { stylesFactory } from '@grafana/ui';
import FabData from './FabData';
import TooltipEQ from './TooltipEQ';

const URL = 'http://192.168.0.210:6001/3DFab';
const MFAB2_EQUIPMENT: any[] = [];
const RLAB_EQUIPMENT: any[] = ['PVK28704', 'PAK29714', 'PVK30709', 'PJK29707', 'PZK26701', 'RE3500'];
const PLAB_EQUIPMENT: any[] = [
  'PNK15009',
  'PGK15038',
  'PQK30716',
  'PGK15025',
  'PNK27718',
  'PGK27880',
  'PNK28712',
  'PQK28708',
  'PAK09002',
  'RE3500',
  'LS9300',
];
const MFAB1_EQUIPMENT: any[] = ['RE3100'];

export const FabPage: FC = memo((props: any) => {
  const [userClick, setUserClick] = useState('');
  const [imgHeight, setImgHeight] = useState<any>(0);
  const [equipment, setEquipment] = useState<any>({});
  const imgDOM: any = useRef(null);
  const buildingDOM: any = useRef(null);

  const styles = getStyles('#ADB1B1');

  // P-LAB, R-LAB
  useEffect(() => {
    setImgHeight((imgDOM.current.width * 15.47) / 27.51);
    window.addEventListener('resize', getSize);
    localStorage.setItem('fileArray', JSON.stringify(['P-LAB', 'R-LAB']));
    return () => {
      setImgHeight(0);
      setEquipment({});
    };
  }, []);

  const getSize = useCallback(() => {
    setImgHeight(imgDOM?.current?.clientHeight);
  }, []);

  const goToMFAB2 = useCallback(() => {
    setUserClick('MP2_BG');
    setEquipment({});
    try {
      fetch(URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, DELETE',
        },
        body: JSON.stringify({
          layer: 'M-FAB2',
          equipment: MFAB2_EQUIPMENT,
        }),
      })
        .then((response) => {
          return response.json();
        })
        .then((myJson) => {
          console.log(JSON.parse(JSON.stringify(myJson)));
          setEquipment(JSON.parse(JSON.stringify(myJson)));
        });
    } catch (error) {
      console.error('MP2 Error', error);
    }
  }, []);

  const goToRLAB = useCallback(() => {
    setUserClick('R_LAB_BG');
    setEquipment({});
    try {
      fetch(URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, DELETE',
        },
        body: JSON.stringify({
          layer: 'R_LAB',
          equipment: RLAB_EQUIPMENT,
        }),
      })
        .then((response) => {
          return response.json();
        })
        .then((myJson) => {
          console.log(JSON.parse(JSON.stringify(myJson)));
          setEquipment(JSON.parse(JSON.stringify(myJson)));
        });
    } catch (error) {
      console.error('RLAB Error', error);
    }
  }, []);

  const goToPLAB = useCallback(() => {
    setUserClick('P_LAB_1_BG');
    setEquipment({});
    try {
      fetch(URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, DELETE',
        },
        body: JSON.stringify({
          layer: 'P_LAB1',
          equipment: PLAB_EQUIPMENT,
        }),
      })
        .then((response) => {
          return response.json();
        })
        .then((myJson) => {
          console.log(JSON.parse(JSON.stringify(myJson)));
          setEquipment(JSON.parse(JSON.stringify(myJson)));
        });
    } catch (error) {
      console.error('PLAB1 Error', error);
    }
  }, []);

  const goToMFAB1 = useCallback(() => {
    setUserClick('M-FAB1_BG');
    setEquipment({});
    try {
      fetch(URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, DELETE',
        },
        body: JSON.stringify({
          layer: 'M-FAB1',
          equipment: MFAB1_EQUIPMENT,
        }),
      })
        .then((response) => {
          return response.json();
        })
        .then((myJson) => {
          console.log(JSON.parse(JSON.stringify(myJson)));
          setEquipment(JSON.parse(JSON.stringify(myJson)));
        });
    } catch (error) {
      console.error('MFAB1 Error', error);
    }
  }, []);

  const goEQInfo = useCallback((redirectURL: string) => {
    const currentURL: any = window.location;
    location.replace(currentURL.origin + '/' + redirectURL);
  }, []);

  const onMouseEnter = () => {
    buildingDOM.current.classList.add(styles.opacityControl);
  };

  const onMouseLeave = () => {
    buildingDOM.current.classList.remove(styles.opacityControl);
  };

  const FazeTwo: FC = () => {
    if (userClick === 'MP2_BG') {
      return (
        <div
          className={css`
            width: 100%;
            height: ${imgHeight}px;
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
          `}
        >
          <img src={`public/img/models/MP2_BG.jpg`} className={styles.factoryImg} ref={imgDOM} />
          {FabData['MFAB2'].map((item: any, index: number) => {
            return (
              <div key={index}>
                <TooltipEQ info={item} goEQInfo={goEQInfo} type={'MFAB2'} equipment={equipment} />
              </div>
            );
          })}
        </div>
      );
    } else if (userClick === 'R_LAB_BG') {
      return (
        <div
          className={css`
            width: 100%;
            height: ${imgHeight}px;
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
          `}
        >
          <img src={`public/img/models/R_LAB_BG.jpg`} className={styles.factoryImg} ref={imgDOM} />
          {FabData['RLAB'].map((item: any, index: number) => {
            return (
              <div key={index}>
                <TooltipEQ info={item} goEQInfo={goEQInfo} type={'RLAB'} equipment={equipment} />
              </div>
            );
          })}
        </div>
      );
    } else if (userClick === 'P_LAB_1_BG') {
      return (
        <div
          className={css`
            width: 100%;
            height: ${imgHeight}px;
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
          `}
        >
          <img src={`public/img/models/P_LAB_1_BG.jpg`} className={styles.factoryImg} ref={imgDOM} />
          {FabData['PLAB'].map((item: any, index: number) => {
            return (
              <div key={index}>
                <TooltipEQ info={item} goEQInfo={goEQInfo} type={'PLAB'} equipment={equipment} />
              </div>
            );
          })}
        </div>
      );
    } else {
      return (
        <div
          className={css`
            width: 100%;
            height: ${imgHeight}px;
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
          `}
        >
          <img src={`public/img/models/M-FAB1_BG.jpg`} className={styles.factoryImg} ref={imgDOM} />
          {FabData['MFAB1'].map((item: any, index: number) => {
            return (
              <div key={index}>
                <TooltipEQ info={item} goEQInfo={goEQInfo} type={'MFAB1'} equipment={equipment} />
              </div>
            );
          })}
        </div>
      );
    }
  };

  return (
    <div className={styles.wrapper}>
      <div
        className={css`
          position: absolute;
          top: 10px;
          left: 30px;
          z-index: 4;
          cursor: pointer;
        `}
        onClick={() => {
          setUserClick('');
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="black" viewBox="0 0 16 16">
          <path
            fillRule="evenodd"
            d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"
          />
        </svg>
      </div>
      {userClick.length === 0 ? (
        <div
          className={css`
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 100%;
          `}
        >
          <div
            className={css`
              width: 100%;
              height: ${imgHeight}px;
              position: relative;
              display: flex;
              justify-content: center;
              align-items: center;
            `}
            onMouseLeave={onMouseLeave}
          >
            <img
              className={cx(styles.skeleton)}
              src="public/img/models/Floor.jpg"
              alt="skeleton"
              ref={imgDOM}
              id={'skeleton'}
            />
            <img
              className={cx(styles.building)}
              src="public/img/models/Building.jpg"
              alt="building"
              ref={buildingDOM}
              onMouseEnter={onMouseEnter}
            />
            <div className={styles.leftBtn} onClick={goToMFAB2}>
              M-FAB2, P-LAB2
            </div>
            <div className={cx(styles.rightBtn, styles.RLAB)} onClick={goToRLAB}>
              R-LAB
            </div>
            <div className={cx(styles.rightBtn, styles.PLAB)} onClick={goToPLAB}>
              P-LAB1
            </div>
            <div className={cx(styles.rightBtn, styles.MFAB)} onClick={goToMFAB1}>
              M-FAB1
            </div>
          </div>
        </div>
      ) : (
        <FazeTwo />
      )}
    </div>
  );
});

const getStyles = stylesFactory((color) => {
  return {
    wrapper: css`
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 100vw;
      height: 100vh;
      position: relative;
      background-color: ${color};
    `,
    building: css`
      position: absolute;
      left: 0;
      object-fit: contain;
      width: 100%;
      transition: all 300ms ease-in;
    `,
    skeleton: css`
      position: absolute;
      left: 0;
      object-fit: contain;
      width: 100%;
    `,
    leftBtn: css`
      position: absolute;
      left: 25%;
      bottom: 10%;
      width: 25%;
      height: 20%;
      opacity: 0;
      z-index: 2;
      cursor: pointer;
    `,
    rightBtn: css`
      width: 40%;
      opacity: 0;
      z-index: 2;
      cursor: pointer;
    `,
    RLAB: css`
      position: absolute;
      top: 20%;
      right: 10%;
      height: 15%;
    `,
    PLAB: css`
      position: absolute;
      top: 50%;
      right: 10%;
      height: 12%;
    `,
    MFAB: css`
      position: absolute;
      top: 65%;
      right: 10%;
      height: 15%;
    `,
    factoryImg: css`
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: auto;
    `,
    machineImg: css`
      z-index: 3;
    `,
    toolTip: css`
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      background-color: rgb(72, 72, 72);
      color: white;
      opacity: 0.8;
      padding: 10px;
      max-width: 600px;
      min-width: 250px;
      z-index: 4;
    `,
    titleText: css`
      border-bottom: 1px solid white;
      padding-bottom: 5px;
      margin-bottom: 7px;
      font-size: 1.5em;
      font-weight: bold;
      text-align: center;
    `,
    content: css`
      display: flex;
      justify-content: space-between;
      padding-left: 5px;
      padding-right: 5px;
      font-weight: bold;
      font-size: 1em;
    `,
    opacityControl: css`
      opacity: 0;
    `,
  };
});