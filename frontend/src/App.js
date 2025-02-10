import React, { useState } from 'react';

const App = () => {
    const [formData, setFormData] = useState({
        origin: '',
        destination: '',
        weight: '',
        freightClass: ''
    });

    const [result, setResult] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('http://localhost:5000/api/freight/calculate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        const data = await response.json();
        setResult(data);
    };

    return (
        <div style={{ padding: '20px', maxWidth: '500px', margin: 'auto', textAlign: 'center' }}>
            <h1>Freight Cost Calculator</h1>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input type="text" name="origin" placeholder="Origin" onChange={handleChange} required />
                <input type="text" name="destination" placeholder="Destination" onChange={handleChange} required />
                <input type="number" name="weight" placeholder="Weight (lbs)" onChange={handleChange} required />
                <input type="text" name="freightClass" placeholder="Freight Class" onChange={handleChange} required />
                <button type="submit">Calculate</button>
            </form>

            {result && (
                <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc' }}>
                    <h2>Results:</h2>
                    <p><strong>Distance:</strong> {result.distance} miles</p>
                    <p><strong>Fuel Price:</strong> ${result.fuel_price}</p>
                    <p><strong>Base Rate Per Mile:</strong> ${result.base_rate_per_mile}</p>
                    <p><strong>Fuel Surcharge:</strong> ${result.fuel_surcharge}</p>
                    <p><strong>Total Freight Cost:</strong> ${result.total_freight_cost}</p>
                </div>
            )}
        </div>
    );
};

export default App;
