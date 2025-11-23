import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const mockGet = jest.fn();
const mockRegister = jest.fn();

jest.mock('../../../services/trip.service', () => ({
  vehicleService: {
    getMyVehicles: () => mockGet(),
    registerVehicle: (...args: any[]) => mockRegister(...args),
  },
}));

import VehiclesPage from '../VehiclesPage';

describe('VehiclesPage', () => {
  beforeEach(() => jest.clearAllMocks());

  it('renders empty state and allows creating a vehicle', async () => {
    mockGet.mockResolvedValueOnce([]);
    const created = { id: 'v1', make: 'Nissan', model: 'Leaf', year: 2021, batteryCapacity: 40, registrationNumber: 'ABC123', createdAt: new Date().toISOString() };
    mockRegister.mockResolvedValueOnce(created);

    render(<VehiclesPage />);

    // Wait for UI to show empty state
    expect(await screen.findByText(/Bạn chưa có phương tiện nào/i)).toBeTruthy();

    // Open dialog
    await userEvent.click(screen.getByRole('button', { name: /Register Vehicle/i }));

    await userEvent.type(screen.getByLabelText(/Make/i), 'Nissan');
    await userEvent.type(screen.getByLabelText(/Model/i), 'Leaf');
    await userEvent.type(screen.getByLabelText(/Year/i), '2021');
    await userEvent.type(screen.getByLabelText(/Battery kWh/i), '40');
    await userEvent.type(screen.getByLabelText(/License plate/i), 'ABC123');

    await userEvent.click(screen.getByRole('button', { name: /Create Vehicle/i }));

    expect(mockRegister).toHaveBeenCalledTimes(1);
    const calledWith = mockRegister.mock.calls[0][0];
    // service normalization happens in vehicleService; ensure fields were sent
    expect(calledWith).toBeTruthy();
  });

  it('shows friendly validation when server returns 409 duplicate license', async () => {
    mockGet.mockResolvedValueOnce([]);
    const conflictError: any = new Error('License plate already registered');
    conflictError.status = 409;
    mockRegister.mockRejectedValueOnce(conflictError);

    // spy on alert so we can ensure it's not used for validation errors
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

    render(<VehiclesPage />);

    expect(await screen.findByText(/Bạn chưa có phương tiện nào/i)).toBeTruthy();

    await userEvent.click(screen.getByRole('button', { name: /Register Vehicle/i }));
    await userEvent.type(screen.getByLabelText(/Make/i), 'Nissan');
    await userEvent.type(screen.getByLabelText(/Model/i), 'Leaf');
    await userEvent.type(screen.getByLabelText(/Year/i), '2021');
    await userEvent.type(screen.getByLabelText(/Battery kWh/i), '40');
    await userEvent.type(screen.getByLabelText(/License plate/i), 'ABC123');

    await userEvent.click(screen.getByRole('button', { name: /Create Vehicle/i }));

    // expect registerVehicle was called
    expect(mockRegister).toHaveBeenCalledTimes(1);

    // after the rejection, the form should show the registration error
    expect(await screen.findByText(/License plate already registered/i)).toBeTruthy();
    // ensure we did not fallback to a generic alert for validation error
    expect(alertSpy).not.toHaveBeenCalled();

    alertSpy.mockRestore();
  });
});
