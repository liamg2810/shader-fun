#version 300 es

in vec2 aVertex;

out vec4 vColor;

void main() {
	gl_Position = vec4(aVertex, 0.0, 1.0);
	vColor = vec4(float(gl_VertexID) / 3.0, 0.5, 0.4f, 1.0f);
}