import React, { FC } from 'react';
import { css, cx } from 'emotion';
import { useTheme } from '@grafana/ui';

export interface BrandComponentProps {
  className?: string;
  children?: JSX.Element | JSX.Element[];
}

const LoginLogo: FC<BrandComponentProps> = ({ className }) => {
  return <img className={className} src="public/img/udap.png" alt="Udap" />;
};

const LoginBackground: FC<BrandComponentProps> = ({ className, children }) => {
  const theme = useTheme();
  const background = css`
    background: url(public/img/login_background_${theme.isDark ? 'dark' : 'light'}.svg);
    background-size: cover;
  `;

  return <div className={cx(background, className)}>{children}</div>;
};

const MenuLogo: FC<BrandComponentProps> = ({ className }) => {
  return <img className={className} src="public/img/udap.png" alt="Udap" />;
};

const DashboardDarkIcon: FC<BrandComponentProps> = ({ className }) => {
  return (
    <img
      className={cx(
        className,
        css`
          width: 50%;
        `
      )}
      src="public/img/icons_dark_theme/icon_dashboard_list.svg"
      alt="Udap"
    />
  );
};

const DashboardLightIcon: FC<BrandComponentProps> = ({ className }) => {
  return (
    <img
      className={cx(
        className,
        css`
          width: 50%;
        `
      )}
      src="public/img/icons_light_theme/icon_dashboard_list.svg"
      alt="Udap"
    />
  );
};

const LoginBoxBackground = () => {
  const theme = useTheme();
  return css`
    background: ${theme.isLight ? 'rgba(6, 30, 200, 0.1 )' : 'rgba(18, 28, 41, 0.65)'};
    background-size: cover;
  `;
};

export class Branding {
  static LoginLogo = LoginLogo;
  static LoginBackground = LoginBackground;
  static MenuLogo = MenuLogo;
  static DashboardDarkIcon = DashboardDarkIcon;
  static DashboardLightIcon = DashboardLightIcon;
  static LoginBoxBackground = LoginBoxBackground;
  static AppTitle = 'Udap';
  static LoginTitle = 'Welcome to Udap';
  static GetLoginSubTitle = () => {
    const slogans = [
      "Don't get in the way of the data",
      'Your single pane of glass',
      'Built better together',
      'Democratising data',
    ];
    const count = slogans.length;
    return slogans[Math.floor(Math.random() * count)];
  };
}
