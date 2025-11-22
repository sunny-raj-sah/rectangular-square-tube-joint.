import React from 'react'

export default function TubeSettingsPanel({ tube, updateTube, addTube }) {
  if (!tube) return null

  // Handle input change events for both simple and nested properties
  const onChange = (e) => {
    const { name, value } = e.target
    if (name.startsWith('position')) {
      const axis = name.slice(-1).toLowerCase()
      const idx = axis === 'x' ? 0 : axis === 'y' ? 1 : 2
      const newPos = [...tube.position]
      newPos[idx] = Number(value)
      updateTube(tube.id, { position: newPos })
    } else if (name.startsWith('rotation')) {
      const axis = name.slice(-1).toLowerCase()
      const idx = axis === 'x' ? 0 : axis === 'y' ? 1 : 2
      const newRot = [...tube.rotation]
      // Convert degrees input to radians
      newRot[idx] = (Number(value) * Math.PI) / 180
      updateTube(tube.id, { rotation: newRot })
    } else {
      // Simple property update
      updateTube(tube.id, { [name]: name === 'type' ? value : Number(value) })
    }
  }

  return (
    <div
      style={{
        width: 300,
        padding: 20,
        background: '#eee',
        fontSize: 14,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}
    >
      <h3>Tube Settings</h3>
      <label>
        Type:
        <select name="type" value={tube.type} onChange={onChange}>
          <option value="Square">Square</option>
          <option value="Rectangular">Rectangular</option>
        </select>
      </label>

      <label>
        Width:
        <input type="number" step="0.1" name="width" value={tube.width} onChange={onChange} />
      </label>

      <label>
        Height:
        <input type="number" step="0.1" name="height" value={tube.height} onChange={onChange} />
      </label>

      <label>
        Thickness:
        <input type="number" step="0.01" name="thickness" value={tube.thickness} onChange={onChange} />
      </label>

      <label>
        Length:
        <input type="number" step="0.1" name="length" value={tube.length} onChange={onChange} />
      </label>

      <label>
        Position X:
        <input type="number" step="0.1" name="positionX" value={tube.position[0]} onChange={onChange} />
      </label>

      <label>
        Position Y:
        <input type="number" step="0.1" name="positionY" value={tube.position[1]} onChange={onChange} />
      </label>

      <label>
        Position Z:
        <input type="number" step="0.1" name="positionZ" value={tube.position[2]} onChange={onChange} />
      </label>

      <label>
        Rotation X (degrees):
        <input
          type="number"
          step="1"
          name="rotationX"
          value={((tube.rotation[0] * 180) / Math.PI).toFixed(1)}
          onChange={onChange}
        />
      </label>

      <label>
        Rotation Y (degrees):
        <input
          type="number"
          step="1"
          name="rotationY"
          value={((tube.rotation[1] * 180) / Math.PI).toFixed(1)}
          onChange={onChange}
        />
      </label>

      <label>
        Rotation Z (degrees):
        <input
          type="number"
          step="1"
          name="rotationZ"
          value={((tube.rotation[2] * 180) / Math.PI).toFixed(1)}
          onChange={onChange}
        />
      </label>

      <button onClick={addTube} style={{ marginTop: 20 }}>
        Add Tube
      </button>
    </div>
  )
}
