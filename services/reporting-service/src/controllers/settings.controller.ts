import { Request, Response } from "express";

interface SystemSettings {
  carbonCreditPricing: {
    basePrice: number;
    commissionRate: number;
  };
  verificationSettings: {
    autoApproveVerifiedTrips: boolean;
    minTripDistance: number;
    verificationTimeoutDays: number;
  };
  notificationSettings: {
    emailEnabled: boolean;
    pushEnabled: boolean;
    smsEnabled: boolean;
  };
}

// In-memory storage for demo purposes - in production, this would be stored in database
let systemSettings: SystemSettings = {
  carbonCreditPricing: {
    basePrice: 10.00,
    commissionRate: 5,
  },
  verificationSettings: {
    autoApproveVerifiedTrips: true,
    minTripDistance: 5,
    verificationTimeoutDays: 7,
  },
  notificationSettings: {
    emailEnabled: true,
    pushEnabled: true,
    smsEnabled: false,
  },
};

// GET /settings
export const getSystemSettings = async (req: Request, res: Response) => {
  try {
    res.json(systemSettings);
  } catch (error) {
    console.error('Error getting system settings:', error);
    res.status(500).json({ error: 'Failed to get system settings' });
  }
};

// PUT /settings
export const updateSystemSettings = async (req: Request, res: Response) => {
  try {
    const newSettings = req.body as Partial<SystemSettings>;

    // Validate the input
    if (newSettings.carbonCreditPricing) {
      if (typeof newSettings.carbonCreditPricing.basePrice !== 'number' ||
          newSettings.carbonCreditPricing.basePrice < 0) {
        return res.status(400).json({ error: 'Invalid base price' });
      }
      if (typeof newSettings.carbonCreditPricing.commissionRate !== 'number' ||
          newSettings.carbonCreditPricing.commissionRate < 0 ||
          newSettings.carbonCreditPricing.commissionRate > 100) {
        return res.status(400).json({ error: 'Invalid commission rate' });
      }
    }

    if (newSettings.verificationSettings) {
      if (typeof newSettings.verificationSettings.minTripDistance !== 'number' ||
          newSettings.verificationSettings.minTripDistance < 0) {
        return res.status(400).json({ error: 'Invalid minimum trip distance' });
      }
      if (typeof newSettings.verificationSettings.verificationTimeoutDays !== 'number' ||
          newSettings.verificationSettings.verificationTimeoutDays < 1) {
        return res.status(400).json({ error: 'Invalid verification timeout' });
      }
    }

    // Update settings
    systemSettings = {
      ...systemSettings,
      ...newSettings,
      carbonCreditPricing: {
        ...systemSettings.carbonCreditPricing,
        ...newSettings.carbonCreditPricing,
      },
      verificationSettings: {
        ...systemSettings.verificationSettings,
        ...newSettings.verificationSettings,
      },
      notificationSettings: {
        ...systemSettings.notificationSettings,
        ...newSettings.notificationSettings,
      },
    };

    res.json(systemSettings);
  } catch (error) {
    console.error('Error updating system settings:', error);
    res.status(500).json({ error: 'Failed to update system settings' });
  }
};