Distancia = function(Px, Py, Ox, Oy) {
  return (Math.sqrt(Math.pow((Px - Ox), 2) + Math.pow((Py - Oy), 2)));
}
OrientadoA = function(Px, Py, Ox, Oy, Quadrante) {

  var AB = Vector.Create(Px, Py, Ox, Oy);
  var Neutro;
  if (Quadrante === 0) {
    Neutro = Vector.Create(0, 0, 1, 0);
  } else if (Quadrante === 1) {
    Neutro = Vector.Create(1, 0, 0, 0);
  } else if (Quadrante === 2) {
    Neutro = Vector.Create(0, 0, 1, 0);
  } else if (Quadrante === 3) {
    Neutro = Vector.Create(1, 0, 0, 0);
  }

  var jeje = Vector.Angle(AB, Neutro);
  return jeje / Math.PI * 180;
}

Distancia = function(Px, Py, Ox, Oy) {
  return (Math.sqrt(Math.pow((Px - Ox), 2) + Math.pow((Py - Oy), 2)));
}

var Vector = {
  "Create": function(Px, Py, Ox, Oy) {
    return [Math.abs(-Px + Ox), Math.abs(-Py + Oy)];
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
