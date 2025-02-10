const express = require('express');
const router = express.Router();
const axios = require('axios');

const GOOGLE_MAPS_API = process.env.GOOGLE_MAPS_API;
const FUEL_PRICE_API = process.env.FUEL_PRICE_API;
const FREIGHT_API = process.env.FREIGHT_API;

router.post('/calculate', async (req, res) => {
    const { origin, destination, weight, freightClass } = req.body;

    if (!origin || !destination || !weight || !freightClass) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const distanceResponse = await axios.get(`https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${destination}&key=${GOOGLE_MAPS_API}`);
        const distanceMiles = distanceResponse.data.rows[0].elements[0].distance.value / 1609.34;

        const fuelResponse = await axios.get(`https://api.globalpetrolprices.com/fuel_prices?api_key=${FUEL_PRICE_API}`);
        const fuelPrice = fuelResponse.data.prices.USA.gasoline;

        const freightResponse = await axios.post(FREIGHT_API, { weight, freight_class: freightClass });
        const baseRate = freightResponse.data.estimated_rate;

        const fuelSurcharge = baseRate * 0.12 * fuelPrice;
        const totalCost = (baseRate + fuelSurcharge) * distanceMiles;

        res.json({
            distance: distanceMiles.toFixed(2),
            fuel_price: fuelPrice.toFixed(2),
            base_rate_per_mile: baseRate.toFixed(2),
            fuel_surcharge: fuelSurcharge.toFixed(2),
            total_freight_cost: totalCost.toFixed(2)
        });

    } catch (error) {
        res.status(500).json({ error: 'Error fetching freight cost data' });
    }
});

module.exports = router;