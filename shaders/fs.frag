#version 300 es

precision mediump float;

in float vTime;

out vec4 fragColor;

float rand(vec2 co)
{
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main() {
	float r = rand(vec2(gl_FragCoord + vTime));
	fragColor = vec4(r, r, r, 1.0);
}