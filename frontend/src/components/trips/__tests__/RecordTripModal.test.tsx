import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock tripService before importing the component
const mockCreate = jest.fn();
jest.mock('../../../services/trip.service', () => ({
  tripService: {
    createTrip: (...args: any[]) => mockCreate(...args),
  },
}));

import RecordTripModal from '../RecordTripModal';

describe('RecordTripModal', () => {
  beforeEach(() => jest.clearAllMocks());

  it('renders and calls createTrip with normalized payload', async () => {
    mockCreate.mockResolvedValue({ id: 'created' });
    const onCreated = jest.fn();
    render(<RecordTripModal open={true} onClose={() => {}} onCreated={onCreated} />);

    // fill form
    await userEvent.type(screen.getByLabelText(/Distance/i), '12.5');
    await userEvent.type(screen.getByLabelText(/Energy Consumed/i), '5.1');
    // provide times using datetime-local format
    const start = '2000-11-11T04:11';
    const end = '2000-11-11T05:11';
    await userEvent.type(screen.getByLabelText(/Start Time/i), start);
    await userEvent.type(screen.getByLabelText(/End Time/i), end);

    await userEvent.click(screen.getByRole('button', { name: /Record Trip/i }));

    expect(mockCreate).toHaveBeenCalledTimes(1);
    const calledWith = mockCreate.mock.calls[0][0];
    expect(calledWith.distance).toBeCloseTo(12.5);
    expect(calledWith.energyConsumed).toBeCloseTo(5.1);
    // start/end passed in as ISO-compatible strings when sent via tripService
    expect(calledWith.startTime).toBeDefined();
    expect(calledWith.endTime).toBeDefined();
  });

  it('shows server validation errors when createTrip fails with 400', async () => {
    mockCreate.mockRejectedValueOnce({
      response: {
        data: {
          message: 'Validation failed',
          errors: [{ field: 'distance_km', message: 'Distance must be at least 0.1 km' }],
        },
      },
    });

    render(<RecordTripModal open={true} onClose={() => {}} onCreated={jest.fn()} />);
    await userEvent.type(screen.getByLabelText(/Distance/i), '0.05');
    await userEvent.type(screen.getByLabelText(/Start Time/i), '2000-11-11T04:11');
    await userEvent.type(screen.getByLabelText(/End Time/i), '2000-11-11T05:11');

    await userEvent.click(screen.getByRole('button', { name: /Record Trip/i }));

    // The form should display the server validation message
    const errEl = await screen.findByText(/distance_km: Distance must be at least 0.1 km/);
    expect(errEl).toBeTruthy();
  });
});
