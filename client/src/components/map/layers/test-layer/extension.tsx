import { Layer, LayerExtension, LayerContext } from "@deck.gl/core/typed";

import shaderModule from "@/components/map/layers/test-layer/shader-module";

type TestExtensionType = Layer<{
  radius: number;
}>;

export default class TestExtension extends LayerExtension {
  getShaders(this: TestExtensionType) {
    return {
      modules: [shaderModule],
    };
  }

  initializeState(this: Layer, context: LayerContext) {
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

    // Trigger redraw when mouse moves
    const onMouseMove = () => {
      this.getCurrentLayer()?.setNeedsRedraw();
    };

    // TODO - expose this in a better way
    this.state.onMouseMove = onMouseMove;
    if (context.deck) {
      // @ts-expect-error (2446) accessing protected property
      context.deck.eventManager.on({
        pointermove: onMouseMove,
        pointerleave: onMouseMove,
      });
    }
  }

  finalizeState(this: Layer, context: LayerContext) {
    // Remove event listeners
    if (context.deck) {
      const onMouseMove = this.state.onMouseMove as () => void;
      // @ts-expect-error (2446) accessing protected property
      context.deck.eventManager.off({
        pointermove: onMouseMove,
        pointerleave: onMouseMove,
      });
    }
  }

  draw(this: Layer, params: Record<string, unknown>, extension: this): void {
    this.setNeedsRedraw();

    super.draw(params, extension);
  }
}

TestExtension.extensionName = "TestExtension";
