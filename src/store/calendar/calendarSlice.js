
import { createSlice } from '@reduxjs/toolkit';
import { addHours } from 'date-fns';

const tempEvent = {
    _id: new Date().getTime(),
  title: 'Cumpleaños Laura',
  notes: 'Recordar comprar la tarta',
  start: new Date(),
  end: addHours( new Date(), 2 ),
  bgcolor: '#fafafa',
  user: {
    _id: '123',
    name: 'Pol'
  }};


export const calendarSlice = createSlice({
    name: 'ui',
    initialState: {
        events: [
            tempEvent
        ],
        activeEvent: null

    },
    reducers: {
        onSetActiveEvent: ( state, { payload }) => {
            state.activeEvent = payload;
        },
        onAddNewEvent: ( state, { payload }) => {
            state.events.push( payload );
            state.activeEvent = null;
        },
        onUpdateEvent: ( state, { payload }) => {
            state.events = state.events.map( event => {
                if ( event._id === payload._id ) {
                    return payload;
                }

                return event;
        });
    },
    onDeleteEvent: ( state ) => {
        if (state.activeEvent ) {

            state.events = state.events.filter( event => event._id !== state.activeEvent._id );
            state.activeEvent = null;

        }
        

    }
    }
});

export const { onSetActiveEvent, onAddNewEvent, onUpdateEvent, onDeleteEvent } = calendarSlice.actions;