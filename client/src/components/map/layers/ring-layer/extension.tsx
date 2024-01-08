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
        "vs:#decl": `
          uniform float uTime;
          uniform float uStartTime;
          attribute float aRandom;
          varying float vRandom;
        `,
        "vs:#main-start": `
          vRandom = aRandom;
        `,
        "vs:DECKGL_FILTER_SIZE": `
          float timespan = 1.5 + vRandom;
          float wave = smoothstep(0.0, 1.0, fract((uTime - (uStartTime + (vRandom * 1000.0))) / timespan));
          // float wave = sin(uTime * 2.0) * 0.5 + 0.5;
          size *= wave * 3.0;`,
        "fs:#decl": `
          uniform float uTime;
          uniform float uStartTime;
          varying float vRandom;
        `,

        "fs:DECKGL_FILTER_COLOR": `
          float timespan = 1.5 + vRandom;
          float wave = smoothstep(0.0, 1.0, fract((uTime - (uStartTime + (vRandom * 1000.0))) / timespan));
          // float wave = sin(uTime * 2.0) * 0.5 + 0.5;
          float circle = (geometry.uv.x * geometry.uv.x + geometry.uv.y * geometry.uv.y);
          vec4 color1 = vec4(0.5, 0.5, 0.5, 0.6);
          vec4 color2 = vec4(0.5, 0.5, 0.5, 0.8);
          color = mix(color1, color2, circle + wave);;
          color.a = 1. - wave;
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
