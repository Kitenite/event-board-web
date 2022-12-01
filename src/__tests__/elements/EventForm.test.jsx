import React from 'react';
import { act, render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import EventForm from 'components/elements/EventForm';

describe('Event Form', () => {
  it('validates required fields', async () => {
    render(
      <MemoryRouter>
        <EventForm />
      </MemoryRouter>
    );
    
    expect(screen.getByText(/Review/i)).toBeInTheDocument();
    expect(screen.getByText(/Clear Form/i)).toBeInTheDocument();

    await act(() => {
      fireEvent.click(screen.getByText('Review'))
    });

    expect(screen.getAllByText(/Field is required/i)[0]).toBeInTheDocument();
  });

  it('submits valid event', async () => {
    const mockHandleFormSubmit = jest.fn();
    
    render(
      <MemoryRouter>
        <EventForm handleFormSubmit={mockHandleFormSubmit}/>
      </MemoryRouter>
    );

    const eventNameInput = screen.getByLabelText(/Event Name/i);
    const eventDescriptionInput = screen.getByLabelText(/Event Description/i);
    expect(eventNameInput).toBeInTheDocument();

    await act(() => {
      fireEvent.change(eventNameInput, { target: { value: 'Example name' } });
      fireEvent.change(eventDescriptionInput, { target: { value: 'Example description' } });
      fireEvent.click(screen.getByText('Review'));
    });

    expect(mockHandleFormSubmit).toHaveBeenCalled();

    const formSubmitArgs = mockHandleFormSubmit.mock.calls[0][0];

    expect(formSubmitArgs['eventName']).toBe('Example name');
    expect(formSubmitArgs['description']).toBe('Example description');
  });
});
