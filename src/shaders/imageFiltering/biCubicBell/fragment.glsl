precision highp float;
precision highp int;

uniform sampler2D texture;
uniform vec2 textureSize;

varying vec2 vUv;

float BellFunc( float x )
{
	float f = ( x / 2.0 ) * 1.5; // Converting -2 to +2 to -1.5 to +1.5
	if( f > -1.5 && f < -0.5 )
	{
		return( 0.5 * pow(f + 1.5, 2.0));
	}
	else if( f > -0.5 && f < 0.5 )
	{
		return 3.0 / 4.0 - ( f * f );
	}
	else if( ( f > 0.5 && f < 1.5 ) )
	{
		return( 0.5 * pow(f - 1.5, 2.0));
	}
	return 0.0;
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
			float f  = BellFunc( float( m ) - a );
			vec4 vecCooef1 = vec4( f,f,f,f );
			float f1 = BellFunc ( -( float( n ) - b ) );
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