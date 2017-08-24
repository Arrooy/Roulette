Distancia = function(Px, Py, Ox, Oy) {
  return (Math.sqrt(Math.pow((Px - Ox), 2) + Math.pow((Py - Oy), 2)));
}

Map = function(v, isa, ist, osa, ost) {
  return osa + (ost - osa) * ((v - isa) / (ist - isa));
}

var punto = {
  "Crear": function(px, py) {
    return [px, py];
  }
}

var Vector = {
  "Restar": function(Px, Py) {
    return [Math.abs(-Px[0] + Px[1]), Math.abs(-Py[0] + Py[1])];
  },
  "Angle": function(vec1, vec2) {
    return Math.acos((Vector.ProducteEscalar(vec1, vec2)) / (Vector.Modulo(vec1) * Vector.Modulo(vec2)));
  },
  "Modulo": function(array) {
    return Math.sqrt(Math.pow(array[0], 2) + Math.pow(array[1], 2));
  },
  "ProducteEscalar": function(vec1, vec2) {
    return (vec1[0] * vec2[0] + vec1[1] * vec2[1]);
  }
}
