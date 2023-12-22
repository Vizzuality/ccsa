import { Layer, LayerExtension } from "@deck.gl/core/typed";

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
        `,
        "vs:DECKGL_FILTER_SIZE": `
          const float timespan = 1.5;
          float wave = smoothstep(0.0, 1.0, fract((uTime - uStartTime) / timespan));
          // float wave = sin(uTime * 2.0) * 0.5 + 0.5;
          size *= wave * 3.0;`,
        "fs:#decl": `
          uniform float uTime;
          uniform float uStartTime;
        `,

        "fs:DECKGL_FILTER_COLOR": `
          const float timespan = 1.5;
          float wave = smoothstep(0.0, 1.0, fract((uTime - uStartTime) / timespan));
          // float wave = sin(uTime * 2.0) * 0.5 + 0.5;
          float circle = (geometry.uv.x * geometry.uv.x + geometry.uv.y * geometry.uv.y);
          vec4 color1 = vec4(1.0, 1.0, 1.0, 0.6);
          vec4 color2 = vec4(1.0, 0.0, 0.0, 0.8);
          color = mix(color1, color2, circle + wave);;
          color.a = 1. - wave;
        `,
      },
    };
  }

  draw(this: Layer, params: Record<string, unknown>, extension: this): void {
    // const { uniforms } = params;

    for (const model of this.getModels()) {
      model.setUniforms({
        uTime: performance.now() / 1000,
        uStartTime: extension.startTime,
      });
    }

    this.setNeedsRedraw();

    super.draw(params, extension);
  }

  // initializeState(this: Layer, context: LayerContext, extension: this): void {
  //   super.initializeState(context, extension);

  //   for (const model of this.getModels()) {
  //     model.setUniforms({
  //       uTime: performance.now() / 1000,
  //       uStartTime: performance.now() / 1000,
  //     });
  //   }
  // }

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
