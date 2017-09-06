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

  "allVectors": [],
  "UpdateList": function(vector, newVector) {
    var index;

    for (index = Vector.allVectors.length - 1; index >= 0; index--) {

      if (Vector.allVectors[index][1][0] === vector[0] && Vector.allVectors[index][1][1] === vector[1]) {
        //Coinsidensia¿?

        var star = [];
        star[0] = Vector.allVectors[index][0];
        star[1] = newVector;

        Vector.allVectors.splice(index, 1, star);

      }
    }
  },
  "DeleteElement": function(vector) {
    var index;
    for (index = Vector.allVectors.length - 1; index >= 0; index--) {

      if (Vector.allVectors[index][1][0] === vector[0] && Vector.allVectors[index][1][1] === vector[1]) {
        //Coinsidensia¿?
        Vector.allVectors.splice(index, 1);

      }
    }
  },
  "Standard": function(option, vec1, vec2) {
    var temporalVector = [];
    if (option === "restar") {

      temporalVector[0] = (vec1[0] - vec2[0]);
      temporalVector[1] = (vec1[1] - vec2[1]);

    } else if (option === "crear") {

      var VectorToStore = [];
      VectorToStore[0] = [vec1, vec2];
      VectorToStore[1] = [(vec1[0] - vec2[0]), (vec1[1] - vec2[1])];

      Vector.allVectors.push(VectorToStore);

      temporalVector = VectorToStore[1];
    }
    return temporalVector;
  },
  "Angle": function(vec1, vec2) {
    return Math.acos((Vector.ProducteEscalar(vec1, vec2)) / (Vector.Modulo(vec1) * Vector.Modulo(vec2)));
  },
  "Modulo": function(array) {
    return Math.sqrt(Math.pow(array[0], 2) + Math.pow(array[1], 2));
  },
  "ProducteEscalar": function(vec1, vec2) {
    return (vec1[0] * vec2[0] + vec1[1] * vec2[1]);
  },
  "Multiplicar": function(vector, escalar) {
    return [vector[0] * escalar, vector[1] * escalar];
  },
  "Dividir": function(vector, escalar) {
    return [vector[0] / escalar, vector[1] / escalar];
  },
  "Normalitzar": function(vector) {

    return Vector.Dividir(vector, Vector.Modulo(vector));
  },
  "SetMag": function(vector, Magnitud) {
    return Vector.Multiplicar(Vector.Normalitzar(vector), Magnitud);
  },
  "PrintOutAllVectors": function(option) {
    var centerX = window.innerWidth / 2;
    var centerY = window.innerHeight / 2;
    var index = 0;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX, centerY + 15);
    ctx.lineTo(centerX, centerY - 15);
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX + 15, centerY);
    ctx.lineTo(centerX - 15, centerY);

    for (index = Vector.allVectors.length - 1; index >= 0; index--) {

      ctx.moveTo(Vector.allVectors[index][0][0][0], Vector.allVectors[index][0][0][1]);
      if (option) {
        ctx.fillText(Vector.allVectors[index][0][0][0] + " " + Vector.allVectors[index][0][0][1], Vector.allVectors[index][0][0][0], Vector.allVectors[index][0][0][1]);
      }
      ctx.lineTo(Vector.allVectors[index][0][1][0], Vector.allVectors[index][0][1][1]);
      ctx.moveTo(Vector.allVectors[index][0][1][0] + 2, Vector.allVectors[index][0][1][1]);
      if (option) {
        ctx.fillText(Vector.allVectors[index][0][1][0] + " " + Vector.allVectors[index][0][1][1], Vector.allVectors[index][0][1][0], Vector.allVectors[index][0][1][1]);
      }
      ctx.arc(Vector.allVectors[index][0][1][0], Vector.allVectors[index][0][1][1], 2, 0, 2 * Math.PI);
    }
    ctx.stroke();
  }
}

/*

for (index = Vector.allVectors.length - 1; index >= 0; index--) {

  ctx.moveTo(Vector.allVectors[index][0][0][0], Vector.allVectors[index][0][0][1]);
  if (option) {
    ctx.fillText(Vector.allVectors[index][0][0][0] + " " + Vector.allVectors[index][0][0][1], Vector.allVectors[index][0][0][0], Vector.allVectors[index][0][0][1]);
  }
  ctx.lineTo(Vector.allVectors[index][0][1][0], Vector.allVectors[index][0][1][1]);
  ctx.moveTo(Vector.allVectors[index][0][1][0] + 2, Vector.allVectors[index][0][1][1]);
  if (option) {
    ctx.fillText(Vector.allVectors[index][0][1][0] + " " + Vector.allVectors[index][0][1][1], Vector.allVectors[index][0][1][0], Vector.allVectors[index][0][1][1]);
  }
  ctx.arc(Vector.allVectors[index][0][1][0], Vector.allVectors[index][0][1][1], 2, 0, 2 * Math.PI);
}

*/
