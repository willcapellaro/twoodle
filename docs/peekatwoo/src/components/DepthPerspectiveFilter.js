/**
 * Depth Perspective Filter for PIXI.js v7+
 * Adapted from Depthy project by Rafał Lindemann
 * 
 * Creates parallax effect using a color image and depth map
 */
import * as PIXI from 'pixi.js';

export class DepthPerspectiveFilter extends PIXI.Filter {
    constructor(depthTexture, quality = 3) {
        // GLSL fragment shader adapted for PIXI.js v7
        const fragmentShader = `
precision mediump float;

varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform sampler2D displacementMap;
uniform vec4 inputSize;
uniform vec4 outputFrame;
uniform vec2 mapDimensions;
uniform float scale;
uniform vec2 offset;
uniform float focus;
uniform float enlarge;

${DepthPerspectiveFilter.getQualityDefines(quality)}

const float perspective = 0.0;
const float upscale = 1.06;
float steps = MAXSTEPS;

float maskPower = steps * 1.0;
float correctPower = 1.0;

const float compression = 0.8;
const float dmin = (1.0 - compression) / 2.0;
const float dmax = (1.0 + compression) / 2.0;
const float vectorCutoff = 0.0 + dmin - 0.0001;

void main(void) {
    vec2 pos = (vTextureCoord - vec2(0.5)) / vec2(upscale) + vec2(0.5);
    
    float aspect = inputSize.x / inputSize.y;
    vec2 scale2 = vec2(scale * min(1.0, 1.0 / aspect), scale * min(1.0, aspect)) * vec2(1, -1) * vec2(ENLARGE);
    
    mat2 baseVector = mat2(vec2((0.5 - focus) * offset - offset/2.0) * scale2, 
                           vec2((0.5 - focus) * offset + offset/2.0) * scale2);
    
    mat2 vector = baseVector;
    vector[1] += (vec2(2.0) * pos - vec2(1.0)) * vec2(perspective);
    
    float dstep = compression / (steps - 1.0);
    vec2 vstep = (vector[1] - vector[0]) / vec2((steps - 1.0));
    
    vec2 posSum = vec2(0.0);
    float confidenceSum = 0.0;
    float minConfidence = dstep / 2.0;
    
    for(float i = 0.0; i < MAXSTEPS; ++i) {
        vec2 vpos = pos + vector[1] - i * vstep;
        float dpos = 0.5 + compression / 2.0 - i * dstep;
        
        if (dpos >= vectorCutoff && confidenceSum < CONFIDENCE_MAX) {
            float depth = 1.0 - texture2D(displacementMap, vpos * vec2(1, -1) + vec2(0, 1)).r;
            depth = clamp(depth, dmin, dmax);
            
            float confidence = step(dpos, depth + 0.001);
            
            if (confidence > 0.0) {
                vec2 correction = vec2((depth - dpos) / (dstep * correctPower)) * vstep;
                posSum += (vpos + correction) * confidence;
                confidenceSum += confidence;
            }
        }
    }
    
    if (confidenceSum > 0.0) {
        gl_FragColor = texture2D(uSampler, posSum / confidenceSum);
    } else {
        gl_FragColor = texture2D(uSampler, vTextureCoord);
    }
}`;

        super(null, fragmentShader, {
            displacementMap: depthTexture,
            scale: 0.015,
            offset: [0, 0],
            mapDimensions: [depthTexture.width || 1, depthTexture.height || 1],
            focus: 0.5,
            enlarge: 1.06
        });
        
        this.quality = quality;
    }
    
    static getQualityDefines(quality) {
        const qualitySettings = {
            1: { maxSteps: 4.0, enlarge: 0.8, confidenceMax: 2.5 },
            2: { maxSteps: 4.0, enlarge: 0.8, confidenceMax: 2.5 },
            3: { maxSteps: 6.0, enlarge: 1.0, confidenceMax: 2.5 },
            4: { maxSteps: 16.0, enlarge: 1.5, confidenceMax: 2.5 },
            5: { maxSteps: 40.0, enlarge: 1.5, confidenceMax: 4.5 }
        };
        
        const settings = qualitySettings[quality] || qualitySettings[3];
        
        return `
            #define MAXSTEPS ${settings.maxSteps}
            #define ENLARGE ${settings.enlarge}
            #define CONFIDENCE_MAX ${settings.confidenceMax}
        `;
    }
    
    get scale() {
        return this.uniforms.scale;
    }
    
    set scale(value) {
        this.uniforms.scale = value;
    }
    
    get offset() {
        return this.uniforms.offset;
    }
    
    set offset(value) {
        this.uniforms.offset = value;
    }
    
    get focus() {
        return this.uniforms.focus;
    }
    
    set focus(value) {
        this.uniforms.focus = value;
    }
}