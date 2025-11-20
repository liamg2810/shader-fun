//
// Initialize a shader program, so WebGL knows how to draw our data
//
function initShaderProgram(gl, vsSource, fsSource) {
	const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
	const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

	// Create the shader program

	const shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);
	gl.linkProgram(shaderProgram);

	// If creating the shader program failed, alert

	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
		alert(
			`Unable to initialize the shader program: ${gl.getProgramInfoLog(
				shaderProgram
			)}`
		);
		return null;
	}

	return shaderProgram;
}

//
// creates a shader of the given type, uploads the source and
// compiles it.
//
function loadShader(gl, type, source) {
	const shader = gl.createShader(type);

	// Send the source to the shader object

	gl.shaderSource(shader, source);

	// Compile the shader program

	gl.compileShader(shader);

	// See if it compiled successfully

	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		alert(
			`An error occurred compiling the shaders: ${gl.getShaderInfoLog(
				shader
			)}`
		);
		gl.deleteShader(shader);
		return null;
	}

	return shader;
}

class Renderer {
	canvas;
	gl;
	shaderProgram;
	vertexBuffer;
	indexBuffer;
	shadersInit = false;
	startTime;

	// prettier-ignore
	positions = [
		-1, -1,
		1, -1,
		1, 1,
		-1, 1
	];

	// prettier-ignore
	indices = [
		0, 1, 2,
		0, 2, 3
	]

	constructor() {
		this.canvas = document.getElementById("canvas");
		if (!this.canvas) {
			alert("Canvas not found");
			return;
		}

		this.gl = this.canvas.getContext("webgl2");
		if (!this.gl) {
			alert("Unable to initialize WebGL");
			return;
		}

		this.vertexBuffer = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
		this.gl.bufferData(
			this.gl.ARRAY_BUFFER,
			new Float32Array(this.positions),
			this.gl.STATIC_DRAW
		);

		this.indexBuffer = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
		this.gl.bufferData(
			this.gl.ELEMENT_ARRAY_BUFFER,
			new Uint16Array(this.indices),
			this.gl.STATIC_DRAW
		);

		this.startTime = performance.now();
		this.initShaders().then(() => {
			this.shadersInit = true;
			this.update();
		});
	}

	async initShaders() {
		const vsSource = await (await fetch("./shaders/vs.vert")).text();
		const fsSource = await (await fetch("./shaders/fs.frag")).text();
		this.shaderProgram = initShaderProgram(this.gl, vsSource, fsSource);

		this.vertexAttribLocation = this.gl.getAttribLocation(
			this.shaderProgram,
			"aVertex"
		);
		this.timeUniform = this.gl.getUniformLocation(
			this.shaderProgram,
			"uTime"
		);
		this.resUniform = this.gl.getUniformLocation(
			this.shaderProgram,
			"uResolution"
		);
	}

	update() {
		this.canvas.width = this.canvas.clientWidth;
		this.canvas.height = this.canvas.clientHeight;
		this.draw();

		requestAnimationFrame(() => this.update());
	}

	draw() {
		if (!this.shadersInit) return;

		const gl = this.gl;
		gl.viewport(0, 0, this.canvas.width, this.canvas.height);
		gl.clearColor(0, 0, 0, 1);
		gl.clear(gl.COLOR_BUFFER_BIT);

		gl.useProgram(this.shaderProgram);

		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
		gl.vertexAttribPointer(
			this.vertexAttribLocation,
			2,
			gl.FLOAT,
			false,
			0,
			0
		);
		gl.enableVertexAttribArray(this.vertexAttribLocation);

		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

		const currentTime = (performance.now() - this.startTime) / 1000;
		gl.uniform1f(this.timeUniform, currentTime);
		gl.uniform2f(this.resUniform, this.canvas.width, this.canvas.height);
		gl.drawElements(
			gl.TRIANGLES,
			this.indices.length,
			gl.UNSIGNED_SHORT,
			0
		);
	}
}

const r = new Renderer();
