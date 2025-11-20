#version 300 es

uniform float uTime;

out float vTime;

in vec2 aVertex;

void main() {
	vTime = uTime;
	gl_Position = vec4(aVertex, 0.0, 1.0);
}