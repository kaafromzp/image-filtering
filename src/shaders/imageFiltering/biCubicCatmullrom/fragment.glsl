precision highp float;
precision highp int;
uniform sampler2D texture;
uniform vec2 textureSize;

varying vec2 vUv;
float CatMullRom( float x )
{
    const float B = 0.0;
    const float C = 0.5;
    float f = x;
    if( f < 0.0 )
    {
        f = -f;
    }
    if( f < 1.0 )
    {
        return ( ( 12.0 - 9.0 * B - 6.0 * C ) * ( f * f * f ) +
            ( -18.0 + 12.0 * B + 6.0 *C ) * ( f * f ) +
            ( 6.0 - 2.0 * B ) ) / 6.0;
    }
    else if( f >= 1.0 && f < 2.0 )
    {
        return ( ( -B - 6.0 * C ) * ( f * f * f )
            + ( 6.0 * B + 30.0 * C ) * ( f *f ) +
            ( - ( 12.0 * B ) - 48.0 * C  ) * f +
            8.0 * B + 24.0 * C)/ 6.0;
    }
    else
    {
        return 0.0;
    }
} 

vec4 BiCubic( sampler2D texture, vec2 uv )
{
    float texelSizeX = 1.0 / textureSize.x; //size of one texel 
    float texelSizeY = 1.0 / textureSize.y; //size of one texel 
    vec4 nSum = vec4( 0.0, 0.0, 0.0, 0.0 );
    vec4 nDenom = vec4( 0.0, 0.0, 0.0, 0.0 );
    float a = fract( uv.x * textureSize.x ); // get the decimal part
    float b = fract( uv.y * textureSize.y ); // get the decimal part
    for( int m = -1; m <=2; m++ )
    {
        for( int n =-1; n<= 2; n++)
        {
			vec4 vecData = texture2D(texture, 
                               uv + vec2(texelSizeX * float( m ), 
					texelSizeY * float( n )));
			float f  = CatMullRom( float( m ) - a );
			vec4 vecCooef1 = vec4( f,f,f,f );
			float f1 = CatMullRom ( -( float( n ) - b ) );
			vec4 vecCoeef2 = vec4( f1, f1, f1, f1 );
            nSum = nSum + ( vecData * vecCoeef2 * vecCooef1  );
            nDenom = nDenom + (( vecCoeef2 * vecCooef1 ));
        }
    }
    return nSum / nDenom;
}
 



void main() 
{
    gl_FragColor = BiCubic(texture,vUv);
}