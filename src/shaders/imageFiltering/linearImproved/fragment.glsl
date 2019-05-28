precision highp float;
precision highp int;

uniform sampler2D texture;
uniform vec2 textureSize;

varying vec2 vUv;

vec4 BiLinear( sampler2D texture, vec2 textureSize, vec2 uv )
{
    vec4 p0q0 = texture2D(texture, uv);
    vec4 p1q0 = texture2D(texture, uv + vec2(1.0 / textureSize.x, 0));

    vec4 p0q1 = texture2D(texture, uv + vec2(0, 1.0 / textureSize.y));
    vec4 p1q1 = texture2D(texture, uv + 1.0 / textureSize );

    float a = fract( uv.x * textureSize.x ); // Get Interpolation factor for X direction.
					// Fraction near to valid data.

    vec4 pInterp_q0 = mix( p0q0, p1q0, a ); // Interpolates top row in X direction.
    vec4 pInterp_q1 = mix( p0q1, p1q1, a ); // Interpolates bottom row in X direction.

    float b = fract( uv.y * textureSize.y );// Get Interpolation factor for Y direction.
    return mix( pInterp_q0, pInterp_q1, b ); // Interpolate in Y direction.
}



void main() 
{
    gl_FragColor = BiLinear(texture,textureSize,vUv);
}