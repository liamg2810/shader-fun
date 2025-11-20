#version 300 es

precision mediump float;

in float vTime;

uniform vec2 uResolution;

out vec4 fragColor;

float rand(vec2 co)
{
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main() {
	vec2 uv = gl_FragCoord.xy / uResolution;
	vec2 center = vec2(0.5, 0.5);            
	float radius = 0.25;                      
	float dist = distance(uv, center);
	if (dist < radius) {
	float r = rand(vec2(gl_FragCoord + vTime));
		fragColor = vec4(r, r, r, 1.0);
	} else {
		fragColor = vec4(0.0, 0.0, 0.0, 1.0);
	}
}