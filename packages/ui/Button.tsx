import {ButtonHTMLAttributes, FC} from "react";
import classNames from './utils/classNames';
import css from './Button.module.css';

type BaseButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export type ButtonProps =  Pick<BaseButtonProps, 'type' | 'onClick' | 'className'>;

export const Button: FC<ButtonProps> = ({children, className, ...baseButtonProps}) => {
  return <button
    {...baseButtonProps}
    className={classNames([
      [css.base, true],
      [className, true]
    ])}
  >{children}</button>
};
