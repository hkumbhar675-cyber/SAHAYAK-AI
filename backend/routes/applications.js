const express = require('express');
const router = express.Router();
const { store } = require('../db/db');

// GET /api/applications - list all applications
router.get('/', (req, res) => {
  try {
    const { user_id } = req.query;
    let apps = [...store.applications];
    if (user_id) {
      apps = apps.filter(a => a.user_id === Number(user_id));
    }

    // Enrich with scheme and partner details
    const enriched = apps.map(app => {
      const scheme = store.schemes.find(s => s.id === app.scheme_id);
      const partner = store.partners.find(p => p.id === app.partner_id);
      return {
        ...app,
        scheme_name: scheme ? scheme.name : 'Government Scheme',
        scheme_category: scheme ? scheme.category : '',
        partner_name: partner ? partner.name : 'Channel Partner',
        partner_address: partner ? partner.address : ''
      };
    });

    // Sort newest first
    enriched.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    res.json({
      success: true,
      count: enriched.length,
      applications: enriched
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/applications/:id - get application details
router.get('/:id', (req, res) => {
  try {
    const id = Number(req.params.id);
    const app = store.applications.find(a => a.id === id);
    if (!app) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    const scheme = store.schemes.find(s => s.id === app.scheme_id);
    const partner = store.partners.find(p => p.id === app.partner_id);

    res.json({
      success: true,
      application: {
        ...app,
        scheme,
        partner
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/applications - create application
router.post('/', (req, res) => {
  try {
    const {
      user_id = 1,
      scheme_id,
      partner_id,
      applicant_name,
      applicant_phone,
      applicant_district = 'Pune',
      applicant_occupation = 'Farmer',
      requested_amount = 100000,
      subsidy_amount = 0,
      tenure_months = 36,
      interest_rate = 7.5,
      monthly_emi = 0,
      remarks = ''
    } = req.body;

    if (!scheme_id || !partner_id || !applicant_name) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: scheme_id, partner_id, applicant_name'
      });
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const application_no = `SHK-2026-${randomSuffix}`;
    const now = new Date().toISOString();

    const newApp = {
      id: store.applications.length + 1,
      application_no,
      user_id: Number(user_id),
      scheme_id: Number(scheme_id),
      partner_id: Number(partner_id),
      applicant_name,
      applicant_phone: applicant_phone || '+91 98220 00000',
      applicant_district,
      applicant_occupation,
      requested_amount: Number(requested_amount),
      subsidy_amount: Number(subsidy_amount),
      tenure_months: Number(tenure_months),
      interest_rate: Number(interest_rate),
      monthly_emi: Number(monthly_emi),
      status: 'Submitted',
      remarks,
      created_at: now,
      updated_at: now,
      timeline: [
        {
          status: 'Submitted',
          notes: 'Application successfully registered on SAHAYAK AI portal and routed to selected channel partner.',
          changed_at: now
        }
      ]
    };

    store.applications.unshift(newApp);

    const scheme = store.schemes.find(s => s.id === Number(scheme_id));
    const partner = store.partners.find(p => p.id === Number(partner_id));

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully!',
      application: {
        ...newApp,
        scheme_name: scheme ? scheme.name : '',
        partner_name: partner ? partner.name : ''
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH /api/applications/:id/status - advance/update status for demo
router.patch('/:id/status', (req, res) => {
  try {
    const id = Number(req.params.id);
    const { status, notes } = req.body;
    const app = store.applications.find(a => a.id === id);

    if (!app) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    const validStatuses = ['Submitted', 'Under Review', 'Documents Required', 'Approved', 'Completed', 'Rejected'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    const now = new Date().toISOString();
    if (status) {
      app.status = status;
    }
    app.updated_at = now;

    if (!app.timeline) app.timeline = [];
    app.timeline.push({
      status: status || app.status,
      notes: notes || `Status updated to ${status || app.status}`,
      changed_at: now
    });

    res.json({
      success: true,
      message: `Status updated to ${app.status}`,
      application: app
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
