// src/components/map/Sidebar.jsx
import PropTypes from 'prop-types';

function Sidebar({
  mode,
  markers,
  highlightedLocation,
  selectedMarker,
  markerForm,
  setMarkerForm,
  updateMarker,
  deleteMarker,
  setSelectedMarker,
}) {
  return (
    <div
      className='lg:w-1/4 p-4 bg-gray-50 overflow-y-auto'
      style={{ height: mode === 'edit' && selectedMarker ? '600px' : 'auto' }}
    >
      <h3 className='font-bold text-lg mb-3'>Map Information</h3>

      {/* Show highlighted location if exists */}
      {highlightedLocation && (
        <div className='mb-4 p-3 bg-red-50 border border-red-200 rounded-md'>
          <h4 className='font-bold text-red-600'>Searched Location</h4>
          <p className='text-sm mt-1'>{highlightedLocation.name}</p>
          <p className='text-xs text-gray-600 mt-1'>
            {highlightedLocation.position[0].toFixed(6)},{' '}
            {highlightedLocation.position[1].toFixed(6)}
          </p>
        </div>
      )}

      {mode === 'view' ? (
        <ViewModeSidebar markers={markers} />
      ) : (
        <EditModeSidebar
          selectedMarker={selectedMarker}
          markerForm={markerForm}
          setMarkerForm={setMarkerForm}
          updateMarker={updateMarker}
          deleteMarker={deleteMarker}
          setSelectedMarker={setSelectedMarker}
        />
      )}
    </div>
  );
}

function ViewModeSidebar() {
  return <></>;
}

function EditModeSidebar({
  selectedMarker,
  markerForm,
  setMarkerForm,
  updateMarker,
  deleteMarker,
  setSelectedMarker,
}) {
  return (
    <div>
      <p className='mb-2'>Click on the map to add markers.</p>
      <p className='mb-4 text-sm text-gray-600'>
        Click on existing markers to edit them.
      </p>

      {selectedMarker ? (
        <div className='bg-white p-3 rounded shadow border border-gray-200'>
          <h4 className='font-bold mb-2'>Edit Marker</h4>
          <div className='mb-3'>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Name
            </label>
            <input
              type='text'
              value={markerForm.name}
              onChange={e =>
                setMarkerForm(prev => ({ ...prev, name: e.target.value }))
              }
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>

          <div className='mb-3'>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Type
            </label>
            <select
              value={markerForm.type}
              onChange={e =>
                setMarkerForm(prev => ({ ...prev, type: e.target.value }))
              }
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            >
              <option value='poi'>Point of Interest</option>
              <option value='park'>Park</option>
              <option value='building'>Building</option>
              <option value='restaurant'>Restaurant</option>
            </select>
          </div>

          <div className='flex space-x-2 mt-4'>
            <button
              onClick={updateMarker}
              className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
            >
              Save
            </button>
            <button
              onClick={deleteMarker}
              className='px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600'
            >
              Delete
            </button>
            <button
              onClick={() => setSelectedMarker(null)}
              className='px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400'
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <p className='italic text-gray-500'>No marker selected</p>
      )}
    </div>
  );
}

Sidebar.propTypes = {
  mode: PropTypes.string.isRequired,
  markers: PropTypes.array.isRequired,
  highlightedLocation: PropTypes.object,
  selectedMarker: PropTypes.object,
  markerForm: PropTypes.object.isRequired,
  setMarkerForm: PropTypes.func.isRequired,
  updateMarker: PropTypes.func.isRequired,
  deleteMarker: PropTypes.func.isRequired,
  setSelectedMarker: PropTypes.func.isRequired,
};

ViewModeSidebar.propTypes = {
  markers: PropTypes.array.isRequired,
};

EditModeSidebar.propTypes = {
  selectedMarker: PropTypes.object,
  markerForm: PropTypes.object.isRequired,
  setMarkerForm: PropTypes.func.isRequired,
  updateMarker: PropTypes.func.isRequired,
  deleteMarker: PropTypes.func.isRequired,
  setSelectedMarker: PropTypes.func.isRequired,
};

export default Sidebar;
