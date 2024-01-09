import { GeoBoundingBox, TileLayer } from "@deck.gl/geo-layers/typed";
import { BitmapLayer } from "@deck.gl/layers/typed";
import GL from "@luma.gl/constants";
import { RasterSource } from "mapbox-gl";

import { LayerProps } from "@/types/layers";

import RingExtension from "@/components/map/layers/ring-layer/extension";

export interface RingLayerProps extends LayerProps {
  source: RasterSource;
  opacity: number;
  visibility: boolean;
  decodeFunction: string;
  decodeParams: Record<string, unknown>;
}

class RingLayer {
  constructor({ id, source, visibility, opacity, decodeFunction, decodeParams }: RingLayerProps) {
    return new TileLayer<
      unknown,
      {
        decodeFunction: RingLayerProps["decodeFunction"];
        decodeParams: RingLayerProps["decodeParams"];
      }
    >({
      id,
      data: source.tiles,
      tileSize: source.tileSize ?? 256,
      minZoom: source.minzoom,
      maxZoom: source.maxzoom,
      visible: visibility ?? true,
      opacity: opacity ?? 1,
      refinementStrategy: "never",
      decodeFunction,
      decodeParams,
      renderSubLayers: (subLayer) => {
        const {
          id: subLayerId,
          data: subLayerData,
          tile: subLayerTile,
          visible: subLayerVisible,
          opacity: subLayerOpacity,
        } = subLayer;

        const { zoom } = subLayerTile;
        const { west, south, east, north } = subLayerTile.bbox as GeoBoundingBox;

        if (subLayerData) {
          return new BitmapLayer({
            id: subLayerId,
            image: subLayerData,
            bounds: [west, south, east, north],
            textureParameters: {
              [GL.TEXTURE_MIN_FILTER]: GL.NEAREST,
              [GL.TEXTURE_MAG_FILTER]: GL.NEAREST,
              [GL.TEXTURE_WRAP_S]: GL.CLAMP_TO_EDGE,
              [GL.TEXTURE_WRAP_T]: GL.CLAMP_TO_EDGE,
            },
            zoom,
            visible: subLayerVisible,
            opacity: subLayerOpacity,
            decodeParams,
            decodeFunction,
            extensions: [new RingExtension()],
            updateTriggers: {
              decodeParams,
              decodeFunction,
            },
          });
        }
        return null;
      },
    });
  }
}

export default RingLayer;
