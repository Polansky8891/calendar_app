import { useDispatch, useSelector } from "react-redux"
import { onAddNewEvent, onDeleteEvent, onLoadEvents, onSetActiveEvent, onUpdateEvent } from "../store/calendar/calendarSlice";
import calendarApi from "../api/calendarApi";
import { converttEventsToDateEvents } from "../helpers/converttEventsToDateEvents";



export const useCalendarStore = () => {

    const dispatch = useDispatch();
    const { events, activeEvent } = useSelector( state => state.calendar );
    const { user } = useSelector( state => state.auth );

    const setActiveEvent = ( calendarEvent ) => {
        dispatch( onSetActiveEvent( calendarEvent ) );

    }

    const startSavingEvent = async( calendarEvent ) => {
        // TODO: llegar al backend



        // Todo: update event
        if( calendarEvent._id ) {
            //actualizando
            dispatch( onUpdateEvent( calendarEvent ));
        } else {
            // creando
            const { data } = await calendarApi.post('/events', calendarEvent);


            dispatch( onAddNewEvent({ ...calendarEvent, _id: data.evento.id, user } ) );
        }
    }

    const startDeletingEvent = () => {
        dispatch( onDeleteEvent() );
    }

    const startLoadingEvents = async () => {
        try {
            const { data } = await calendarApi.get('/events');
            const events = converttEventsToDateEvents( data.eventos );
            dispatch( onLoadEvents( events ));
            console.log( events );
            
        } catch (error) {
            
        }
    }

  
    return {
        //* Propiedades
        activeEvent,
        events,
        hasEventSelected: !!activeEvent,

        //*Métodos
        startDeletingEvent,
        setActiveEvent,
        startSavingEvent,
        startLoadingEvents,
        


    }
}
