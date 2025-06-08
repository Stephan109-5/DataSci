declare module 'react-leaflet-heatmap-layer-v3' {
  import { ComponentType } from 'react';
  import { LayerProps } from 'react-leaflet';

  export interface HeatmapLayerProps extends LayerProps {
    points: any[];
    longitudeExtractor: (point: any) => number;
    latitudeExtractor: (point: any) => number;
    intensityExtractor: (point: any) => number;
    radius?: number;
    blur?: number;
    max?: number;
    fitBoundsOnLoad?: boolean;
    fitBoundsOnUpdate?: boolean;
  }

  export const HeatmapLayer: ComponentType<HeatmapLayerProps>;
}