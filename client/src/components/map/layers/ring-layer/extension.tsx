import { Layer, LayerExtension, LayerContext } from "@deck.gl/core/typed";

type RingExtensionType = Layer<{
  decodeFunction: string;
  decodeParams: Record<string, unknown>;
  zoom: number;
}>;

export default class RingExtension extends LayerExtension {
  startTime = performance.now() / 1000;

  getShaders(this: RingExtensionType) {
    return {
      inject: {
        // VERTEX SHADER
        "vs:#decl": /*glsl*/ `
          uniform float uTime;
          uniform float uStartTime;

          attribute float aRandom;

          varying float vRandom;
          varying vec3 vWorldPosition;
        `,
        "vs:#main-end": /*glsl*/ `
          vRandom = aRandom;
          vWorldPosition = geometry.worldPosition;
        `,
        "vs:DECKGL_FILTER_SIZE": /*glsl*/ `
          vWorldPosition = geometry.worldPosition;
          float timespan = 1.5 + aRandom;
          float wave = smoothstep(0.0, 1.0, fract((uTime - (uStartTime + (aRandom * 10.0))) / timespan));

          // Based on world positions
          // float a = clamp(abs((vWorldPosition.y / 90.0)), 0.0, 1.0);
          // float a = clamp(abs(((vWorldPosition.y - 40.0) * 5.0) / 90.0), 0.0, 1.0);

          // Based on current viewport
          // We dont't have access to the geometry.position.y because at this moment the position in not projected yet
          vec4 common_pos = project_position(vec4(geometry.worldPosition, 1.0));
          vec4 pos = project_common_position_to_clipspace(common_pos);
          float ax = abs(pos.x);
          float ay = abs(pos.y);
          float a = clamp((ax + ay) / 2.0, 0.0, 1.0);

          if ((uStartTime + (aRandom * 10.0)) > uTime) {
            size = vec3(0.0);
          } else {
            size *= wave * (1.0 + (3.0 * (1.0 - a)));
          }
        `,

        // FRAGMENT SHADER
        "fs:#decl": /*glsl*/ `
          uniform float uTime;
          uniform float uStartTime;
          uniform float opacity;

          varying float vRandom;
          varying vec3 vWorldPosition;
        `,

        "fs:DECKGL_FILTER_COLOR": /*glsl*/ `
          float timespan = 1.5 + vRandom;
          float wave = smoothstep(0.0, 1.0, fract((uTime - (uStartTime + (vRandom * 10.0))) / timespan));
          // float wave = sin(uTime * 2.0) * 0.5 + 0.5;

          float r = 1.0 - abs(vWorldPosition.y / 90.0);
          float g = 1.0 - abs(vWorldPosition.x / 180.0);
          float circle = (geometry.uv.x * geometry.uv.x + geometry.uv.y * geometry.uv.y);
          vec4 color1 = vec4(r, g, 0.0, 0.6);
          vec4 color2 = vec4(r, g, 0.0, 0.8);

          color = mix(color1, color2, circle + wave);
          color.a = (1. - wave) * opacity;
        `,
      },
    };
  }

  draw(this: Layer, params: Record<string, unknown>, extension: this): void {
    for (const model of this.getModels()) {
      model.setUniforms({
        uTime: performance.now() / 1000,
        uStartTime: extension.startTime,
      });
    }

    this.setNeedsRedraw();

    super.draw(params, extension);
  }

  initializeState(this: Layer, context: LayerContext, extension: this): void {
    super.initializeState(context, extension);

    const attributeManager = this.getAttributeManager();

    attributeManager!.addInstanced({
      random: {
        size: 1,
        accessor: "getRandom",
        shaderAttributes: {
          aRandom: {
            vertexOffset: 0,
          },
        },
      },
    });
  }

  // updateState(this: RingExtensionType) {
  //   // const { decodeParams = {}, zoom } = this.props;

  //   for (const model of this.getModels()) {
  //     model.setUniforms({
  //       uTime: performance.now() / 1000,
  //     });
  //   }
  // }
}

RingExtension.extensionName = "RingExtension";
