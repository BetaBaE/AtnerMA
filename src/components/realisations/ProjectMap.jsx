'use client';
import 'leaflet/dist/leaflet.css';
import { useState, useRef, useEffect } from 'react';
import { MapContainer, GeoJSON, CircleMarker, Popup, useMap } from 'react-leaflet';

const TYPE_COLORS = {
  Epuration:   '#074685',
  Traitement:  '#00a3ff',
  Dessalement: '#7c3aed',
  Transfert:   '#059669',
  Pompage:     '#d97706',
  Réservoirs:  '#dc2626',
};

const HEIGHT = 'calc(100vh - 70px)';

function FlyToHandler({ mapRef }) {
  const map = useMap();
  useEffect(() => { mapRef.current = map; }, [map, mapRef]);
  return null;
}

export default function ProjectMap({ projects }) {
  const [activeFilters, setActiveFilters] = useState(new Set());
  const [moroccoGeo, setMoroccoGeo] = useState(null);
  const [listPage, setListPage] = useState(0);
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

  const PAGE_SIZE = 7;
  const totalPages = Math.max(1, Math.ceil(filteredProjects.length / PAGE_SIZE));
  const visibleListProjects = filteredProjects.slice(listPage * PAGE_SIZE, (listPage + 1) * PAGE_SIZE);

  const toggleFilter = (type) => {
    setActiveFilters(prev => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type); else next.add(type);
      return next;
    });
    setListPage(0);
  };

  const handleFlyTo = (p) => {
    if (mapRef.current) mapRef.current.flyTo([p.latitude, p.longitude], 10, { duration: 1.2 });
  };

  return (
    <>
    <style>{`
      .leaflet-popup-content-wrapper {
        padding: 0 !important;
        overflow: hidden;
        border-radius: 8px !important;
      }
      .leaflet-popup-content {
        margin: 0 !important;
        width: auto !important;
      }
      .leaflet-popup-close-button {
        color: #ffffff !important;
        background: rgba(0,0,0,0.45) !important;
        border-radius: 50% !important;
        width: 22px !important;
        height: 22px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        top: 6px !important;
        right: 6px !important;
        font-size: 14px !important;
        line-height: 1 !important;
      }
      .popup-link {
        position: relative;
        display: inline-block;
        color: #0066cc;
        font-size: 0.8rem;
        font-weight: 600;
        text-decoration: none;
      }
      .popup-link::before,
      .popup-link::after {
        content: '';
        position: absolute;
        left: 0;
        width: 0;
        height: 1.5px;
        background: linear-gradient(90deg, #00a3ff, #0066cc);
        transition: width 0.3s ease;
      }
      .popup-link::before { top: -2px; }
      .popup-link::after { bottom: -2px; }
      .popup-link:hover::before,
      .popup-link:hover::after { width: 100%; }
    `}</style>
    <div style={{ display: 'flex', height: HEIGHT }}>

      {/* ── Sidebar ── */}
      <div style={{
        width: 280, flexShrink: 0, height: HEIGHT,
        overflow: 'hidden',
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
            onClick={() => { setActiveFilters(new Set()); setListPage(0); }}
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
          {visibleListProjects.map(p => (
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

        {/* Pagination */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: '0.5rem', padding: '0.75rem 1.5rem',
          borderTop: '1px solid rgba(10,22,40,0.06)',
        }}>
          <button
            onClick={() => setListPage(p => p - 1)}
            disabled={listPage === 0}
            style={{
              width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'transparent', border: '1px solid rgba(10,22,40,0.12)',
              borderRadius: 4, cursor: listPage === 0 ? 'default' : 'pointer',
              color: '#0a1628', fontSize: '1rem',
              opacity: listPage === 0 ? 0.3 : 1,
            }}
          >‹</button>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0a1628', minWidth: 48, textAlign: 'center' }}>
            {listPage + 1} / {totalPages}
          </span>
          <button
            onClick={() => setListPage(p => p + 1)}
            disabled={listPage === totalPages - 1}
            style={{
              width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'transparent', border: '1px solid rgba(10,22,40,0.12)',
              borderRadius: 4, cursor: listPage === totalPages - 1 ? 'default' : 'pointer',
              color: '#0a1628', fontSize: '1rem',
              opacity: listPage === totalPages - 1 ? 0.3 : 1,
            }}
          >›</button>
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
                  <div style={{ minWidth: 200, fontFamily: 'sans-serif' }}>
                    {p.coverImage?.url && (
                      <img
                        src={p.coverImage.url}
                        alt={p.title}
                        style={{
                          width: '100%', height: 110,
                          objectFit: 'cover',
                          display: 'block',
                          borderRadius: '4px 4px 0 0',
                          margin: 0,
                        }}
                      />
                    )}
                    <div style={{ padding: '0.65rem 0.75rem' }}>
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
                          marginBottom: '0.4rem',
                        }}>
                          {p.projectType}
                        </span>
                      )}
                      <br />
                      <a href={`/realisations/${p.slug}`} className="popup-link" style={{ marginTop: '0.4rem' }}>
                        Voir le projet →
                      </a>
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>
      </div>
    </div>
    </>
  );
}
