var vertexShader=
`
uniform sampler2D map;
varying float height;
uniform vec2 myTexResolution;



float random(vec2 co){
return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

float getDisplacement() {
float tex = texture2D(map, uv).a;
for (int i = 0; i < 100; ++i) {
tex += texture2D(map, uv + vec2(
    0.25 * random(vec2(float(i), uv.x)),
    0.25 * random(vec2(float(i), uv.y)))).a;
}
// float point = 0.1;
// tex += texture2D(map, uv + vec2(point, point));
// tex += texture2D(map, uv + vec2(-point, point));
// tex += texture2D(map, uv + vec2(point, -point));
// tex += texture2D(map, uv + vec2(-point, -point));
// tex += texture2D(map, uv + vec2(0, -point));
// tex += texture2D(map, uv + vec2(0, point));
// tex += texture2D(map, uv + vec2(point, 0));
// tex += texture2D(map, uv + vec2(-point, 0));
// tex = tex / 9.0;
return tex / 100.0;
}

/**
* Multiply each vertex by the
* model-view matrix and the
* projection matrix (both provided
* by Three.js) to get a final
* vertex position
*/
void main() {
height = getDisplacement(); //texture2D(map, uv).a;
vec3 new_pos = vec3(position.x, position.y, position.z + height * 500.0);
gl_Position = projectionMatrix *
        modelViewMatrix *
        vec4(new_pos,1.0);
}`

var fragmentShader=`/**
* Set the colour to a lovely pink.
* Note that the color is a 4D Float
* Vector, R,G,B and A and each part
* runs from 0.0 to 1.0
*/

varying float height;
void main() {
gl_FragColor = vec4(height,  // R
              height,  // G
              height,  // B
              1.0); // A
}`