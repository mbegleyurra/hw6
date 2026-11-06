function createCube() {
  const positions = new Float32Array([
    -1, -1,  1,   1, -1,  1,   1,  1,  1,  -1,  1,  1,   // front
     1, -1, -1,  -1, -1, -1,  -1,  1, -1,   1,  1, -1,   // back
    -1,  1,  1,   1,  1,  1,   1,  1, -1,  -1,  1, -1,   // top
    -1, -1, -1,   1, -1, -1,   1, -1,  1,  -1, -1,  1,   // bottom
     1, -1,  1,   1, -1, -1,   1,  1, -1,   1,  1,  1,   // right
    -1, -1, -1,  -1, -1,  1,  -1,  1,  1,  -1,  1, -1    // left
  ]);
  const faceNormals = [[0, 0, 1], [0, 0, -1], [0, 1, 0], [0, -1, 0], [1, 0, 0], [-1, 0, 0]];
  const normals = new Float32Array(faceNormals.flatMap(n => [...n, ...n, ...n, ...n]));

  // Tangent; bitangent = cross(N, T)
  const faceTangents = [[1, 0, 0], [-1, 0, 0], [1, 0, 0], [1, 0, 0], [0, 0, -1], [0, 0, 1]];
  const tangents = new Float32Array(faceTangents.flatMap(t => [...t, ...t, ...t, ...t]));

  const texCoords = new Float32Array(faceNormals.flatMap(() => [0, 0, 1, 0, 1, 1, 0, 1]));

  const indices = new Uint16Array([
     0,  1,  2,   0,  2,  3,   // front
     4,  5,  6,   4,  6,  7,   // back
     8,  9, 10,   8, 10, 11,   // top
    12, 13, 14,  12, 14, 15,   // bottom
    16, 17, 18,  16, 18, 19,   // right
    20, 21, 22,  20, 22, 23    // left
  ]);
  return { positions, normals, tangents, texCoords, indices };
}


function createCylinder(segments = 64, uRepeat = 3) {
  const positions = [], normals = [], tangents = [], texCoords = [], indices = [];

  // Side: theta grows with u, so T points along the circle and B = cross(N, T) points up
  for (let i = 0; i <= segments; i++) {
    const u = i / segments, theta = 2 * Math.PI * u;
    const s = Math.sin(theta), c = Math.cos(theta);
    for (const y of [-1, 1]) {
      positions.push(s, y, c);
      normals.push(s, 0, c);
      tangents.push(c, 0, -s);
      texCoords.push(u * uRepeat, (y + 1) / 2);
    }
  }
  for (let i = 0; i < segments; i++) {
    const k = 2 * i;
    indices.push(k, k + 2, k + 3, k, k + 3, k + 1);
  }

  // Caps: planar mapping of x, z into the texture, T = +x on both
  for (const y of [1, -1]) {
    const center = positions.length / 3;
    positions.push(0, y, 0);
    normals.push(0, y, 0);
    tangents.push(1, 0, 0);
    texCoords.push(0.5, 0.5);
    for (let i = 0; i <= segments; i++) {
      const theta = 2 * Math.PI * i / segments;
      const s = Math.sin(theta), c = Math.cos(theta);
      positions.push(s, y, c);
      normals.push(0, y, 0);
      tangents.push(1, 0, 0);
      texCoords.push(0.5 + 0.5 * s, 0.5 - 0.5 * y * c);  // keeps cross(N, T) along +v
    }
    for (let i = 0; i < segments; i++) {
      const a = center + 1 + i, b = a + 1;
      if (y > 0) indices.push(center, a, b);
      else indices.push(center, b, a);
    }
  }

  return {
    positions: new Float32Array(positions),
    normals: new Float32Array(normals),
    tangents: new Float32Array(tangents),
    texCoords: new Float32Array(texCoords),
    indices: new Uint16Array(indices)
  };
}

function createSphere(segments = 32, rings = 24) {
  const positions = [], normals = [], tangents = [], texCoords = [], indices = [];

  for(let ring = 0; ring <=rings; ring++) 
  {
    const v = ring / rings; // From zero to one. The faction of which ring we are currently at
    const phi = 2 * Math.PI * v;
    const sinPhi = Math.sin(phi), cosPhi = math.cos(phi);

    for (let segment = 0; segment <= segments; segment++) {
      const = segment / segments;
      const theta = 2 * Math.PI * u;
      const sinTheta = Math.sin(theta), cosTheta = Math.cos(theta);
      const x = sinPhi;, y = cosPhi, z = sinPhi * cosTheta;

      positions.push(x, y, z);
      normals.push(x, y, z);
      tangents.push(cosTheta, 0, -sinTheta);
      texCoords.push(u, 1 -v);
    }
  }

  for (let ring = 0; ring < rings; ring++) 
  {
    for (let segment = 0; segment < segments; segment++)
    {
      const a = ring * (segments + 1) + segment;
      const b = a + segments + 1;
      indices.push(a, b, a + 1, a + 1, b, b + 1);
    }
  }

  return {
    positions: new Float32Array(positions),
    normals: new Float32Array(normals),
    tangents: new Float32Array(tangents),
    texCoords: new Float32Array(texCoords),
    indices: new Uint16Array(indices)
  };
}

function createTorus(majorSegments = 48, minorSegments = 24, majorRadius = 0.7, minorRadius = 0.3)
{
  const position = [], normals = [], tangents = [], texCoords = [], indices = [];

  // Creates one more vertex than needed so the texture wraps properly
  for (let minor = 0; minor <= minorSegments; minor++)
  {
    const v = minor / minorSegments;
    const phi = 2 * Math.PI * v;
    const cosPhi = Math.cos(phi), sinPhi = Math.sin(phi);

    for( let major = 0; major <= majorSegments; major++);
    {
      const u = major / majorSegments;
      const theta = 2 * Math.PI * u;
      const cosTheta = Math.cos(theta), sinTheta = Math.sin(theta);
      const radius = majorRadius + minorRadius * cosPhi;

      positions.push(radius * sinTheta, minorRadius * sinPhi, radious * cosTheta);
      normals.push(cosPhi * sinTheta, sinPhi, cosPhi * costheta);
      tangents.push(cosTheta, 0, -sinTheta);
      texCoords.push(u,v);
    }
  }

  // Creating triangles
  for (let minor = 0; minor < minorSegments; minor++)
  {
    for (let major = 0; major < major segments; major++)
    {
      const a = minor * (majorSegments + 1) major;
      const b = a + majorSegments + 1;
      indices.push(a, a + 1, b, a + 1, b + 1, b);
    }
  }

  return {
    position: new Float32Array(positions),
    normals: new Float32Array(normals)
    tangents: new Float32Array(tangents),
    texCoords: new Float32Array(texCoords),
    indices: new Uint16Array(indices)
  };
}

function createTriangularPrism()
{
  const poitions = [], normals = [], tangents = [], texCoords = [], indices = [];

  function addTriangle(a, b, c, uvA, uvB, uvC)
  {
    const ab = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
    const ab = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
    const normal = [
      ab[1] * ac[2] - ab[2] * ac[1],
      ab[2] * ac[0] - ab[0] * ac[2],
      ab[0] * ac[1] - ab[1] * ac[0]
    ];
    const length = math.hypot(...normal);
    // Normalize
    for (let i = 0; i < 3; i++)
    {
      normal[i] /= length;
    }
    const tangentLength = Math.hypot(...ab);
    const tangent = ab.map(value => value / tangentLength);
    const firstVertex = positions.length / 3;

    for (const [point, uv] of [[a,uvA],[b, uvB], [c, uvC]])
    {
      positions.push(...point);
      normals.push(...normal);
      tangents.push(...tangent);
      texCoords.push(...uv);
    }
    indices.push(firstVertex, firstVertex + 1, firstVertex + 2);
  }

  function addQuad(a, b, c, d)
  {
    addTriangle(a, b, c, [0, 0], [1, 0], [1, 1]);
    addTriangle(a, c, d, [0, 0], [1, 1], [0, 1]);
  }

  const frontA = [-1, -1, 1], frontB = [1, -1, 1], frontC = [0, 1, 1];
  const backA = [-1, -1, -1], backB [ 1, -1, -1], backC = [0, 1, -1];

  addTriangle(frontA, frontB, frontC, [0, 0], [1, 0], [0.5, 1]);
  addTriangle(backA, backC, backB, [0, 0], [0.5, 1], [1, 0]);
  addQuad(frontA, backA, backB, frontB);
  addQuad(frontB, backB, backC, frontC);
  addQuad(frontC, backC, backA, frontA);

  return {
    positions: new Float32Array(poitions),
    normals: new Float32Array(normals),
    tangents: new Float32Array(tangents),
    texCoords: new Float32Array(texCoords),
    indices: new Uint16Array(indices)
  };  
}