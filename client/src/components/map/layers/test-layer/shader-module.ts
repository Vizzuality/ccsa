// Copyright (c) 2015-2017 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import { project } from "@deck.gl/core/typed";
import type { Viewport, _ShaderModule as ShaderModule } from "@deck.gl/core/typed";

type ShaderModuleSettings = {
  uRadius?: number;
  uStartTime: number;
  // From layer context
  viewport: Viewport;
  mousePosition?: { x: number; y: number };
};

const vs = /* glsl */ `
  uniform vec2 uMousePos;
  uniform float uRadius;
  uniform bool uEnabled;
  uniform float uTime;
  uniform float uStartTime;

  attribute float aRandom;

  varying float vRandom;
  varying vec3 vWorldPosition;

  out float isVisible;

  bool isPointInRange(vec2 position) {
    if (!uEnabled) {
      return true;
    }
    vec2 source_commonspace = project_position(position);
    vec2 target_commonspace = project_position(uMousePos);
    float distance = length((target_commonspace - source_commonspace) / project_uCommonUnitsPerMeter.xy);

    return distance <= uRadius;
  }

  void setVisible(bool visible) {
    isVisible = float(visible);
  }

  vec4 getOffset(vec2 position) {
    if (!uEnabled) {
      return vec4(0.0);
    }

    vec2 source_commonspace = project_position(position);
    vec2 target_commonspace = project_position(uMousePos);
    float distance = length((target_commonspace - source_commonspace) / project_uCommonUnitsPerMeter.xy);

    if (distance <= uRadius) {
      vec2 moveDirection = normalize((target_commonspace - source_commonspace) / project_uCommonUnitsPerMeter.xy);
      float moveAmount = project_size((uRadius - distance)) * 0.0005;
      vec2 offset = moveDirection * moveAmount;

      return vec4(offset, 0.0, 0.0);
    } else {
      return vec4(0.0);
    }

  }

`;

const fs = /* glsl */ `
  uniform bool uEnabled;
  uniform float uTime;
  uniform float uStartTime;
  uniform float opacity;

  in float isVisible;

  varying float vRandom;
  varying vec3 vWorldPosition;
`;

const inject = {
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

  "vs:DECKGL_FILTER_GL_POSITION": /* glsl */ `
    vec2 target = geometry.worldPosition.xy;

    bool visible;
    visible = isPointInRange(target);
    setVisible(visible);

    if (visible) {
      vec4 offset = getOffset(target);
      position += offset;
    }

  `,
  "fs:DECKGL_FILTER_COLOR": /* glsl */ `
    float timespan = 1.5 + vRandom;
    float r = 1.0 - abs(vWorldPosition.y / 90.0);
    float g = 1.0 - abs(vWorldPosition.x / 180.0);
    float circle = (geometry.uv.x * geometry.uv.x + geometry.uv.y * geometry.uv.y);

    vec4 color1 = vec4(r, g, 0.0, 0.6);
    vec4 color2 = vec4(r, g, 0.0, 0.8);

    float wave = smoothstep(0.0, 1.0, fract((uTime - (uStartTime + (vRandom * 10.0))) / timespan));


    // float wave = sin(uTime * 2.0) * 0.5 + 0.5;
    color = mix(color1, color2, circle + wave);
    color.a = (1. - wave) * opacity;
  `,
};

export default {
  name: "test",
  dependencies: [project],
  vs,
  fs,
  inject,
  getUniforms: (opts?: ShaderModuleSettings): Record<string, unknown> => {
    if (!opts || !("viewport" in opts)) {
      return {};
    }
    const { uRadius = 5000000, uStartTime, mousePosition, viewport } = opts;

    return {
      uEnabled: Boolean(mousePosition && viewport.containsPixel(mousePosition)),
      uRadius: uRadius,
      uStartTime: uStartTime,
      uTime: performance.now() / 1000,
      uMousePos: mousePosition
        ? viewport.unproject([mousePosition.x - viewport.x, mousePosition.y - viewport.y])
        : [0, 0],
    };
  },
} as ShaderModule<ShaderModuleSettings>;
