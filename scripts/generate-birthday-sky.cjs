const fs = require('node:fs');
const path = require('node:path');
const A = require('astronomy-engine');

const root = path.resolve(__dirname, '..');
const read = name => JSON.parse(fs.readFileSync(path.join(__dirname, 'sky-data', name), 'utf8'));
const instant = new Date('2007-08-07T02:00:00Z');
const observer = new A.Observer(15.32097, -91.47001, 1900);
const rotation = A.Rotation_EQJ_HOR(instant, observer);
const round = value => Number(value.toFixed(3));

// Overhead azimuthal equidistant chart: north up, east left, zenith at center.
function project(alt, az) {
  const radius = (90 - alt) / 90 * 440;
  const angle = az * Math.PI / 180;
  return { x: round(500 - radius * Math.sin(angle)), y: round(500 - radius * Math.cos(angle)), alt: round(alt), az: round(az) };
}
function horizontal([ra, dec]) {
  const vector = A.VectorFromSphere(new A.Spherical(dec, (ra + 360) % 360, 1), instant);
  const horizon = A.HorizonFromVector(A.RotateVector(rotation, vector), 'normal');
  return project(horizon.lat, horizon.lon);
}

const stars = read('stars.6.json').features
  .filter(star => star.properties.mag <= 5)
  .map(star => ({ id: star.id, ...horizontal(star.geometry.coordinates), mag: star.properties.mag, warm: Number(star.properties.bv) > .8 }))
  .filter(star => star.alt > 0);

const names = { Sco: 'Escorpio', Sgr: 'Sagitario', Lyr: 'Lira', Cyg: 'Cisne', Aql: '\u00c1guila', Boo: 'Boyero', UMa: 'Osa Mayor', Cas: 'Casiopea', Oph: 'Ofiuco', Her: 'H\u00e9rcules' };
const constellations = read('constellations.lines.json').features.filter(item => names[item.id]).map(item => {
  const segments = [];
  for (const line of item.geometry.coordinates) {
    const points = line.map(horizontal);
    for (let i = 1; i < points.length; i++) {
      if (points[i - 1].alt > 0 && points[i].alt > 0) segments.push([points[i - 1], points[i]]);
    }
  }
  const points = segments.flat();
  return { id: item.id, name: names[item.id], segments, label: {
    x: round(points.reduce((sum, point) => sum + point.x, 0) / (points.length || 1)),
    y: round(points.reduce((sum, point) => sum + point.y, 0) / (points.length || 1) - 18),
  } };
}).filter(item => item.segments.length > 1);

const bodies = ['Jupiter', 'Venus', 'Mars', 'Saturn', 'Moon'].map(body => {
  const eq = A.Equator(body, instant, observer, true, true);
  const hor = A.Horizon(instant, observer, eq.ra, eq.dec, 'normal');
  return { id: body, name: { Jupiter: 'J\u00fapiter', Venus: 'Venus', Mars: 'Marte', Saturn: 'Saturno', Moon: 'Luna' }[body], ...project(hor.altitude, hor.azimuth) };
});
const output = {
  meta: { instant: instant.toISOString(), local: '2007-08-06T20:00:00-06:00', latitude: observer.latitude, longitude: observer.longitude, place: 'Huehuetenango, Guatemala', projection: 'azimuthal-equidistant-overhead', magnitudeLimit: 5 },
  stars, constellations, planets: bodies.filter(body => body.alt > 0),
};
fs.writeFileSync(path.join(root, 'src/components/proposal/sky-data.json'), JSON.stringify(output));
console.log(JSON.stringify({ stars: stars.length, constellations: constellations.map(item => item.name), bodies }, null, 2));
