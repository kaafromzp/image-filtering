import FILTERINGTYPES from './filteringTypes';
import fbilinear from './shaders/imageFiltering/linearImproved/fragment.glsl';
import vbilinear from './shaders/imageFiltering/linearImproved/vertex.glsl';
import fbicubicTriangular from './shaders/imageFiltering/biCubicTriangular/fragment.glsl';
import vbicubicTriangular from './shaders/imageFiltering/biCubicTriangular/vertex.glsl';
import fbicubicBell from './shaders/imageFiltering/biCubicBell/fragment.glsl';
import vbicubicBell from './shaders/imageFiltering/biCubicBell/vertex.glsl';
import fbicubicBspline from './shaders/imageFiltering/biCubicBspline/fragment.glsl';
import vbicubicBspline from './shaders/imageFiltering/biCubicBspline/vertex.glsl';
import fbicubicCatMullRom from './shaders/imageFiltering/biCubicCatmullrom/fragment.glsl';
import vbicubicCatMullRom from './shaders/imageFiltering/biCubicCatmullrom/vertex.glsl';
import vnearest from './shaders/imageFiltering/linearNearest/vertex.glsl';
import fnearest from './shaders/imageFiltering/linearNearest/fragment.glsl';

/**
 * Implements helper used for drawing image to canvas with different filtering
 */
class imageHelper {
    static get types() {
        return FILTERINGTYPES;
    }

    /**
     *
     * @param {Object} gl webgl canvas context
     * @param {HTMLImageElement} image source image
     */
    static createTexture(gl, image) {
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

        return texture;
    }

    /**
     * Creates shader program
     * @param {Object} gl webgl canvas context
     * @param {String} vertex vertex shader source
     * @param {String} fragment fragment shader source
     */
    static createShaderProgram(gl, vertex, fragment) {
        const vertShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertShader, vertex);
        gl.compileShader(vertShader);

        const fragShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragShader, fragment);
        gl.compileShader(fragShader);

        const shaderProgram = gl.createProgram();

        gl.attachShader(shaderProgram, vertShader);
        gl.attachShader(shaderProgram, fragShader);
        gl.linkProgram(shaderProgram);

        let compilationLog = gl.getShaderInfoLog(vertShader);
        if (compilationLog.length > 0) {
            console.warn(`vertex shader compiler log: ${compilationLog}`);
        }

        compilationLog = gl.getShaderInfoLog(fragShader);
        if (compilationLog.length > 0) {
            console.warn(`fragment shader compiler log: ${compilationLog}`);
        }

        return shaderProgram;
    }

    /**
     *
     * @param {Number} filteringType Filtering type used during image scaling
     */
    static selectShaders(filteringType) {
        switch (filteringType) {
            case FILTERINGTYPES.GL_BILINEAR:
                return { vertex: vbilinear, fragment: fbilinear };
            case FILTERINGTYPES.GL_BICUBIC_TRIANGULAR:
                return { vertex: vbicubicTriangular, fragment: fbicubicTriangular };
            case FILTERINGTYPES.GL_BICUBIC_BELL:
                return { vertex: vbicubicBell, fragment: fbicubicBell };
            case FILTERINGTYPES.GL_BICUBIC_BSPLINE:
                return { vertex: vbicubicBspline, fragment: fbicubicBspline };
            case FILTERINGTYPES.GL_BICUBIC_CATMULLROM:
                return { vertex: vbicubicCatMullRom, fragment: fbicubicCatMullRom };
            case FILTERINGTYPES.GL_NEAREST:
            default:
                return { vertex: vnearest, fragment: fnearest };
        }
    }

    /**
     * Creates canvas and draws scaled image into it
     * @param {Number} width canvas width
     * @param {Number} height canvas height
     * @param {HTMLImageElement} image source image
     * @param {Number} filteringType Filtering type used during image scaling
     */
    static drawImageWithFiltering(width, height, image, filteringType) {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const gl = canvas.getContext('webgl', { antialias: false });

        const vertices = [
            -1.0,
            1.0,
            -1.0,
            -1.0,
            1.0,
            -1.0,
            -1.0,
            1.0,
            1.0,
            1.0,
            1.0,
            -1.0,
        ];
        const vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

        let texture = imageHelper.createTexture(gl, image);
        let shaders;
        let shaderProgram;
        shaders = imageHelper.selectShaders(filteringType);
        shaderProgram = imageHelper.createShaderProgram(
            gl,
            shaders.vertex,
            shaders.fragment
        );
        gl.useProgram(shaderProgram);
        let uniforms = {};
        let attributes = {};
        attributes.position = gl.getAttribLocation(shaderProgram, 'coords');
        uniforms.texture = gl.getUniformLocation(shaderProgram, 'texture');
        uniforms.textureSize = gl.getUniformLocation(shaderProgram, 'textureSize');
        gl.vertexAttribPointer(attributes.position, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(attributes.position);
        gl.uniform1i(uniforms.texture, 0);
        gl.uniform2fv(uniforms.textureSize, [image.width, image.height]);

        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.disable(gl.DEPTH_TEST);

        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);

        gl.drawArrays(gl.TRIANGLES, 0, 6);

        return canvas;
    }
}
export default imageHelper;
