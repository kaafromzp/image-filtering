precision highp float;
precision highp int;

uniform sampler2D texture;
uniform vec2 textureSize;

varying vec2 vUv;

void main() 
{
    gl_FragColor = texture2D(texture,vUv);
}