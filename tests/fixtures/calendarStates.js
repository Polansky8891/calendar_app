

export const events = [

    {
      id: 1,
      title: 'Mi cumpleaños',
      notes: 'Tengo que comprar una tarta',
      start: new Date('2025-06-18 15:00:00'),
      end: new Date('2025-06-18 17:00:00'),
    },
    {
      id: 2,
      title: 'Tu cumpleaños',
      notes: 'Tengo que comprar aquella tarta tan bestia',
      start: new Date('2025-06-20 15:00:00'),
      end: new Date('2025-06-20 17:00:00'),
    },
];

export const initialState = {
    isLoadingEvents: true,
    events: [],
    activeEvent: null
}

export const calendarWithEventsState = {
    isLoadingEvents: false,
    events: [ ...events],
    activeEvent: null
}

export const calendarWithActiveEventState = {
    isLoadingEvents: false,
    events: [ ...events],
    activeEvent: { ...events[0] }
}

