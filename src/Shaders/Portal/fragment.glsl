 //* Preload
  // #ifdef GL_ES
    // precision highp float;
    // #endif

    precision highp float;

    varying vec2 vUv;
    #define PI 3.14159265359
    #define TWO_PI 6.28318530718
    uniform float u_time;
    uniform vec2 u_resolution;
    uniform vec2 u_mouse;

    // useful functions


    //iquilezles.org/articls/distfunctions2d
float sdRoundedBox(vec2 p, vec2 b, vec4 r)
{
    //p - point
    //b - size of box
    //r - round box - top right, bottom right, top left, bottom left
    p = p * 2.0 - 1.;
    r.xy = (p.x > 0.0) ? r.xy : r.zw;
    r.x = (p.y > 0.0) ? r.x : r.y;
    vec2 q = abs(p)-b+r.x;
    float v =  min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r.x;
    return 1. - smoothstep(0.01, 0.015, v);
}

float sdSpiral(vec2 p, float w, float k)
{
    float r = length(p);
    float a = atan(p.y, p.x);
    float n = floor(0.5/w + (log2(r/w)*k-a)/TWO_PI);
    float ra = w * exp2((a+TWO_PI * (min(n+0., 0.) - 0.5))/k);
    float rb = w * exp2((a+TWO_PI * (min(n+1., 0.) - 0.5))/k);
    float d = min(abs(r-ra), abs(r-rb));
    float spiral = min(d, length(p + vec2(w, 0.0)));
    return 1. - smoothstep(0.01, 0.011, spiral);
}

float sdRoundedBoxOutline(vec2 p, vec2 b, vec4 r, float x)
{
    //x - thickness
    float a = sdRoundedBox(vec2(p), vec2(b), vec4(r));
    float c = sdRoundedBox(vec2(p), vec2(b.x + x, b.y + x), vec4(r));
    return (c - a);
    
}

float sdBoxOutline(vec2 p, vec2 b)
{
    //p - point 
    //b -
    p = p * 2.0 - 1.; 
    vec2 d = abs(p) - b;
    float x = length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
    float y = length(max(d, 0.0)) + min(max(d.x + 0.05, d.y + 0.05), 0.0);
    // x = 1. - smoothstep(0.01, 0.02, x);
    // y = 1. - smoothstep(0.01, 0.02, y);
    return 1.  - smoothstep(0.01, 0.2, y / x);
}

float rect( vec2 vUv, float height, float width)
{
    float left = smoothstep(((1.0 - width)/ 2.0), ((1.0 - width)/ 2.0) + 0.001, vUv.x);
    float right = smoothstep(((1.0 - width)/2.0), ((1.0 - width)/ 2.0) + 0.001, 1. - vUv.x);
    float top = smoothstep(((1.0 - height)/2.0), ((1.0 - height)/2.0) + 0.001, 1. - vUv.y);
    float bottom = smoothstep(((1.0 - height)/2.0), ((1.0 - height)/2.0) + 0.001, vUv.y);
    // return left * right * top * bottom;
    float x = left * right * top * bottom;
    // float y = x ;
    return x;
}

float rectOutline(vec2 vUv, float height, float width)
{
    float y = rect(vUv, height, width);
    float x = rect(vUv, height + 0.01, width + 0.01);
    return x - y;
}

float sdBox(vec2 p, vec2 b)
{
    //p - point 
    //b -
    p = p * 2.0 - 1.; 
    vec2 d = abs(p) - b;
    float x = length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
    return smoothstep(0.01, 0.012, x);
}

float quadraticBezier (float x, vec2 a){
    // adapted from BEZMATH.PS (1993)
    // by Don Lancaster, SYNERGETICS Inc. 
    // http://www.tinaja.com/text/bezmath.html
  
    float epsilon = 0.00001;
    a.x = clamp(a.x,0.0,1.0); 
    a.y = clamp(a.y,0.0,1.0); 
    if (a.x == 0.5){
      a += epsilon;
    }
    
    // solve t from x (an inverse operation)
    float om2a = 1.0 - 2.0 * a.x;
    float t = (sqrt(a.x*a.x + om2a*x) - a.x)/om2a;
    float y = (1.0-2.0*a.y)*(t*t) + (2.0*a.y)*t;
    return y;
}

float rand(vec2 n) { 
	return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

float noise2D(vec2 p){
	vec2 ip = floor(p);
	vec2 u = fract(p);
	u = u*u*(3.0-2.0*u);
	
	float res = mix(
		mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x),
		mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x),u.y);
	return res*res;
}

float IterateMandelbrot( in vec2 c )
{
    const float B = 256.0;

    float n = 0.0;
    vec2 z  = vec2(0.);
    for( int i=0; i<120; i++ )
    {
        z = vec2( z.x*z.x - z.y*z.y, 2.0*z.x*z.y ) + c; // z = z² + c
        if( dot(z,z)>(B*B) ) break;
        n += 1.0 * u_time;
    }

    // float sn = n - log(log(length(z))/log(B))/log(2.0); // smooth iteration count
    float sn = n - log2(log2(dot(z,z))) + 4.0;  // equivalent optimized smooth iteration count
    
    return sn;
}

float plot(vec2 p, float line, float thickness)
{
    return smoothstep(line - thickness, line, p.y) -
           smoothstep(line, line + thickness, p.y);
}

float sdCircle(vec2 p, float r)
{
    p = p * 2.0 - 1.;
    float x = length(p) - r;
    return 1. - smoothstep(0.01, 0.03, x);
}

float sdCircleOutline(vec2 p, float r)
{
    p = p * 2.0 - 1.;
    float x = length(p) - r;
    float y = length(p) - r + 0.05;
    float x1 = 1. - smoothstep(0.01, 0.03, x);
    float y1 = 1. - smoothstep(0.01, 0.03, y);
    return x1 - y1;
}

float circle(vec2 vUv, float radius)
{
    vec2 dist = vUv - vec2(0.5);
    return 1. - smoothstep(radius - (radius * 0.05), radius + (radius * 0.05), dot(dist, dist) * 4.);
}

float cirOutline(vec2 vUv, float r)
{
    vec2 dist = vUv - vec2(0.5);
    float a = 1. - smoothstep(r - (r * 0.05), r + (r * 0.05), dot(dist, dist) * 4.);
    // float b = 1. - smoothstep(r + 0.01 - ((r + 0.01)), r + 0.01 + ((r + 0.02)), dot(dist, dist) * 4.);
    float b = 1. - smoothstep(r + 0.01 - ((r + 0.01) * 0.01), r + 0.01 + ((r + 0.011) * 0.012), dot(dist, dist) * 4.);
    return b - a;
}

float sdSegment(vec2 p, vec2 a, vec2 b)
{
    vec2 pa = p-a;
    vec2 ba = b-a;
    float h = clamp(dot(pa, ba)/dot(ba,ba), 0., 1.);
    float v = length(pa - ba * h);
    return 1. - smoothstep(0.01, 0.015, v);
}

vec2 Rot(vec2 vUv, float a){
    vUv -= 0.5;
    vUv = mat2(cos(a), -sin(a),
            sin(a), cos(a)) * vUv;
    vUv += 0.5;
    return vUv;
}

float ndot(vec2 a, vec2 b)
{
    return a.x * b.x - a.y * b.y;
}

float sdRhombus(vec2 p, vec2 b)
{
    p = abs(p);
    float h = clamp(ndot(b-2. *p, b) / dot(b, b), -1., 1.);
    float d = length(p - 0.5* b*vec2(1.0-h, 1.0+h));
    return d * sign(p.x * b.y + p.y * b.x - b.x*b.y);
}

float dot2(vec2 a)
{
    return dot(a.x, a.y);
}

float trapezoid(vec2 p, float r1, float r2, float he)
{
    vec2 k1 = vec2(r2, he);
    vec2 k2 = vec2(r2-r1, 2.0 * he);
    p.x = abs(p.x);
    vec2 ca = vec2(p.x-min(p.x, (p.y<0.)?r1:r2), abs(p.y)-he);
    vec2 cb = p - k1 + k2 * clamp(dot(k1-p,k2)/dot2(k2), 0., 1.);
    float s = (cb.x < 0. && ca.y<0.)? -1.: 1.;
    return s*sqrt(min(dot(ca, ca),dot(cb, cb)));
}

float sdEqTriangle(vec2 p, float size)
{
    p = p / size;
    float k = sqrt(3.);
    p.x = abs(p.x) - 1.;
    p.y = p.y + 1.0/k;
    if(p.x+k*p.y > 0.)
    {
        p = vec2(p.x-k*p.y, -k*p.x-p.y)/2.0; 
    }
    p.x -= clamp(p.x, -2., 0.);
    return -length(p) * sign(p.y);
}

float sdEqTriangleOutline(vec2 p, float size)
{
    float x = 1. - sdEqTriangle(p, size);
    float y = 1. - sdEqTriangle(p, size + 0.025);
    x = smoothstep(0.01, 0.021, x);
    y = smoothstep(0.01, 0.021, y);
    return y - x;
}

float sdArc(vec2 p, vec2 sc, float ra, float rb){
    //sc is arc's aperture
    p.x = abs(p.x);
    sc = vec2(sin(sc.x), cos(sc.y));
    if (sc.y * p.x > sc.x * p.y){
        return length(p - sc*ra) - rb;
    }
    else {
        return abs(length(p) - ra) - rb;
    }
}

float sdTriIsosceles(vec2 p, vec2 q)
{
    p = Rot(p, PI);
    p.x = abs(p.x);
    vec2 a = p - q * clamp(dot(p,q)/dot(q,q), 0.0, 1.0);
    vec2 b = p - q * vec2( clamp(p.x/q.x, 0., 1.), 1.);
    float s = -sign(q.y);
    vec2 d = min(vec2(dot(a,a), s*(p.x*q.y-p.y*q.x)), 
                vec2(dot(b,b), s*(p.y-q.y)));
    return -sqrt(d.x)*sign(d.y);
}

float sdHexagram(vec2 p, float r)
{
    vec4 k = vec4(-0.5,0.8660254038,0.5773502692,1.7320508076);
    p = abs(p);
    p -= 2.0 * min(dot(k.xy, p), 0.0) * k.xy;
    p -= 2.0 * min(dot(k.yx, p), 0.0) * k.yx;
    p -= vec2(clamp(p.x, r*k.z, r*k.w), r);
    return length(p) * sign(p.y);
}

float sdEgg(vec2 p, float ra, float rb)
{
    float k = sqrt(3.);
    p.x = abs(p.x);
    float r = ra - rb;
    return ((p.y < 0.0) ? length(vec2(p.x, p.y)) - r :
            (k * (p.x + r) < p.y) ? length(vec2(p.x, p.y - k * r)) :
            length(vec2(p.x + r, p.y)) -2.0 * r) - rb;
}

float sdPolygon(vec2 p, int sides, float scale)
{
    p = p * 2. - 1.;
    float angle = atan(p.x, p.y) + PI;
    float radius = TWO_PI/float(sides);
    float d = cos(floor(.5 + angle/ radius) * radius - angle) * length(p);
    return 1. - smoothstep(scale, scale + 0.01, d); 
}

float sdPolygonOutline(vec2 p, int sides, float scale)
{
    float x = sdPolygon(p, sides, scale);
    float y = sdPolygon(p, sides, scale + 0.015);
    return y - x;
}

//	Classic Perlin 3D Noise 
//	by Stefan Gustavson
//
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
vec3 fade(vec3 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}

float cnoise(vec3 P){
    vec3 Pi0 = floor(P); // Integer part for indexing
    vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1
    Pi0 = mod(Pi0, 289.0);
    Pi1 = mod(Pi1, 289.0);
    vec3 Pf0 = fract(P); // Fractional part for interpolation
    vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
    vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
    vec4 iy = vec4(Pi0.yy, Pi1.yy);
    vec4 iz0 = Pi0.zzzz;
    vec4 iz1 = Pi1.zzzz;

    vec4 ixy = permute(permute(ix) + iy);
    vec4 ixy0 = permute(ixy + iz0);
    vec4 ixy1 = permute(ixy + iz1);

    vec4 gx0 = ixy0 / 7.0;
    vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
    gx0 = fract(gx0);
    vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
    vec4 sz0 = step(gz0, vec4(0.0));
    gx0 -= sz0 * (step(0.0, gx0) - 0.5);
    gy0 -= sz0 * (step(0.0, gy0) - 0.5);

    vec4 gx1 = ixy1 / 7.0;
    vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
    gx1 = fract(gx1);
    vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
    vec4 sz1 = step(gz1, vec4(0.0));
    gx1 -= sz1 * (step(0.0, gx1) - 0.5);
    gy1 -= sz1 * (step(0.0, gy1) - 0.5);

    vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
    vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
    vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
    vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
    vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
    vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
    vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
    vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

    vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
    g000 *= norm0.x;
    g010 *= norm0.y;
    g100 *= norm0.z;
    g110 *= norm0.w;
    vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
    g001 *= norm1.x;
    g011 *= norm1.y;
    g101 *= norm1.z;
    g111 *= norm1.w;

    float n000 = dot(g000, Pf0);
    float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
    float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
    float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
    float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
    float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
    float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
    float n111 = dot(g111, Pf1);

    vec3 fade_xyz = fade(Pf0);
    vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
    vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
    float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x); 
    return 2.2 * n_xyz;
}

float Sphere_SDF(vec3 point, float radius)
{
    return length(point) - radius;
}

float Box_SDF(vec3 point, vec3 size)
{
    vec3 q = abs(point) - size;
    return length(max(q, 0.)) + min(max(q.x, max(q.y, q.z)), 0.);
}

float Plane_SDF(vec3 point, vec3 normal, float h)
{
    return dot(point, normal) + h;
}

float Smooth_Difference_SDF(float shape1, float shape2, float value) 
{
    float h = clamp(0.5 - 0.5 * (shape2 + shape1) / value, 0., 1.);
    return mix(shape2, -shape1, h) + value * h * (1. - h);
}

float Smooth_Union_SDF( float shape1, float shape2, float value)
{
    float h = clamp( 0.5 + 0.5 * (shape2 - shape1)/value, 0., 1.);
    return mix(shape2, shape1, h) - value * h * (1. - h);
}

float Smooth_Intersection_SDF(float shape1, float shape2, float value)
{
    float h = clamp(0.5 - 0.5 * (shape2 - shape1)/ value, 0., 1.);
    return mix(shape2, shape1, h) + value * h * (1. - h);
}

//* numbers

float sdNumHorizontal(vec2 p)
    {
        vec2 newUv = p;
        newUv.x += 0.125;
        newUv.y -= 0.25;
        vec2 uv1 = newUv;
        vec2 uv2 = newUv;
        uv1 = Rot(uv1, PI * 0.5);
        uv1 /= .5;
        uv1 -= 1.;

        uv2 = Rot(uv2, -PI* .5);
        uv2 /= .5;
        uv2 -= 1.;
        float shape1 = sdEqTriangle(uv1, 0.15);
        shape1 = 1. - smoothstep(0.1, 0.11, shape1);

        float shape2 = sdBox(vec2(uv1.x + 0.5, uv1.y+0.75), vec2(0.33, 0.2815));
        shape2 = 1. - smoothstep(0.1, 0.11, shape2);

        float shape3 = sdEqTriangle(vec2(uv2.x, uv2.y-0.5), 0.15);
        shape3 = 1. - smoothstep(0.1, 0.11, shape3);

        return shape1 + shape2 + shape3;
    }



    float sdNumVertical(vec2 p){
        vec2 newUv = p;
        newUv.x += 0.125;
        newUv.y -= 0.25;
        vec2 uv1 = newUv;
        vec2 uv3 = newUv;
        vec2 uv4 = newUv;
        uv1 = Rot(uv1, PI * 0.5);
        uv1 /= .5;
        uv1 -= 1.;

        uv3 = Rot(uv3, PI * 1.5);
        uv3 /= .5;
        uv3 -= 1.;
        uv3.x -= 0.2;
        uv3.y += 0.1;

        uv4 = Rot(uv4, PI * 1.5);
        uv4 /= .5;
        uv4 -= 1.;
        uv4.y += 0.1;
        uv4.x -= 0.52;

        float shape1 = sdEqTriangle(vec2(uv1.x + 0.36125, uv1.y-0.01), 0.125);
        shape1 = 1. - smoothstep(0.1, 0.11, shape1);

        float shape4 = sdEqTriangle(vec2(uv3.x, uv3.y), 0.14);
        shape4 = 1. - smoothstep(0.1, 0.11, shape4);

        float shape5 = sdBox(vec2(uv1.x + 0.859, uv1.y+0.442), vec2(0.35, 0.325));
        shape5 = 1. - smoothstep(0.1, 0.11, shape5);

        float shape6 = sdEqTriangle(vec2(uv4), 0.14);
        shape6 = 1. - smoothstep(0.1, 0.11, shape6);

        float tri = ((shape4 + shape6 + shape1 ) );
        float sq = sdBox(vec2(uv1.x + 0.859, uv1.y +0.442), vec2(0.3));
        sq = 1. - smoothstep(0.1, 0.11, sq);
        float shape7 = sdBox(vec2(uv1.x + 0.859, uv1.y+0.442), vec2(0.3));
        shape7 = 1. - smoothstep(0.1, 0.11, shape7);

        return tri ;
    }

    float numNine(vec2 p){

        vec2 p2 = p;
        vec2 p3 = p;
        vec2 p4 = p;
        p = p * 1.5 - 0.25;
        p.y -= 0.15;

        p2 = Rot(p2, PI);
        p2 = p2 * 1.5 - 0.25;

        p3 = Rot(p3, -PI* .5);
        p3 = p3 * 1.5 - 0.25;
        p3 /= .5;
        p3 -= 1.;

        p4 = Rot(p4, PI* .5);
        p4 = p4 * 1.5 - 0.25;
        p4 /= .5;
        p4 -= 1.;


        float triR = sdEqTriangle(vec2(p3.x + 0.079, p3.y-0.265), 0.14);
        triR = 1. - smoothstep(0.1, 0.11, triR);

        float triL = sdEqTriangle(vec2(p4.x - 0.081, p4.y-0.265), 0.14);
        triL = 1. - smoothstep(0.1, 0.11, triL);

        float triRB = sdEqTriangle(vec2(p3.x - 0.635, p3.y-0.265), 0.14);
        triRB = 1. - smoothstep(0.1, 0.11, triRB);

        float shapehorizontal = sdNumHorizontal(p);
        // shapehorizontal *= 0.1;

        float shapehorizontal2 = sdNumHorizontal(vec2(p.x, p.y + 0.36));
        // shapehorizontal2 *= 0.1;

        float shapehorizontal3 = sdNumHorizontal(vec2(p.x, p.y + 0.72));
        shapehorizontal3 *= 0.1;

        float shapevertical = sdNumVertical(p);
        // shapevertical *= 0.1;

        float shapevertical2 = sdNumVertical(vec2(p.x, p.y + 0.36));
        shapevertical2 *= 0.1;

        float shapevertical3 = sdNumVertical(vec2(p2.x, p2.y + 0.29));
        // shapevertical3 *= 0.1;

        float shapevertical4 = sdNumVertical(vec2(p2.x, p2.y - 0.07));
        // shapevertical4 *= 0.1;
        
        float shapeNine = shapehorizontal + shapehorizontal2 + shapehorizontal3 + shapevertical + shapevertical2 + shapevertical3 + shapevertical4 + triRB;

        return shapeNine;
    }

    float numEight(vec2 p){

        vec2 p2 = p;
        vec2 p3 = p;
        vec2 p4 = p;
        p = p * 1.5 - 0.25;
        p.y -= 0.15;

        p2 = Rot(p2, PI);
        p2 = p2 * 1.5 - 0.25;

        p3 = Rot(p3, -PI* .5);
        p3 = p3 * 1.5 - 0.25;
        p3 /= .5;
        p3 -= 1.;

        p4 = Rot(p4, PI* .5);
        p4 = p4 * 1.5 - 0.25;
        p4 /= .5;
        p4 -= 1.;


        float triR = sdEqTriangle(vec2(p3.x + 0.079, p3.y-0.265), 0.14);
        triR = 1. - smoothstep(0.1, 0.11, triR);

        float triL = sdEqTriangle(vec2(p4.x - 0.081, p4.y-0.265), 0.14);
        triL = 1. - smoothstep(0.1, 0.11, triL);

        float triRB = sdEqTriangle(vec2(p3.x - 0.635, p3.y-0.265), 0.14);
        triRB = 1. - smoothstep(0.1, 0.11, triRB);

        float shapehorizontal = sdNumHorizontal(p);
        // shapehorizontal *= 0.1;

        float shapehorizontal2 = sdNumHorizontal(vec2(p.x, p.y + 0.36));
        // shapehorizontal2 *= 0.1;

        float shapehorizontal3 = sdNumHorizontal(vec2(p.x, p.y + 0.72));
        // shapehorizontal3 *= 0.1;

        float shapevertical = sdNumVertical(p);
        // shapevertical *= 0.1;

        float shapevertical2 = sdNumVertical(vec2(p.x, p.y + 0.36));
        // shapevertical2 *= 0.1;

        float shapevertical3 = sdNumVertical(vec2(p2.x, p2.y + 0.29));
        // shapevertical3 *= 0.1;

        float shapevertical4 = sdNumVertical(vec2(p2.x, p2.y - 0.07));
        // shapevertical4 *= 0.1;
        
        float shapeEight = shapehorizontal + shapehorizontal2 + shapehorizontal3 + shapevertical + shapevertical2 + shapevertical3 + shapevertical4;

        return shapeEight;
    }

    float numSeven(vec2 p){

        vec2 p2 = p;
        vec2 p3 = p;
        vec2 p4 = p;
        p = p * 1.5 - 0.25;
        p.y -= 0.15;

        p2 = Rot(p2, PI);
        p2 = p2 * 1.5 - 0.25;

        p3 = Rot(p3, -PI* .5);
        p3 = p3 * 1.5 - 0.25;
        p3 /= .5;
        p3 -= 1.;

        p4 = Rot(p4, PI* .5);
        p4 = p4 * 1.5 - 0.25;
        p4 /= .5;
        p4 -= 1.;


        float triR = sdEqTriangle(vec2(p3.x + 0.079, p3.y-0.265), 0.14);
        triR = 1. - smoothstep(0.1, 0.11, triR);

        float triL = sdEqTriangle(vec2(p4.x - 0.081, p4.y-0.265), 0.14);
        triL = 1. - smoothstep(0.1, 0.11, triL);

        float triRB = sdEqTriangle(vec2(p3.x - 0.635, p3.y-0.265), 0.14);
        triRB = 1. - smoothstep(0.1, 0.11, triRB);

        float shapehorizontal = sdNumHorizontal(p);
        // shapehorizontal *= 0.1;

        float shapehorizontal2 = sdNumHorizontal(vec2(p.x, p.y + 0.36));
        shapehorizontal2 *= 0.1;

        float shapehorizontal3 = sdNumHorizontal(vec2(p.x, p.y + 0.72));
        shapehorizontal3 *= 0.1;

        float shapevertical = sdNumVertical(p);
        shapevertical *= 0.1;

        float shapevertical2 = sdNumVertical(vec2(p.x, p.y + 0.36));
        shapevertical2 *= 0.1;

        float shapevertical3 = sdNumVertical(vec2(p2.x, p2.y + 0.29));
        // shapevertical3 *= 0.1;

        float shapevertical4 = sdNumVertical(vec2(p2.x, p2.y - 0.07));
        // shapevertical4 *= 0.1;
        
        float shapeSeven = shapehorizontal + shapehorizontal2 + shapehorizontal3 + shapevertical + shapevertical2 + shapevertical3 + shapevertical4 + triR + triRB;

        return shapeSeven;
    }

    float numSix(vec2 p){

        vec2 p2 = p;
        vec2 p3 = p;
        vec2 p4 = p;
        p = p * 1.5 - 0.25;
        p.y -= 0.15;

        p2 = Rot(p2, PI);
        p2 = p2 * 1.5 - 0.25;

        p3 = Rot(p3, -PI* .5);
        p3 = p3 * 1.5 - 0.25;
        p3 /= .5;
        p3 -= 1.;

        p4 = Rot(p4, PI* .5);
        p4 = p4 * 1.5 - 0.25;
        p4 /= .5;
        p4 -= 1.;


        float triR = sdEqTriangle(vec2(p3.x + 0.079, p3.y-0.265), 0.14);
        triR = 1. - smoothstep(0.1, 0.11, triR);

        float triL = sdEqTriangle(vec2(p4.x - 0.081, p4.y-0.265), 0.14);
        triL = 1. - smoothstep(0.1, 0.11, triL);

        float shapehorizontal = sdNumHorizontal(p);
        // shapehorizontal *= 0.1;

        float shapehorizontal2 = sdNumHorizontal(vec2(p.x, p.y + 0.36));
        // shapehorizontal2 *= 0.1;

        float shapehorizontal3 = sdNumHorizontal(vec2(p.x, p.y + 0.72));
        // shapehorizontal3 *= 0.1;

        float shapevertical = sdNumVertical(p);
        // shapevertical *= 0.1;

        float shapevertical2 = sdNumVertical(vec2(p.x, p.y + 0.36));
        // shapevertical2 *= 0.1;

        float shapevertical3 = sdNumVertical(vec2(p2.x, p2.y + 0.29));
        shapevertical3 *= 0.1;

        float shapevertical4 = sdNumVertical(vec2(p2.x, p2.y - 0.07));
        // shapevertical4 *= 0.1;
        
        float shapeSix = shapehorizontal + shapehorizontal2 + shapehorizontal3 + shapevertical + shapevertical2 + shapevertical3 + shapevertical4;

        return shapeSix;
    }

    float numFive(vec2 p){

        vec2 p2 = p;
        vec2 p3 = p;
        vec2 p4 = p;
        p = p * 1.5 - 0.25;
        p.y -= 0.15;

        p2 = Rot(p2, PI);
        p2 = p2 * 1.5 - 0.25;

        p3 = Rot(p3, -PI* .5);
        p3 = p3 * 1.5 - 0.25;
        p3 /= .5;
        p3 -= 1.;

        p4 = Rot(p4, PI* .5);
        p4 = p4 * 1.5 - 0.25;
        p4 /= .5;
        p4 -= 1.;


        float triR = sdEqTriangle(vec2(p3.x + 0.079, p3.y-0.265), 0.14);
        triR = 1. - smoothstep(0.1, 0.11, triR);

        float triL = sdEqTriangle(vec2(p4.x - 0.081, p4.y-0.265), 0.14);
        triL = 1. - smoothstep(0.1, 0.11, triL);

        float shapehorizontal = sdNumHorizontal(p);
        // shapehorizontal *= 0.1;

        float shapehorizontal2 = sdNumHorizontal(vec2(p.x, p.y + 0.36));
        // shapehorizontal2 *= 0.1;

        float shapehorizontal3 = sdNumHorizontal(vec2(p.x, p.y + 0.72));
        // shapehorizontal3 *= 0.1;

        float shapevertical = sdNumVertical(p);
        // shapevertical *= 0.1;

        float shapevertical2 = sdNumVertical(vec2(p.x, p.y + 0.36));
        shapevertical2 *= 0.1;

        float shapevertical3 = sdNumVertical(vec2(p2.x, p2.y + 0.29));
        shapevertical3 *= 0.1;

        float shapevertical4 = sdNumVertical(vec2(p2.x, p2.y - 0.07));
        // shapevertical4 *= 0.1;
        
        float shapeFive = shapehorizontal + shapehorizontal2 + shapehorizontal3 + shapevertical + shapevertical2 + shapevertical3 + shapevertical4;

        return shapeFive;
    }


    float numFour(vec2 p){

        vec2 p2 = p;
        vec2 p3 = p;
        vec2 p4 = p;
        p = p * 1.5 - 0.25;
        p.y -= 0.15;

        p2 = Rot(p2, PI);
        p2 = p2 * 1.5 - 0.25;

        p3 = Rot(p3, -PI* .5);
        p3 = p3 * 1.5 - 0.25;
        p3 /= .5;
        p3 -= 1.;

        p4 = Rot(p4, PI* .5);
        p4 = p4 * 1.5 - 0.25;
        p4 /= .5;
        p4 -= 1.;


        float triR = sdEqTriangle(vec2(p3.x + 0.079, p3.y-0.265), 0.14);
        triR = 1. - smoothstep(0.1, 0.11, triR);

        float triL = sdEqTriangle(vec2(p4.x - 0.081, p4.y-0.265), 0.14);
        triL = 1. - smoothstep(0.1, 0.11, triL);

        float triRT = sdEqTriangle(vec2(p3.x + 0.79, p3.y-0.265), 0.14);
        triRT = 1. - smoothstep(0.1, 0.11, triRT);

        float triRB = sdEqTriangle(vec2(p3.x - 0.635, p3.y-0.265), 0.14);
        triRB = 1. - smoothstep(0.1, 0.11, triRB);

        float triLT = sdEqTriangle(vec2(p4.x - 0.79, p4.y-0.265), 0.14);
        triLT = 1. - smoothstep(0.1, 0.11, triLT);

        float shapehorizontal = sdNumHorizontal(p);
        shapehorizontal *= 0.1;

        float shapehorizontal2 = sdNumHorizontal(vec2(p.x, p.y + 0.36));
        // shapehorizontal2 *= 0.1;

        float shapehorizontal3 = sdNumHorizontal(vec2(p.x, p.y + 0.72));
        shapehorizontal3 *= 0.1;

        float shapevertical = sdNumVertical(p);
        // shapevertical *= 0.1;

        float shapevertical2 = sdNumVertical(vec2(p.x, p.y + 0.36));
        shapevertical2 *= 0.1;

        float shapevertical3 = sdNumVertical(vec2(p2.x, p2.y + 0.29));
        // shapevertical3 *= 0.1;

        float shapevertical4 = sdNumVertical(vec2(p2.x, p2.y - 0.07));
        // shapevertical4 *= 0.1;
        
        float shapeFour = shapehorizontal + shapehorizontal2 + shapehorizontal3 + shapevertical + shapevertical2 + shapevertical3 + shapevertical4 + triRT + triRB + triLT;

        return shapeFour;
    }

    float numThree(vec2 p){

        vec2 p2 = p;
        vec2 p3 = p;
        vec2 p4 = p;
        p = p * 1.5 - 0.25;
        p.y -= 0.15;

        p2 = Rot(p2, PI);
        p2 = p2 * 1.5 - 0.25;

        p3 = Rot(p3, -PI* .5);
        p3 = p3 * 1.5 - 0.25;
        p3 /= .5;
        p3 -= 1.;

        p4 = Rot(p4, PI* .5);
        p4 = p4 * 1.5 - 0.25;
        p4 /= .5;
        p4 -= 1.;


        float triR = sdEqTriangle(vec2(p3.x + 0.079, p3.y-0.265), 0.14);
        triR = 1. - smoothstep(0.1, 0.11, triR);

        float triL = sdEqTriangle(vec2(p4.x - 0.081, p4.y-0.265), 0.14);
        triL = 1. - smoothstep(0.1, 0.11, triL);

        float shapehorizontal = sdNumHorizontal(p);
        // shapehorizontal *= 0.1;

        float shapehorizontal2 = sdNumHorizontal(vec2(p.x, p.y + 0.36));
        // shapehorizontal2 *= 0.1;

        float shapehorizontal3 = sdNumHorizontal(vec2(p.x, p.y + 0.72));
        // shapehorizontal3 *= 0.1;

        float shapevertical = sdNumVertical(p);
        shapevertical *= 0.1;

        float shapevertical2 = sdNumVertical(vec2(p.x, p.y + 0.36));
        shapevertical2 *= 0.1;

        float shapevertical3 = sdNumVertical(vec2(p2.x, p2.y + 0.29));
        // shapevertical3 *= 0.1;

        float shapevertical4 = sdNumVertical(vec2(p2.x, p2.y - 0.07));
        // shapevertical4 *= 0.1;
        
        float shapeThree = shapehorizontal + shapehorizontal2 + shapehorizontal3 + shapevertical + shapevertical2 + shapevertical3 + shapevertical4;

        return shapeThree;
    }

    float numTwo(vec2 p){

        vec2 p2 = p;
        vec2 p3 = p;
        vec2 p4 = p;
        p = p * 1.5 - 0.25;
        p.y -= 0.15;

        p2 = Rot(p2, PI);
        p2 = p2 * 1.5 - 0.25;

        p3 = Rot(p3, -PI* .5);
        p3 = p3 * 1.5 - 0.25;
        p3 /= .5;
        p3 -= 1.;

        p4 = Rot(p4, PI* .5);
        p4 = p4 * 1.5 - 0.25;
        p4 /= .5;
        p4 -= 1.;


        float triR = sdEqTriangle(vec2(p3.x + 0.079, p3.y-0.265), 0.14);
        triR = 1. - smoothstep(0.1, 0.11, triR);

        float triL = sdEqTriangle(vec2(p4.x - 0.081, p4.y-0.265), 0.14);
        triL = 1. - smoothstep(0.1, 0.11, triL);

        float shapehorizontal = sdNumHorizontal(p);
        // shapehorizontal *= 0.1;

        float shapehorizontal2 = sdNumHorizontal(vec2(p.x, p.y + 0.36));
        // shapehorizontal2 *= 0.1;

        float shapehorizontal3 = sdNumHorizontal(vec2(p.x, p.y + 0.72));
        // shapehorizontal3 *= 0.1;

        float shapevertical = sdNumVertical(p);
        shapevertical *= 0.1;

        float shapevertical2 = sdNumVertical(vec2(p.x, p.y + 0.36));
        // shapevertical2 *= 0.1;

        float shapevertical3 = sdNumVertical(vec2(p2.x, p2.y + 0.29));
        // shapevertical3 *= 0.1;

        float shapevertical4 = sdNumVertical(vec2(p2.x, p2.y - 0.07));
        shapevertical4 *= 0.1;
        
        float shapeTwo = shapehorizontal + shapehorizontal2 + shapehorizontal3 + shapevertical + shapevertical2 + shapevertical3 + shapevertical4;

        return shapeTwo;
    }

    float numOne(vec2 p){

        vec2 p2 = p;
        vec2 p3 = p;
        vec2 p4 = p;
        p = p * 1.5 - 0.25;
        p.y -= 0.15;

        p2 = Rot(p2, PI);
        p2 = p2 * 1.5 - 0.25;

        p3 = Rot(p3, -PI* .5);
        p3 = p3 * 1.5 - 0.25;
        p3 /= .5;
        p3 -= 1.;

        p4 = Rot(p4, PI* .5);
        p4 = p4 * 1.5 - 0.25;
        p4 /= .5;
        p4 -= 1.;


        float triR = sdEqTriangle(vec2(p3.x + 0.079, p3.y-0.265), 0.14);
        triR = 1. - smoothstep(0.1, 0.11, triR);

        float triL = sdEqTriangle(vec2(p4.x - 0.081, p4.y-0.265), 0.14);
        triL = 1. - smoothstep(0.1, 0.11, triL);

        float triRT = sdEqTriangle(vec2(p3.x + 0.79, p3.y-0.265), 0.14);
        triRT = 1. - smoothstep(0.1, 0.11, triRT);

        float triRB = sdEqTriangle(vec2(p3.x - 0.635, p3.y-0.265), 0.14);
        triRB = 1. - smoothstep(0.1, 0.11, triRB);

        float shapehorizontal = sdNumHorizontal(p);
        shapehorizontal *= 0.1;

        float shapehorizontal2 = sdNumHorizontal(vec2(p.x, p.y + 0.36));
        shapehorizontal2 *= 0.1;

        float shapehorizontal3 = sdNumHorizontal(vec2(p.x, p.y + 0.72));
        shapehorizontal3 *= 0.1;

        float shapevertical = sdNumVertical(p);
        shapevertical *= 0.1;

        float shapevertical2 = sdNumVertical(vec2(p.x, p.y + 0.36));
        shapevertical2 *= 0.1;

        float shapevertical3 = sdNumVertical(vec2(p2.x, p2.y + 0.29));

        float shapevertical4 = sdNumVertical(vec2(p2.x, p2.y - 0.07));
        
        float shapeOne = shapehorizontal + shapehorizontal2 + shapehorizontal3 + shapevertical + shapevertical2 + shapevertical3 + shapevertical4 + triR + triRT + triRB;

        return shapeOne;
    }

    float numZero(vec2 p){

        vec2 p2 = p;
        vec2 p3 = p;
        vec2 p4 = p;
        p = p * 1.5 - 0.25;
        p.y -= 0.15;

        p2 = Rot(p2, PI);
        p2 = p2 * 1.5 - 0.25;

        p3 = Rot(p3, -PI* .5);
        p3 = p3 * 1.5 - 0.25;
        p3 /= .5;
        p3 -= 1.;

        p4 = Rot(p4, PI* .5);
        p4 = p4 * 1.5 - 0.25;
        p4 /= .5;
        p4 -= 1.;


        float triR = sdEqTriangle(vec2(p3.x + 0.079, p3.y-0.265), 0.14);
        triR = 1. - smoothstep(0.1, 0.11, triR);

        float triL = sdEqTriangle(vec2(p4.x - 0.081, p4.y-0.265), 0.14);
        triL = 1. - smoothstep(0.1, 0.11, triL);

        float shapehorizontal = sdNumHorizontal(p);
        // shapehorizontal *= 0.1;

        float shapehorizontal2 = sdNumHorizontal(vec2(p.x, p.y + 0.36));
        shapehorizontal2 *= 0.1;

        float shapehorizontal3 = sdNumHorizontal(vec2(p.x, p.y + 0.72));
        // shapehorizontal3 *= 0.1;

        float shapevertical = sdNumVertical(p);
        // shapevertical *= 0.1;

        float shapevertical2 = sdNumVertical(vec2(p.x, p.y + 0.36));
        // shapevertical2 *= 0.1;

        float shapevertical3 = sdNumVertical(vec2(p2.x, p2.y + 0.29));

        float shapevertical4 = sdNumVertical(vec2(p2.x, p2.y - 0.07));
        
        float shapeZero = shapehorizontal + shapehorizontal2 + shapehorizontal3 + shapevertical + shapevertical2 + shapevertical3 + shapevertical4 + triR + triL;

        return shapeZero;
    }


    float sdZero(vec2 p)
    {
        vec2 p2 = p;
        p2 *= 4.;
        vec2 p3 = p2;
        p3 = Rot(p3, PI);
        float a = PI * (0.5 + 0.25);
        float b = 0.2 *(0.5 + 0.5);
        float z1 = sdArc(vec2(p2.x - 2., p2.y - 2.4), vec2(a * 0.7, a * 0.7), .36, b * 0.85 );
        float z2 = sdArc(vec2(p3.x+1., p3.y+0.61), vec2(a * 0.7, a * 0.7), .36, b * 0.85 );
        z1 = 1. - smoothstep(0.01, 0.02, z1);
        z2 = 1. - smoothstep(0.01, 0.02, z2);
        float z3=sdRoundedBox((vec2(p.x+0.088, p.y)), vec2(0.082, 0.275), vec4(0.075));
        float z4=sdRoundedBox((vec2(p.x-0.088, p.y)), vec2(0.082, 0.275), vec4(0.075));
        return z1 + z2 + z3 + z4;
    }

    float sdOne(vec2 p)
    {
        p.x -= 0.15;
        vec2 vUv2 = p;
        p = p * 2. - 0.5;
        vUv2 = Rot(vUv2, PI * -0.25);
        float x1 = sdRoundedBox(vec2(p.x + 0.275, p.y), vec2(0.17, 0.85), vec4(0.1, 0.1, 0.1, 0.1));
        float x2 = sdRoundedBox(vec2(vUv2.x + 0.24, vUv2.y + 0.05), vec2(0.07, 0.2), vec4(0.1, 0.075, 0.1, 0.075));
        return x1 + x2;
    }

    float sdTwo(vec2 p)
    {
        p.x += 0.1;
        vec2 p2 = p;
        p = p * 2. - 0.5;
        vec2 p3 = p;
        p3 = p3 * 2. - 1.;
        p3.x -= 0.5;
        float a = PI * (0.5 + 0.25);
        float b = 0.2 *(0.5 + 0.5);
        p3 = Rot(p3, PI * 1.85);
        float x1 = sdArc(vec2(p3.x - 0.1, p3.y - 0.15), vec2(a * 0.8, a * 0.8), .35, b * 0.84 );
        x1 = smoothstep(0.01, 0.02, x1);
        p2 = Rot(p2, PI * -0.22);
        float x2 = sdRoundedBox(vec2(p2.x - 0.122, p2.y - 0.05), vec2(0.075, 0.35), vec4(0.2, 0.1, 0.1, 0.1));
        float x3 = sdRoundedBox(vec2(p.x - 0.25, p.y + 0.335), vec2(0.5, 0.155), vec4(0.1, 0.1, 0.1, 0.1));
        return 1. - x1 + x2 + x3;
    }

    float sdThree(vec2 p)
    {
        p = p * 2. - 0.5;
        p *= 1.2;
        p.y += 0.125;
        p = Rot(p, PI * -0.5);
        p = p * 2. - 1.;
        vec2 p2 = p;
        vec2 p3 = p;
        p2 = Rot(p2, PI * -0.7);
        p3 = Rot(p3, PI * -0.7 * 2.);
        float a = PI * (0.5 + 0.25);
        float b = 0.2 *(0.5 + 0.5);

        float x1 = sdArc(vec2(p.x, p.y), vec2(a * 0.8, a * 0.8), .45, b * 0.85 );
        float x2 = sdArc(vec2(p.x + 0.9, p.y), vec2(a * 0.8, a * 0.8), .45, b * 0.85 );
        float x3 = sdArc(vec2(p2.x - 1.2, p2.y - 0.39), vec2(a * 0.1, a * 0.1), .45, b * 0.85 );
        float x4 = sdArc(vec2(p3.x - 0.43, p3.y - 1.99), vec2(a * 0.1, a * 0.1), .45, b * 0.85 );

        x1 = 1. - smoothstep(0.01, 0.02, x1);
        x2 = 1. - smoothstep(0.01, 0.02, x2);
        x3 = 1. - smoothstep(0.01, 0.02, x3);
        x4 = 1. - smoothstep(0.01, 0.02, x4);

        return x1 + x2 + x3 + x4;
    }

    float sdFour(vec2 p)
    {
        float f1 = sdRoundedBox(vec2(p.x + 0.125, p.y - 0.09), vec2(0.07, 0.25), vec4(0.075));
        float f2 = sdRoundedBox(vec2(p.x - 0.05, p.y + 0.), vec2(0.07, 0.425), vec4(0.075));
        float f3 = sdRoundedBox(vec2(p.x + 0.00125, p.y - 0.0), vec2(0.3, 0.07), vec4(0.075));
        return f1 + f2 + f3;
    }

    float sdFive(vec2 p)
    {
        p = p * 1.05;
        p.x -= 0.05;
        p.y -= 0.02;
        float f1=sdRoundedBox((vec2(p.x+0.01, p.y-0.17)), vec2(0.275, 0.08), vec4(0.075));
        float f2=sdRoundedBox((vec2(p.x + 0.03, p.y+0.17)), vec2(0.225, 0.08), vec4(0.075));
        float f3=sdRoundedBox((vec2(p.x + 0.03, p.y+0.005)), vec2(0.245, 0.08), vec4(0.075));
        float f4=sdRoundedBox((vec2(p.x+0.112, p.y-0.09)), vec2(0.08, 0.225), vec4(0.075));
        vec2 p2 = p;
        p2 = Rot(p2, PI * -0.5);
        p2 *=4.;
        float a = PI * (0.5 + 0.25);
        float b = 0.2 *(0.5 + 0.5);
        float f5 = sdArc(vec2(p2.x - 2.35, p2.y - 2.09), vec2(a * 0.5, a * 0.5), .36, b * 0.85 );
        f5 = 1. - smoothstep(0.0, 0.02, f5);
        return f1 + f2 + f3 + f4 + f5;
    }

    float sdSix(vec2 p)
    {
        vec2 p2 = p;
        vec2 p4 = p2;
        p2 *= 4.;
        vec2 p3 = p2;
        p3 = Rot(p3, PI);
        // p4 = Rot(p4, PI * 0.125);
        p4 *= 4.;
        float a = PI * (0.5 + 0.25);
        float b = 0.2 *(0.5 + 0.5);
        float s1 = sdArc(vec2(p2.x - 2., p2.y - 1.7), vec2(a * 0.72, a * 0.72), .36, b * 0.82 );
        float s2 = sdArc(vec2(p3.x+1., p3.y+0.65), vec2(a * 0.72, a * 0.72), .36, b * 0.82 );
        float s3 = sdArc(vec2(p4.x - 1.945, p4.y - 2.35), vec2(a * 0.4, a * 0.4), .36, b * 0.82 );
        s1 = 1. - smoothstep(0.01, 0.02, s1);
        s2 = 1. - smoothstep(0.01, 0.02, s2);
        s3 = 1. - smoothstep(0.01, 0.02, s3);
        float s4=sdRoundedBox((vec2(p.x+0.092, p.y-0.035)), vec2(0.0725, 0.275), vec4(0.075));
        return s1 + s2 + s3 + s4;
    }

    float sdSeven(vec2 p)
    {
        vec2 p2 = p;
        float s1 = sdRoundedBox((vec2(p.x+0.01, p.y-0.17)), vec2(0.275, 0.08), vec4(0.075));
        p2 = Rot(p2, PI * -0.127);
        float s2 = sdRoundedBox((vec2(p2.x-0.016, p2.y+0.001)), vec2(0.08, 0.44), vec4(0.075));
        return s1 + s2;
    }

    float sdEight(vec2 p)
    {
        p *= 4.;
        vec2 p2 = p;
        p2 = Rot(p2, PI);
        float a = PI * (0.5 + 0.25);
        float b = 0.2 *(0.5 + 0.5);
        float e1 = sdArc(vec2(p.x - 2., p.y - 1.7), vec2(a * 0.72, a * 0.72), .36, b * 0.82 );
        float e2 = sdArc(vec2(p2.x+1., p2.y+0.65), vec2(a * 0.72, a * 0.72), .36, b * 0.82 );
        float e3 = sdArc(vec2(p.x - 2., p.y - 2.45), vec2(a * 0.72, a * 0.72), .36, b * 0.82 );
        float e4 = sdArc(vec2(p2.x+1., p2.y+1.5 * 0.95), vec2(a * 0.72, a * 0.72), .36, b * 0.82 );
        e1 = 1. - smoothstep(0.01, 0.02, e1);
        e2 = 1. - smoothstep(0.01, 0.02, e2);
        e3 = 1. - smoothstep(0.01, 0.02, e3);
        e4 = 1. - smoothstep(0.01, 0.02, e4);
        return e1 + e2 + e3 + e4;
    }

    float sdNine(vec2 p)
    {
        p = Rot(p, PI);
        vec2 p2 = p;
        vec2 p4 = p2;
        p2 *= 4.;
        vec2 p3 = p2;
        p3 = Rot(p3, PI);
        // p4 = Rot(p4, PI * 0.125);
        p4 *= 4.;
        float a = PI * (0.5 + 0.25);
        float b = 0.2 *(0.5 + 0.5);
        float n1 = sdArc(vec2(p2.x - 2., p2.y - 1.7), vec2(a * 0.72, a * 0.72), .36, b * 0.82 );
        float n2 = sdArc(vec2(p3.x+1., p3.y+0.65), vec2(a * 0.72, a * 0.72), .36, b * 0.82 );
        float n3 = sdArc(vec2(p4.x - 1.945, p4.y - 2.35), vec2(a * 0.4, a * 0.4), .36, b * 0.82 );
        n1 = 1. - smoothstep(0.01, 0.02, n1);
        n2 = 1. - smoothstep(0.01, 0.02, n2);
        n3 = 1. - smoothstep(0.01, 0.02, n3);
        float n4=sdRoundedBox((vec2(p.x+0.092, p.y-0.035)), vec2(0.0725, 0.275), vec4(0.075));
        return n1 + n2 + n3 + n4;
    }
 
 
 // Some useful functions
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

//
// Description : GLSL 2D simplex noise function
//      Author : Ian McEwan, Ashima Arts
//  Maintainer : ijm
//     Lastmod : 20110822 (ijm)
//     License :
//  Copyright (C) 2011 Ashima Arts. All rights reserved.
//  Distributed under the MIT License. See LICENSE file.
//  https://github.com/ashima/webgl-noise
//
float snoise(vec2 v) {

    // Precompute values for skewed triangular grid
    const vec4 C = vec4(0.211324865405187,
                        // (3.0-sqrt(3.0))/6.0
                        0.366025403784439,
                        // 0.5*(sqrt(3.0)-1.0)
                        -0.577350269189626,
                        // -1.0 + 2.0 * C.x
                        0.024390243902439);
                        // 1.0 / 41.0

    // First corner (x0)
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);

    // Other two corners (x1, x2)
    vec2 i1 = vec2(0.0);
    i1 = (x0.x > x0.y)? vec2(1.0, 0.0):vec2(0.0, 1.0);
    vec2 x1 = x0.xy + C.xx - i1;
    vec2 x2 = x0.xy + C.zz;

    // Do some permutations to avoid
    // truncation effects in permutation
    i = mod289(i);
    vec3 p = permute(
            permute( i.y + vec3(0.0, i1.y, 1.0))
                + i.x + vec3(0.0, i1.x, 1.0 ));

    vec3 m = max(0.5 - vec3(
                        dot(x0,x0),
                        dot(x1,x1),
                        dot(x2,x2)
                        ), 0.0);

    m = m*m ;
    m = m*m ;

    // Gradients:
    //  41 pts uniformly over a line, mapped onto a diamond
    //  The ring size 17*17 = 289 is close to a multiple
    //      of 41 (41*7 = 287)

    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;

    // Normalise gradients implicitly by scaling m
    // Approximation of: m *= inversesqrt(a0*a0 + h*h);
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0+h*h);

    // Compute final noise value at P
    vec3 g = vec3(0.0);
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * vec2(x1.x,x2.x) + h.yz * vec2(x1.y,x2.y);
    return 130.0 * dot(m, g);
}


float ridge(float h, float offset) {
    h = abs(h);     // create creases
    h = offset - h; // invert so creases are at top
    h = h * h * h * h;      // sharpen creases
    return h;
}

#define OCTAVES 6
float fbm (in vec2 st) {
    // Initial values
    float value = 0.0;
    float amplitude = .5;
    float frequency = 0.1;
    float lacunarity = 2.0;
    float prev = 1.0;
    float offset = 0.9;
    float gain = 0.5;
    // Loop of octaves
    for (int i = 0; i < OCTAVES; i++) {
        float n = ridge(snoise(st * frequency + (u_time * 0.25)), offset);
        value += n * amplitude;
        value += n * amplitude * prev;
        prev = n;
        frequency *= lacunarity;
        //st.x += u_time * 0.25;
        amplitude *= gain;
    }
    return value;
}

void main(){
    vec2 vUv = vec2(vUv.x, vUv.y);
    vUv = vUv * 2.75;
    vec3 color = vec3(0.);
    float x = fbm(vUv * 1.0 + fbm(vUv * 5. + fbm(vUv * 10.)));
    color += x;
    vec2 q = vec2(0.);
    q.x = fbm( vUv);
    q.y = fbm( vUv);

    vec2 r = vec2(0.);
    r.x = fbm( vUv + 1.0*q + vec2(1.7,9.2)+ 0.15*u_time );
    r.y = fbm( vUv + 1.0*q + vec2(8.3,2.8)+ 0.126*u_time);
    //x += x * sin(u_time * 0.15);
    //color += x;
    //color.x += sin(u_time * 0.05);
    color = mix(color,
                vec3(0.9,0.9,0.9),
                clamp(length(r- x),0.0,0.5));

    color = mix(color,
                vec3(0.16,0.16,0.16),
                clamp(length(q - x),0.0,1.0));
    gl_FragColor = vec4(color, 1.);
}