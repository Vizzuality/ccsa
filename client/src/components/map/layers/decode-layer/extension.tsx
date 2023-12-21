import { Layer, LayerExtension } from "@deck.gl/core/typed";

type DecodeExtensionType = Layer<{
  decodeFunction: string;
  decodeParams: Record<string, unknown>;
  zoom: number;
}>;

export default class DecodeExtension extends LayerExtension {
  getShaders(this: DecodeExtensionType) {
    return {
      inject: {
        "fs:#decl": `
          uniform float zoom;
          uniform float startYear;
          uniform float endYear;
        `,

        "fs:DECKGL_FILTER_COLOR": `
          ${this.props.decodeFunction}
        `,
      },
    };
  }

  updateState(this: DecodeExtensionType) {
    const { decodeParams = {}, zoom } = this.props;

    for (const model of this.getModels()) {
      model.setUniforms({
        zoom,
        ...decodeParams,
      });
    }
  }
}

DecodeExtension.extensionName = "DecodeExtension";
