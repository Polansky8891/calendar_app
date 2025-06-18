import { useDispatch, useSelector } from "react-redux"
import { onAddNewEvent, onDeleteEvent, onLoadEvents, onSetActiveEvent, onUpdateEvent } from "../store/calendar/calendarSlice";
import calendarApi from "../api/calendarApi";
import { converttEventsToDateEvents } from "../helpers/converttEventsToDateEvents";
import Swal from "sweetalert2";



export const useCalendarStore = () => {

    const dispatch = useDispatch();
    const { events, activeEvent } = useSelector( state => state.calendar );
    const { user } = useSelector( state => state.auth );

    const setActiveEvent = ( calendarEvent ) => {
        dispatch( onSetActiveEvent( calendarEvent ) );

    }

    const startSavingEvent = async( calendarEvent ) => {


        try {

            // Todo: update event
        if( calendarEvent.id ) {
            
             await calendarApi.put(`/events/${ calendarEvent.id }`, calendarEvent );
            dispatch( onUpdateEvent( calendarEvent, user ));
            return;
        } 
            // creando
            const { data } = await calendarApi.post('/events', calendarEvent);
            dispatch( onAddNewEvent({ ...calendarEvent, id: data.evento.id, user } ) );
            
        } catch (error) {
            Swal.fire('Error al guardar', error.response.data.msg, 'error');
            
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
