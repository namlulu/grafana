import React, { useRef, useState } from 'react';
import { css, cx } from 'emotion';
import { stylesFactory } from '@grafana/ui';

const TooltipEQ = (props: any) => {
  const item = props?.info;
  const EQName = props?.info.EQName;
  const equipment = props?.equipment;
  const check: boolean = props.type === 'MFAB2';
  const divDOM: any = useRef(null);
  const [isShow, setIsShow] = useState(false);

  const onMouseEnter = () => {
    setIsShow(true);
  };

  const onMouseLeave = () => {
    setIsShow(false);
  };

  console.log(props);

  const styles = getStyles('#ADB1B1', isShow);
  return (
    <>
      {check ? (
        <div onMouseLeave={onMouseLeave}>
          <div
            className={cx(
              styles.toolTip,
              css`
                position: absolute;
                z-index: 4;
                top: ${Number(item?.TOP) + 15}%;
                right: ${Number(item?.RIGHT - 5)}%;
              `
            )}
            ref={divDOM}
          >
            <div className={styles.titleText}>{item?.EQUIPMENT}</div>
            <div className={styles.content}>
              <span>EQ Status</span>
              <span>{equipment[EQName]?.eqStatus || 'N/A'}</span>
            </div>
            <div className={styles.content}>
              <span>Alarm Status</span>
              <span>{equipment[EQName]?.alarmStatus || 'N/A'}</span>
            </div>
            <div className={styles.content}>
              <span>Running Time</span>
              <span>{equipment[EQName]?.runningTime || 'N/A'}</span>
            </div>
          </div>
          <img
            src={item?.IMG}
            className={cx(
              css`
                position: absolute;
                width: 9%;
                object-fit: contain;
                z-index: 3;
                top: ${item?.TOP}%;
                right: ${item?.RIGHT}%;
                cursor: pointer;
              `
            )}
            onClick={() => props.goEQInfo(item?.LINK)}
            onMouseEnter={onMouseEnter}
          />
        </div>
      ) : (
        <div onMouseLeave={onMouseLeave}>
          <div
            className={cx(
              styles.toolTip,
              css`
                position: absolute;
                z-index: 4;
                top: ${Number(item?.TOP) + 23}%;
                left: ${Number(item?.LEFT) + 2}%;
              `
            )}
            ref={divDOM}
          >
            <div className={styles.titleText}>{item?.EQUIPMENT}</div>
            <div className={styles.content}>
              <span>EQ Status</span>
              <span>{equipment[EQName]?.eqStatus || 'N/A'}</span>
            </div>
            <div className={styles.content}>
              <span>Alarm Status</span>
              <span>{equipment[EQName]?.alarmStatus || 'N/A'}</span>
            </div>
            <div className={styles.content}>
              <span>Running Time</span>
              <span>{equipment[EQName]?.runningTime || 'N/A'}</span>
            </div>
          </div>
          <img
            src={item?.IMG}
            className={cx(
              css`
                position: absolute;
                width: 20%;
                object-fit: contain;
                z-index: 3;
                top: ${item?.TOP}%;
                left: ${item?.LEFT}%;
                cursor: pointer;
              `
            )}
            onClick={() => props.goEQInfo(item?.LINK)}
            onMouseEnter={onMouseEnter}
          />
        </div>
      )}
    </>
  );
};

const getStyles = stylesFactory((color, isShow) => {
  return {
    toolTip: css`
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      background-color: rgb(72, 72, 72);
      color: white;
      width: 15vw;
      min-width: 200px;
      min-height: 100px;
      padding: 15px;
      padding-bottom: 3px;
      opacity: 0.8;
      z-index: 4;
      display: ${isShow ? 'flex' : 'none'};
      transition: all 300ms ease-in-out;
    `,
    titleText: css`
      display: flex;
      justify-content: center;
      align-items: center;
      border-bottom: 1px solid white;
      margin-bottom: 8px;
      padding-bottom: 5px;
      padding-left: 50px;
      padding-right: 50px;
      font-weight: bold;
      text-align: center;
      font-size: 1vw;
    `,
    content: css`
      display: flex;
      justify-content: space-between;
      padding-left: 8px;
      padding-right: 8px;
      margin-bottom: 8px;
      font-weight: bold;
      font-size: 0.8vw;
    `,
    opacityControl: css`
      opacity: 0;
    `,
    titleTextTwo: css`
      display: flex;
      justify-content: center;
      align-items: center;
      border-bottom: 1px solid white;
      margin-bottom: 5px;
      padding-bottom: 5px;
      padding-left: 30px;
      padding-right: 30px;
      font-weight: bold;
      text-align: center;
      font-size: 1vw;
    `,
    contentTwo: css`
      display: flex;
      justify-content: space-between;
      padding-left: 8px;
      padding-right: 8px;
      font-weight: bold;
      font-size: 0.8vw;
    `,
  };
});

export default TooltipEQ;
