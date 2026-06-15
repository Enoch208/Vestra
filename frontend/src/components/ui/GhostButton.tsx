import type { ComponentProps, ReactNode } from "react";

type CommonProps = {
  children: ReactNode;
  trailing?: ReactNode;
  className?: string;
};

type ButtonProps = CommonProps &
  Omit<ComponentProps<"button">, "children" | "className"> & {
    href?: undefined;
  };

type LinkProps = CommonProps & {
  href: string;
  target?: string;
  rel?: string;
};

type Props = ButtonProps | LinkProps;

const SHELL =
  "group cursor-pointer inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm font-medium text-foreground transition-all duration-200 ease-out hover:border-white/15 hover:bg-white/[0.08] active:scale-[0.98]";

function Inner({ children, trailing }: CommonProps) {
  return (
    <>
      <span className="flex items-center gap-2">{children}</span>
      {trailing && (
        <span className="text-muted transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-foreground">
          {trailing}
        </span>
      )}
    </>
  );
}

export function GhostButton(props: Props) {
  const { children, trailing, className = "" } = props;
  const shell = `${SHELL} ${className}`;

  if ("href" in props && props.href) {
    return (
      <a href={props.href} target={props.target} rel={props.rel} className={shell}>
        <Inner trailing={trailing}>{children}</Inner>
      </a>
    );
  }

  const { children: _c, trailing: _t, className: _cn, href: _h, ...rest } = props;
  return (
    <button className={shell} {...rest}>
      <Inner trailing={trailing}>{children}</Inner>
    </button>
  );
}
