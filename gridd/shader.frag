#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359

uniform vec2 u_resolution;

void main() {
    //vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec2 st = gl_FragCoord.xy;
  
    //define colors based on "height" or X (in uv space)
  
    vec3 fin = vec3(0.,st.x,1.-st.x);
    fin = pow(clamp(fin/2.,0.,1.),vec3(0.5/2.2));
    gl_FragColor = vec4(fin,1.0);
}
