'use client';
import 'leaflet/dist/leaflet.css';
import { useState, useRef, useEffect } from 'react';
import { MapContainer, GeoJSON, CircleMarker, Popup, useMap } from 'react-leaflet';

const TYPE_COLORS = {
  Epuration:   '#0066cc',
  Traitement:  '#00a3ff',
  Dessalement: '#7c3aed',
  Transfert:   '#059669',
  Pompage:     '#d97706',
  Réservoirs:  '#dc2626',
};

const HEIGHT = 'calc(100vh - 70px)';

function FlyToHandler({ mapRef }) {
  mapRef.current = useMap();
  return null;
}

export default function ProjectMap({ projects }) {
  const [activeFilters, setActiveFilters] = useState(new Set());
  const [moroccoGeo, setMoroccoGeo] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    fetch('/data/morocco.geojson').then(r => r.json()).then(setMoroccoGeo);
  }, []);

  const geoProjects = projects.filter(p => p.latitude != null && p.longitude != null);
  const allTypes = [...new Set(projects.map(p => p.projectType).filter(Boolean))];
  const isFiltered = activeFilters.size > 0;
  const filteredProjects = isFiltered
    ? geoProjects.filter(p => activeFilters.has(p.projectType))
    : geoProjects;

  const toggleFilter = (type) => {
    setActiveFilters(prev => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type); else next.add(type);
      return next;
    });
  };

  const handleFlyTo = (p) => {
    if (mapRef.current) mapRef.current.flyTo([p.latitude, p.longitude], 10, { duration: 1.2 });
  };

  return (
    <div style={{ display: 'flex', height: HEIGHT }}>

      {/* ── Sidebar ── */}
      <div style={{
        width: 280, flexShrink: 0, height: HEIGHT,
        overflowY: 'auto',
        background: '#ffffff',
        borderRight: '1px solid rgba(10,22,40,0.08)',
        display: 'flex', flexDirection: 'column',
      }}>

        {/* Header + filters */}
        <div style={{ padding: '1.5rem 1.5rem 0' }}>
          <h2 style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: '1.3rem', fontWeight: 700,
            textTransform: 'uppercase', color: '#0a1628',
            margin: 0,
          }}>
            Carte des Projets
          </h2>
          <p style={{ fontSize: '0.8rem', color: '#888', margin: '0.3rem 0 0' }}>
            {filteredProjects.length} projet(s) affichés
          </p>

          <p style={{
            fontSize: '0.7rem', textTransform: 'uppercase',
            letterSpacing: '0.1em', color: '#00a3ff',
            margin: '1.25rem 0 0.5rem',
          }}>
            Type de projet
          </p>
          <div>
            {allTypes.map(type => {
              const active = activeFilters.has(type);
              const color = TYPE_COLORS[type] ?? '#0066cc';
              return (
                <button
                  key={type}
                  onClick={() => toggleFilter(type)}
                  style={{
                    display: 'inline-flex',
                    padding: '0.3rem 0.8rem', borderRadius: 20,
                    fontSize: '0.75rem', fontWeight: 600,
                    margin: '0.2rem', cursor: 'pointer',
                    border: `1.5px solid ${color}`,
                    background: active ? color : 'white',
                    color: active ? 'white' : color,
                    transition: 'all 0.15s',
                  }}
                >
                  {type}
                </button>
              );
            })}
          </div>
          <button
            onClick={() => setActiveFilters(new Set())}
            style={{
              display: 'inline-flex',
              padding: '0.3rem 0.8rem', borderRadius: 20,
              fontSize: '0.75rem', fontWeight: 600,
              margin: '0.2rem', cursor: 'pointer',
              border: '1.5px solid rgba(10,22,40,0.25)',
              background: activeFilters.size === 0 ? '#0a1628' : 'white',
              color: activeFilters.size === 0 ? 'white' : '#0a1628',
            }}
          >
            Tout afficher
          </button>
          <hr style={{ border: 'none', borderTop: '1px solid rgba(10,22,40,0.08)', margin: '1rem 0 0' }} />
        </div>

        {/* Project list */}
        <div>
          {filteredProjects.map(p => (
            <div
              key={p.slug}
              onClick={() => handleFlyTo(p)}
              style={{
                padding: '0.75rem 1.5rem',
                borderBottom: '1px solid rgba(10,22,40,0.06)',
                cursor: 'pointer',
                display: 'flex', alignItems: 'flex-start', gap: '0.6rem',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#f7f9ff'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
            >
              <div style={{
                width: 8, height: 8, borderRadius: '50%',
                background: TYPE_COLORS[p.projectType] ?? '#0066cc',
                flexShrink: 0, marginTop: 4,
              }} />
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#0a1628' }}>
                  {p.title}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#888' }}>
                  {p.region}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Map ── */}
      <div style={{ flex: 1, height: HEIGHT }}>
        <MapContainer
          center={[31.7917, -7.0926]}
          zoom={6}
          minZoom={5}
          maxZoom={13}
          maxBounds={[[27.5, -13.5], [36.5, -0.5]]}
          maxBoundsViscosity={1.0}
          style={{ height: '100%', width: '100%', background: '#f0f4f8' }}
        >
          {moroccoGeo && (
            <GeoJSON
              data={moroccoGeo}
              style={{ fillColor: '#EEF4FF', fillOpacity: 1, color: '#0066cc', weight: 1.5 }}
            />
          )}
          <FlyToHandler mapRef={mapRef} />
          {geoProjects.map(p => {
            const isActive = !isFiltered || activeFilters.has(p.projectType);
            const color = TYPE_COLORS[p.projectType] ?? '#0066cc';
            return (
              <CircleMarker
                key={p.slug}
                center={[p.latitude, p.longitude]}
                radius={9}
                pane="markerPane"
                pathOptions={{
                  fillColor: color,
                  color: '#ffffff',
                  weight: 2,
                  fillOpacity: isActive ? 0.9 : 0.15,
                }}
              >
                <Popup>
                  <div style={{ minWidth: 180, fontFamily: 'sans-serif' }}>
                    {p.coverImage?.url && (
                      <img
                        src={p.coverImage.url}
                        alt={p.title}
                        style={{
                          width: 130, height: 80,
                          objectFit: 'cover', borderRadius: 4,
                          display: 'block', marginBottom: '0.5rem',
                        }}
                      />
                    )}
                    <div style={{
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontWeight: 'bold', fontSize: '0.9rem',
                      color: '#0a1628', marginBottom: '0.25rem',
                    }}>
                      {p.title}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#888', marginBottom: '0.4rem' }}>
                      {p.region}
                    </div>
                    {p.projectType && (
                      <span style={{
                        background: color, color: 'white',
                        borderRadius: 10, padding: '2px 8px',
                        fontSize: '0.7rem', display: 'inline-block',
                        marginBottom: '0.25rem',
                      }}>
                        {p.projectType}
                      </span>
                    )}
                    <br />
                    <a
                      href={`/realisations/${p.slug}`}
                      style={{
                        background: '#0066cc', color: 'white',
                        padding: '0.3rem 0.75rem', borderRadius: 4,
                        fontSize: '0.75rem', textDecoration: 'none',
                        display: 'inline-block', marginTop: '0.5rem',
                      }}
                    >
                      Voir le projet →
                    </a>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}
