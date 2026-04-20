const express = require('express');
const router = express.Router();
const Device = require('../models/Device');
const { protect } = require('../middleware/authMiddleware');

// @route  GET /api/devices
// @desc   Get all devices
// @access Protected
router.get('/', async (req, res) => {
  try {
    const devices = await Device.find().sort({ type: 1, name: 1 });
    res.json({
      devices,
      timestamp: new Date()
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route  POST /api/devices
// @desc   Create a new dummy device
// @access Protected
router.post('/', async (req, res) => {
  try {
    const { name, type, powerConsumption, isOn } = req.body;
    const newDevice = new Device({
      name,
      type,
      powerConsumption: powerConsumption || 0,
      isOn: isOn || false
    });
    const savedDevice = await newDevice.save();
    res.status(201).json(savedDevice);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route  POST /api/devices/:id/update
// @desc   Update a device status
// @access Public
router.post('/:id/update', async (req, res) => {
  try {
    const { isOn } = req.body;
    const device = await Device.findById(req.params.id);
    
    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }

    if (isOn !== undefined) device.isOn = isOn;
    device.lastUpdated = new Date();
    await device.save();

    res.json(device);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route  POST /api/devices/power/update
// @desc   Update power consumption for a device (IoT endpoint)
// @access Protected
router.post('/power/update', async (req, res) => {
  try {
    const { deviceId, powerConsumption } = req.body;

    const device = await Device.findByIdAndUpdate(
      deviceId,
      { powerConsumption, lastUpdated: new Date() },
      { new: true }
    );

    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }

    res.json(device);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route  POST /api/devices/bulk-update
// @desc   Update all devices (toggle state and/or power consumption)
// @access Public
router.post('/bulk-update', async (req, res) => {
  try {
    const { isOn, powerConsumption } = req.body;
    const updateData = { lastUpdated: new Date() };
    
    if (isOn !== undefined) updateData.isOn = isOn;
    if (powerConsumption !== undefined) updateData.powerConsumption = powerConsumption;

    await Device.updateMany({}, updateData);
    
    // Return the updated list
    const devices = await Device.find().sort({ type: 1, name: 1 });
    res.json({
      devices,
      timestamp: new Date()
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route  GET /api/devices/power/total
// @desc   Get total power consumption of all ON devices
// @access Protected
router.get('/power/total', async (req, res) => {
  try {
    const devices = await Device.find({ isOn: true });
    const total = devices.reduce((sum, d) => sum + d.powerConsumption, 0);
    res.json({ total, devices });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
