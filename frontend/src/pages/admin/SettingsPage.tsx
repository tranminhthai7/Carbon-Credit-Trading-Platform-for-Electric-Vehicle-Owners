import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Alert,
  Snackbar,
} from '@mui/material';
import { Save, Refresh, MonetizationOn, VerifiedUser, NotificationsActive } from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsService, SystemSettings } from '../../services/settings.service';

export const SettingsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [carbonPricing, setCarbonPricing] = useState<SystemSettings['carbonCreditPricing']>({
    basePrice: 10.00,
    commissionRate: 5,
  });
  const [verificationSettings, setVerificationSettings] = useState<SystemSettings['verificationSettings']>({
    autoApproveVerifiedTrips: true,
    minTripDistance: 5,
    verificationTimeoutDays: 7,
  });
  const [notificationSettings, setNotificationSettings] = useState<SystemSettings['notificationSettings']>({
    emailEnabled: true,
    pushEnabled: true,
    smsEnabled: false,
  });
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  // Track which section is currently saving so only that Save button shows loading
  const [activeSaving, setActiveSaving] = useState<null | 'carbon' | 'verification' | 'notification'>(null);
  // Explicit local flags to make button loading UI deterministic (defensive)
  const [isSavingCarbon, setIsSavingCarbon] = useState(false);
  const [isSavingVerification, setIsSavingVerification] = useState(false);
  const [isSavingNotification, setIsSavingNotification] = useState(false);
  // Track whether a section has unsaved changes (dirty) so saves for other sections don't overwrite them
  const [isDirtyCarbon, setIsDirtyCarbon] = useState(false);
  const [isDirtyVerification, setIsDirtyVerification] = useState(false);
  const [isDirtyNotification, setIsDirtyNotification] = useState(false);

  // Fetch settings
  const { data: fetchedSettings, isLoading, error } = useQuery({
    queryKey: ['settings'],
    queryFn: settingsService.getSettings,
  });

  // Update carbon pricing mutation
  const updateCarbonPricingMutation = useMutation({
    mutationKey: ['settings', 'updateCarbonPricing'],
    mutationFn: (carbonPricing: SystemSettings['carbonCreditPricing']) =>
      settingsService.updateSettings({ carbonCreditPricing: carbonPricing }),
    onMutate: () => {
      setActiveSaving('carbon');
      setIsSavingCarbon(true);
      console.debug('[Settings] saving carbon pricing...');
    },
    onSuccess: (updatedSettings) => {
      setCarbonPricing(updatedSettings.carbonCreditPricing);
      setIsDirtyCarbon(false);
      setSnackbar({
        open: true,
        message: 'Carbon pricing settings saved successfully!',
        severity: 'success',
      });
    },
    onSettled: () => {
      setActiveSaving(null);
      setIsSavingCarbon(false);
      console.debug('[Settings] carbon pricing saved/settled');
    },
    onError: (error) => {
      console.error('Failed to save carbon pricing settings:', error);
      setSnackbar({
        open: true,
        message: 'Failed to save carbon pricing settings. Please try again.',
        severity: 'error',
      });
    },
  });

  // Update verification settings mutation
  const updateVerificationMutation = useMutation({
    mutationKey: ['settings', 'updateVerification'],
    mutationFn: (verificationSettings: SystemSettings['verificationSettings']) =>
      settingsService.updateSettings({ verificationSettings }),
    onMutate: () => {
      setActiveSaving('verification');
      setIsSavingVerification(true);
      console.debug('[Settings] saving verification settings...');
    },
    onSuccess: (updatedSettings) => {
      setVerificationSettings(updatedSettings.verificationSettings);
      setIsDirtyVerification(false);
      setSnackbar({
        open: true,
        message: 'Verification settings saved successfully!',
        severity: 'success',
      });
    },
    onSettled: () => {
      setActiveSaving(null);
      setIsSavingVerification(false);
      console.debug('[Settings] verification settings saved/settled');
    },
    onError: (error) => {
      console.error('Failed to save verification settings:', error);
      setSnackbar({
        open: true,
        message: 'Failed to save verification settings. Please try again.',
        severity: 'error',
      });
    },
  });

  // Update notification settings mutation
  const updateNotificationMutation = useMutation({
    mutationKey: ['settings', 'updateNotification'],
    mutationFn: (notificationSettings: SystemSettings['notificationSettings']) =>
      settingsService.updateSettings({ notificationSettings }),
    onMutate: () => {
      setActiveSaving('notification');
      setIsSavingNotification(true);
      console.debug('[Settings] saving notification settings...');
    },
    onSuccess: (updatedSettings) => {
      setNotificationSettings(updatedSettings.notificationSettings);
      setIsDirtyNotification(false);
      setSnackbar({
        open: true,
        message: 'Notification settings saved successfully!',
        severity: 'success',
      });
    },
    onSettled: () => {
      setActiveSaving(null);
      setIsSavingNotification(false);
      console.debug('[Settings] notification settings saved/settled');
    },
    onError: (error) => {
      console.error('Failed to save notification settings:', error);
      setSnackbar({
        open: true,
        message: 'Failed to save notification settings. Please try again.',
        severity: 'error',
      });
    },
  });

  // Update local state when data is fetched
  useEffect(() => {
    if (fetchedSettings) {
      // Only update local values from server when the user doesn't have unsaved edits
      if (!isDirtyCarbon) setCarbonPricing(fetchedSettings.carbonCreditPricing);
      if (!isDirtyVerification) setVerificationSettings(fetchedSettings.verificationSettings);
      if (!isDirtyNotification) setNotificationSettings(fetchedSettings.notificationSettings);
    }
  }, [fetchedSettings]);

  const handleSaveCarbonPricing = () => {
    // protect against overwriting unsaved edits in other sections
    if (isDirtyVerification || isDirtyNotification) {
      const ok = window.confirm('You have unsaved changes in another section. Saving Carbon Pricing now may overwrite those edits. Continue?');
      if (!ok) return;
    }
    updateCarbonPricingMutation.mutate(carbonPricing);
  };

  const handleSaveVerificationSettings = () => {
    if (isDirtyCarbon || isDirtyNotification) {
      const ok = window.confirm('You have unsaved changes in another section. Saving Verification Settings now may overwrite those edits. Continue?');
      if (!ok) return;
    }
    updateVerificationMutation.mutate(verificationSettings);
  };

  const handleSaveNotificationSettings = () => {
    if (isDirtyCarbon || isDirtyVerification) {
      const ok = window.confirm('You have unsaved changes in another section. Saving Notification Settings now may overwrite those edits. Continue?');
      if (!ok) return;
    }
    updateNotificationMutation.mutate(notificationSettings);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (isLoading) {
    return (
      <Box>
        <Typography>Loading settings...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Alert severity="error">
          Failed to load settings. Please refresh the page.
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        System Settings
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Configure platform settings and parameters
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Carbon Credit Pricing
              </Typography>
              <TextField
                fullWidth
                label="Base Price per kg CO₂"
                type="number"
                value={carbonPricing.basePrice}
                onChange={(e) => {
                  setCarbonPricing({
                    ...carbonPricing,
                    basePrice: parseFloat(e.target.value) || 0,
                  });
                  setIsDirtyCarbon(true);
                }}
                margin="normal"
                inputProps={{ min: 0, step: 0.01 }}
              />
              <TextField
                fullWidth
                label="Commission Rate (%)"
                type="number"
                value={carbonPricing.commissionRate}
                onChange={(e) => {
                  setCarbonPricing({
                    ...carbonPricing,
                    commissionRate: parseFloat(e.target.value) || 0,
                  });
                  setIsDirtyCarbon(true);
                }}
                margin="normal"
                inputProps={{ min: 0, max: 100, step: 0.1 }}
              />
              <Button
                variant="contained"
                startIcon={<MonetizationOn />}
                sx={{ mt: 2 }}
                onClick={handleSaveCarbonPricing}
                disabled={isSavingCarbon}
              >
                {isSavingCarbon ? 'Saving carbon pricing...' : 'Save carbon pricing'}
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Verification Settings
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={verificationSettings.autoApproveVerifiedTrips}
                    onChange={(e) => {
                      setVerificationSettings({
                        ...verificationSettings,
                        autoApproveVerifiedTrips: e.target.checked,
                      });
                      setIsDirtyVerification(true);
                    }}
                  />
                }
                label="Auto-approve verified trips"
              />
              <TextField
                fullWidth
                label="Min. Trip Distance (km)"
                type="number"
                value={verificationSettings.minTripDistance}
                onChange={(e) => {
                  setVerificationSettings({
                    ...verificationSettings,
                    minTripDistance: parseFloat(e.target.value) || 0,
                  });
                  setIsDirtyVerification(true);
                }}
                margin="normal"
                inputProps={{ min: 0, step: 0.1 }}
              />
              <TextField
                fullWidth
                label="Verification Timeout (days)"
                type="number"
                value={verificationSettings.verificationTimeoutDays}
                onChange={(e) => {
                  setVerificationSettings({
                    ...verificationSettings,
                    verificationTimeoutDays: parseInt(e.target.value) || 1,
                  });
                  setIsDirtyVerification(true);
                }}
                margin="normal"
                inputProps={{ min: 1, step: 1 }}
              />
              <Button
                variant="contained"
                startIcon={<VerifiedUser />}
                sx={{ mt: 2 }}
                onClick={handleSaveVerificationSettings}
                disabled={isSavingVerification}
              >
                {isSavingVerification ? 'Saving verification...' : 'Save verification settings'}
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Notification Settings
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={notificationSettings.emailEnabled}
                    onChange={(e) => {
                      setNotificationSettings({
                        ...notificationSettings,
                        emailEnabled: e.target.checked,
                      });
                      setIsDirtyNotification(true);
                    }}
                  />
                }
                label="Email notifications enabled"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={notificationSettings.pushEnabled}
                    onChange={(e) => {
                      setNotificationSettings({
                        ...notificationSettings,
                        pushEnabled: e.target.checked,
                      });
                      setIsDirtyNotification(true);
                    }}
                  />
                }
                label="Push notifications enabled"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={notificationSettings.smsEnabled}
                    onChange={(e) => {
                      setNotificationSettings({
                        ...notificationSettings,
                        smsEnabled: e.target.checked,
                      });
                      setIsDirtyNotification(true);
                    }}
                  />
                }
                label="SMS notifications enabled"
              />
              <Button
                variant="contained"
                startIcon={<NotificationsActive />}
                sx={{ mt: 2 }}
                onClick={handleSaveNotificationSettings}
                disabled={isSavingNotification}
              >
                {isSavingNotification ? 'Saving notifications...' : 'Save notification settings'}
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};
