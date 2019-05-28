attribute vec2 coords;
varying vec2 vUv;

void main()
{
    vUv = 0.5 * coords + 0.5;
     gl_Position = vec4( coords.x   ,              // base texture
                         - coords.y ,                  // base texture
                        0.0, 1.0 ); 
}