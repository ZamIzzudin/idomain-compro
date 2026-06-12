declare module "react-simple-maps" {
  import { ComponentType } from "react";

  interface GeographyProps {
    geography: any;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
    style?: {
      default?: React.CSSProperties;
      hover?: React.CSSProperties;
      pressed?: React.CSSProperties;
    };
    [key: string]: any;
  }

  interface GeographiesProps {
    geography: string;
    children: (props: { geographies: any[] }) => React.ReactNode;
  }

  interface ComposableMapProps {
    projection?: string;
    projectionConfig?: Record<string, any>;
    width?: number;
    height?: number;
    style?: React.CSSProperties;
    children?: React.ReactNode;
  }

  export const ComposableMap: ComponentType<ComposableMapProps>;
  export const Geographies: ComponentType<GeographiesProps>;
  export const Geography: ComponentType<GeographyProps>;
}
