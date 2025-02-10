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
        <div>
            <h1>Freight Cost Calculator</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" name="origin" placeholder="Origin" onChange={handleChange} />
                <input type="text" name="destination" placeholder="Destination" onChange={handleChange} />
                <input type="number" name="weight" placeholder="Weight (lbs)" onChange={handleChange} />
                <input type="text" name="freightClass" placeholder="Freight Class" onChange={handleChange} />
                <button type="submit">Calculate</button>
            </form>

            {result && (
                <div>
                    <h2>Results:</h2>
                    <p>Distance: {result.distance} miles</p>
                    <p>Fuel Price: ${result.fuel_price}</p>
                    <p>Base Rate Per Mile: ${result.base_rate_per_mile}</p>
                    <p>Fuel Surcharge: ${result.fuel_surcharge}</p>
                    <p>Total Freight Cost: ${result.total_freight_cost}</p>
                </div>
            )}
        </div>
    );
};

export default App;