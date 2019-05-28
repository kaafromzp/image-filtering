!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.ImageFilteringHelper=t():e.ImageFilteringHelper=t()}(window,function(){return function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}return n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(r,o,function(t){return e[t]}.bind(null,o));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=12)}([function(e,t){e.exports="precision highp float;\nprecision highp int;\n\nuniform sampler2D texture;\nuniform vec2 textureSize;\n\nvarying vec2 vUv;\n\nvec4 BiLinear( sampler2D texture, vec2 textureSize, vec2 uv )\n{\n    vec4 p0q0 = texture2D(texture, uv);\n    vec4 p1q0 = texture2D(texture, uv + vec2(1.0 / textureSize.x, 0));\n\n    vec4 p0q1 = texture2D(texture, uv + vec2(0, 1.0 / textureSize.y));\n    vec4 p1q1 = texture2D(texture, uv + 1.0 / textureSize );\n\n    float a = fract( uv.x * textureSize.x ); // Get Interpolation factor for X direction.\n\t\t\t\t\t// Fraction near to valid data.\n\n    vec4 pInterp_q0 = mix( p0q0, p1q0, a ); // Interpolates top row in X direction.\n    vec4 pInterp_q1 = mix( p0q1, p1q1, a ); // Interpolates bottom row in X direction.\n\n    float b = fract( uv.y * textureSize.y );// Get Interpolation factor for Y direction.\n    return mix( pInterp_q0, pInterp_q1, b ); // Interpolate in Y direction.\n}\n\n\n\nvoid main() \n{\n    gl_FragColor = BiLinear(texture,textureSize,vUv);\n}"},function(e,t){e.exports="attribute vec2 coords;\nvarying vec2 vUv;\n\nvoid main()\n{\n    vUv = 0.5 * coords + 0.5;\n     gl_Position = vec4( coords.x   ,              // base texture\n                         - coords.y ,                  // base texture\n                        0.0, 1.0 ); \n}"},function(e,t){e.exports="precision highp float;\nprecision highp int;\n\nuniform sampler2D texture;\nuniform vec2 textureSize;\n\nvarying vec2 vUv;\n\n\nfloat Triangular( float f )\n{\n\tf = f / 2.0;\n\tif( f < 0.0 )\n\t{\n\t\treturn ( f + 1.0 );\n\t}\n\telse\n\t{\n\t\treturn ( 1.0 - f );\n\t}\n\treturn 0.0;\n}\n\nvec4 BiCubic( sampler2D texture, vec2 uv )\n{\n    float texelSizeX = 1.0 / textureSize.x; //size of one texel \n    float texelSizeY = 1.0 / textureSize.y; //size of one texel \n    vec4 nSum = vec4( 0.0, 0.0, 0.0, 0.0 );\n    vec4 nDenom = vec4( 0.0, 0.0, 0.0, 0.0 );\n    float a = fract( uv.x * textureSize.x ); // get the decimal part\n    float b = fract( uv.y * textureSize.y ); // get the decimal part\n    for( int m = -1; m <=2; m++ )\n    {\n        for( int n =-1; n<= 2; n++)\n        {\n\t\t\tvec4 vecData = texture2D(texture, \n                               uv + vec2(texelSizeX * float( m ), \n\t\t\t\t\ttexelSizeY * float( n )));\n\t\t\tfloat f  = Triangular( float( m ) - a );\n\t\t\tvec4 vecCooef1 = vec4( f,f,f,f );\n\t\t\tfloat f1 = Triangular ( -( float( n ) - b ) );\n\t\t\tvec4 vecCoeef2 = vec4( f1, f1, f1, f1 );\n            nSum = nSum + ( vecData * vecCoeef2 * vecCooef1  );\n            nDenom = nDenom + (( vecCoeef2 * vecCooef1 ));\n        }\n    }\n    return nSum / nDenom;\n}\n \n\n\n\nvoid main() \n{\n    gl_FragColor = BiCubic(texture,vUv);\n}"},function(e,t){e.exports="attribute vec2 coords;\nvarying vec2 vUv;\n\nvoid main()\n{\n    vUv = 0.5 * coords + 0.5;\n     gl_Position = vec4( coords.x   ,              // base texture\n                         - coords.y ,                  // base texture\n                        0.0, 1.0 ); \n}"},function(e,t){e.exports="precision highp float;\nprecision highp int;\n\nuniform sampler2D texture;\nuniform vec2 textureSize;\n\nvarying vec2 vUv;\n\nfloat BellFunc( float x )\n{\n\tfloat f = ( x / 2.0 ) * 1.5; // Converting -2 to +2 to -1.5 to +1.5\n\tif( f > -1.5 && f < -0.5 )\n\t{\n\t\treturn( 0.5 * pow(f + 1.5, 2.0));\n\t}\n\telse if( f > -0.5 && f < 0.5 )\n\t{\n\t\treturn 3.0 / 4.0 - ( f * f );\n\t}\n\telse if( ( f > 0.5 && f < 1.5 ) )\n\t{\n\t\treturn( 0.5 * pow(f - 1.5, 2.0));\n\t}\n\treturn 0.0;\n}\n\nvec4 BiCubic( sampler2D texture, vec2 uv )\n{\n    float texelSizeX = 1.0 / textureSize.x; //size of one texel \n    float texelSizeY = 1.0 / textureSize.y; //size of one texel \n    vec4 nSum = vec4( 0.0, 0.0, 0.0, 0.0 );\n    vec4 nDenom = vec4( 0.0, 0.0, 0.0, 0.0 );\n    float a = fract( uv.x * textureSize.x ); // get the decimal part\n    float b = fract( uv.y * textureSize.y ); // get the decimal part\n    for( int m = -1; m <=2; m++ )\n    {\n        for( int n =-1; n<= 2; n++)\n        {\n\t\t\tvec4 vecData = texture2D(texture, \n                               uv + vec2(texelSizeX * float( m ), \n\t\t\t\t\ttexelSizeY * float( n )));\n\t\t\tfloat f  = BellFunc( float( m ) - a );\n\t\t\tvec4 vecCooef1 = vec4( f,f,f,f );\n\t\t\tfloat f1 = BellFunc ( -( float( n ) - b ) );\n\t\t\tvec4 vecCoeef2 = vec4( f1, f1, f1, f1 );\n            nSum = nSum + ( vecData * vecCoeef2 * vecCooef1  );\n            nDenom = nDenom + (( vecCoeef2 * vecCooef1 ));\n        }\n    }\n    return nSum / nDenom;\n}\n\n\n\n\nvoid main() \n{\n    gl_FragColor = BiCubic(texture,vUv);\n}"},function(e,t){e.exports="attribute vec2 coords;\nvarying vec2 vUv;\n\nvoid main()\n{\n    vUv = 0.5 * coords + 0.5;\n     gl_Position = vec4( coords.x   ,              // base texture\n                         - coords.y ,                  // base texture\n                        0.0, 1.0 ); \n}"},function(e,t){e.exports="precision highp float;\nprecision highp int;\n\nuniform sampler2D texture;\nuniform vec2 textureSize;\n\nvarying vec2 vUv;\n\n float BSpline( float x )\n{\n\tfloat f = x;\n\tif( f < 0.0 )\n\t{\n\t\tf = -f;\n\t}\n\n\tif( f >= 0.0 && f <= 1.0 )\n\t{\n\t\treturn ( 2.0 / 3.0 ) + ( 0.5 ) * ( f* f * f ) - (f*f);\n\t}\n\telse if( f > 1.0 && f <= 2.0 )\n\t{\n\t\treturn 1.0 / 6.0 * pow( ( 2.0 - f  ), 3.0 );\n\t}\n\treturn 1.0;\n}\n\nvec4 BiCubic( sampler2D texture, vec2 uv )\n{\n    float texelSizeX = 1.0 / textureSize.x; //size of one texel \n    float texelSizeY = 1.0 / textureSize.y; //size of one texel \n    vec4 nSum = vec4( 0.0, 0.0, 0.0, 0.0 );\n    vec4 nDenom = vec4( 0.0, 0.0, 0.0, 0.0 );\n    float a = fract( uv.x * textureSize.x ); // get the decimal part\n    float b = fract( uv.y * textureSize.y ); // get the decimal part\n    for( int m = -1; m <=2; m++ )\n    {\n        for( int n =-1; n<= 2; n++)\n        {\n\t\t\tvec4 vecData = texture2D(texture, \n                               uv + vec2(texelSizeX * float( m ), \n\t\t\t\t\ttexelSizeY * float( n )));\n\t\t\tfloat f  = BSpline( float( m ) - a );\n\t\t\tvec4 vecCooef1 = vec4( f,f,f,f );\n\t\t\tfloat f1 = BSpline ( -( float( n ) - b ) );\n\t\t\tvec4 vecCoeef2 = vec4( f1, f1, f1, f1 );\n            nSum = nSum + ( vecData * vecCoeef2 * vecCooef1  );\n            nDenom = nDenom + (( vecCoeef2 * vecCooef1 ));\n        }\n    }\n    return nSum / nDenom;\n}\n  \n\n\n\nvoid main() \n{\n    gl_FragColor = BiCubic(texture,vUv);\n}"},function(e,t){e.exports="attribute vec2 coords;\nvarying vec2 vUv;\n\nvoid main()\n{\n    vUv = 0.5 * coords + 0.5;\n     gl_Position = vec4( coords.x   ,              // base texture\n                         - coords.y ,                  // base texture\n                        0.0, 1.0 ); \n}"},function(e,t){e.exports="precision highp float;\nprecision highp int;\nuniform sampler2D texture;\nuniform vec2 textureSize;\n\nvarying vec2 vUv;\nfloat CatMullRom( float x )\n{\n    const float B = 0.0;\n    const float C = 0.5;\n    float f = x;\n    if( f < 0.0 )\n    {\n        f = -f;\n    }\n    if( f < 1.0 )\n    {\n        return ( ( 12.0 - 9.0 * B - 6.0 * C ) * ( f * f * f ) +\n            ( -18.0 + 12.0 * B + 6.0 *C ) * ( f * f ) +\n            ( 6.0 - 2.0 * B ) ) / 6.0;\n    }\n    else if( f >= 1.0 && f < 2.0 )\n    {\n        return ( ( -B - 6.0 * C ) * ( f * f * f )\n            + ( 6.0 * B + 30.0 * C ) * ( f *f ) +\n            ( - ( 12.0 * B ) - 48.0 * C  ) * f +\n            8.0 * B + 24.0 * C)/ 6.0;\n    }\n    else\n    {\n        return 0.0;\n    }\n} \n\nvec4 BiCubic( sampler2D texture, vec2 uv )\n{\n    float texelSizeX = 1.0 / textureSize.x; //size of one texel \n    float texelSizeY = 1.0 / textureSize.y; //size of one texel \n    vec4 nSum = vec4( 0.0, 0.0, 0.0, 0.0 );\n    vec4 nDenom = vec4( 0.0, 0.0, 0.0, 0.0 );\n    float a = fract( uv.x * textureSize.x ); // get the decimal part\n    float b = fract( uv.y * textureSize.y ); // get the decimal part\n    for( int m = -1; m <=2; m++ )\n    {\n        for( int n =-1; n<= 2; n++)\n        {\n\t\t\tvec4 vecData = texture2D(texture, \n                               uv + vec2(texelSizeX * float( m ), \n\t\t\t\t\ttexelSizeY * float( n )));\n\t\t\tfloat f  = CatMullRom( float( m ) - a );\n\t\t\tvec4 vecCooef1 = vec4( f,f,f,f );\n\t\t\tfloat f1 = CatMullRom ( -( float( n ) - b ) );\n\t\t\tvec4 vecCoeef2 = vec4( f1, f1, f1, f1 );\n            nSum = nSum + ( vecData * vecCoeef2 * vecCooef1  );\n            nDenom = nDenom + (( vecCoeef2 * vecCooef1 ));\n        }\n    }\n    return nSum / nDenom;\n}\n \n\n\n\nvoid main() \n{\n    gl_FragColor = BiCubic(texture,vUv);\n}"},function(e,t){e.exports="attribute vec2 coords;\nvarying vec2 vUv;\n\nvoid main()\n{\n    vUv = 0.5 * coords + 0.5;\n     gl_Position = vec4( coords.x   ,              // base texture\n                         - coords.y ,                  // base texture\n                        0.0, 1.0 ); \n}"},function(e,t){e.exports="attribute vec2 coords;\nvarying vec2 vUv;\n\nvoid main()\n{\n    vUv = 0.5 * coords + 0.5;\n     gl_Position = vec4( coords.x   ,              // base texture\n                         - coords.y ,                  // base texture\n                        0.0, 1.0 ); \n}"},function(e,t){e.exports="precision highp float;\nprecision highp int;\n\nuniform sampler2D texture;\nuniform vec2 textureSize;\n\nvarying vec2 vUv;\n\nvoid main() \n{\n    gl_FragColor = texture2D(texture,vUv);\n}"},function(e,t,n){"use strict";n.r(t);var r={GL_NEAREST:9728,GL_BILINEAR:-1,GL_BICUBIC_TRIANGULAR:-2,GL_BICUBIC_BELL:-3,GL_BICUBIC_BSPLINE:-4,GL_BICUBIC_CATMULLROM:-5},o=n(0),i=n.n(o),a=n(1),f=n.n(a),c=n(2),u=n.n(c),v=n(3),l=n.n(v),x=n(4),m=n.n(x),s=n(5),p=n.n(s),d=n(6),S=n.n(d),g=n(7),C=n.n(g),b=n(8),_=n.n(b),h=n(9),y=n.n(h),D=n(10),E=n.n(D),T=n(11),z=n.n(T);function B(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}var U=function(){function e(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e)}var t,n,o;return t=e,o=[{key:"createTexture",value:function(e,t){var n=e.createTexture();return e.bindTexture(e.TEXTURE_2D,n),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,e.RGBA,e.UNSIGNED_BYTE,t),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.NEAREST),n}},{key:"createShaderProgram",value:function(e,t,n){var r=e.createShader(e.VERTEX_SHADER);e.shaderSource(r,t),e.compileShader(r);var o=e.createShader(e.FRAGMENT_SHADER);e.shaderSource(o,n),e.compileShader(o);var i=e.createProgram();e.attachShader(i,r),e.attachShader(i,o),e.linkProgram(i);var a=e.getShaderInfoLog(r);return a.length,(a=e.getShaderInfoLog(o)).length,i}},{key:"selectShaders",value:function(e){switch(e){case r.GL_BILINEAR:return{vertex:f.a,fragment:i.a};case r.GL_BICUBIC_TRIANGULAR:return{vertex:l.a,fragment:u.a};case r.GL_BICUBIC_BELL:return{vertex:p.a,fragment:m.a};case r.GL_BICUBIC_BSPLINE:return{vertex:C.a,fragment:S.a};case r.GL_BICUBIC_CATMULLROM:return{vertex:y.a,fragment:_.a};case r.GL_NEAREST:default:return{vertex:E.a,fragment:z.a}}}},{key:"drawImageWithFiltering",value:function(t,n,r,o){var i=document.createElement("canvas");i.width=t,i.height=n;var a=i.getContext("webgl",{antialias:!1}),f=a.createBuffer();a.bindBuffer(a.ARRAY_BUFFER,f),a.bufferData(a.ARRAY_BUFFER,new Float32Array([-1,1,-1,-1,1,-1,-1,1,1,1,1,-1]),a.STATIC_DRAW);var c,u,v=e.createTexture(a,r);c=e.selectShaders(o),u=e.createShaderProgram(a,c.vertex,c.fragment),a.useProgram(u);var l={},x={};return x.position=a.getAttribLocation(u,"coords"),l.texture=a.getUniformLocation(u,"texture"),l.textureSize=a.getUniformLocation(u,"textureSize"),a.vertexAttribPointer(x.position,2,a.FLOAT,!1,0,0),a.enableVertexAttribArray(x.position),a.uniform1i(l.texture,0),a.uniform2fv(l.textureSize,[r.width,r.height]),a.viewport(0,0,i.width,i.height),a.disable(a.DEPTH_TEST),a.bindBuffer(a.ARRAY_BUFFER,f),a.activeTexture(a.TEXTURE0),a.bindTexture(a.TEXTURE_2D,v),a.drawArrays(a.TRIANGLES,0,6),i}},{key:"types",get:function(){return r}}],(n=null)&&B(t.prototype,n),o&&B(t,o),e}();t.default=U}]).default});