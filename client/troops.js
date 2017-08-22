rotarImagen = function(NombreCanvas, Img, angle, x, y, Locations, Type, initx, inity, width, height, desiredSizex, desiredSizey) {
  angle = angle * Math.PI / 180;
  if (Type === "SpriteVertical") {
    ctxx = document.getElementById(NombreCanvas).getContext("2d");
    ctxx.save();
    ctxx.translate(x, y);
    ctxx.rotate(angle);
    if (desiredSizey == undefined) {
      ctxx.drawImage(Img, initx, inity, width, height, width / -2, height / -2, width, height);
    } else {
      ctxx.drawImage(Img, initx, inity, width, height, width / -2, height / -2, desiredSizex, desiredSizey);
    }

    ctxx.restore();
  } else {
    if (Locations === "center" || Locations === "Center" || Locations === "CENTER") {
      ctxx = document.getElementById(NombreCanvas).getContext("2d");
      ctxx.save();
      ctxx.translate(x, y);
      ctxx.rotate(angle);
      if (width == undefined || height == undefined) {
        ctxx.drawImage(Img, Img.width / -2, Img.height / -2, Img.width, Img.height);
      } else {
        ctxx.drawImage(Img, width / -2, height / -2, width, height);
      }
      ctxx.restore();
    } else if (Locations === "leftUp" || Locations === "left-up" || Locations === "leftup" || Locations === "LeftUp" || Locations === "LEFTUP") {
      ctxx = document.getElementById(NombreCanvas).getContext("2d");
      ctxx.save();
      ctxx.translate(x - Img.width / 2, y - Img.height / 2);
      ctxx.rotate(angle);
      ctxx.drawImage(Img, Img.width / 2, Img.height / 2, Img.width, Img.height);
      ctxx.restore();
    }
  }
}
