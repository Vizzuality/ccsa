import { useMemo } from "react";

import { GeoBoundingBox, TileLayer } from "@deck.gl/geo-layers/typed";
import { BitmapLayer } from "@deck.gl/layers/typed";
import GL from "@luma.gl/constants";
import { Layer } from "deck.gl/typed";
import { RasterSource } from "mapbox-gl";

import { useGetCategories } from "@/types/generated/category";

import DecodeExtension from "@/components/map/layers/decode-layer/extension";
import { useDeckMapboxOverlay } from "@/components/map/provider";

export interface DecodeLayerComponentProps {
  id: string;
  beforeId: string;
  source: RasterSource;
  opacity: number;
  visibility: boolean;
  decodeFunction: string;
  decodeParams: Record<string, unknown>;
}

export default function DecodeLayerComponent({
  id,
  source,
  visibility,
  opacity,
  decodeFunction,
  decodeParams,
}: DecodeLayerComponentProps) {
  const { data } = useGetCategories();
  console.info(data);

  const layer: Layer = useMemo(() => {
    return new TileLayer<unknown, DecodeLayerComponentProps>({
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
            extensions: [new DecodeExtension()],
            updateTriggers: {
              decodeParams,
              decodeFunction,
            },
          });
        }
        return null;
      },
    });
  }, [id, decodeFunction, decodeParams, source, opacity, visibility]);

  useDeckMapboxOverlay({
    id,
    layer,
  });

  return null;
}
