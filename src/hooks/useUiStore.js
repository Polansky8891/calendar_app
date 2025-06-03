import { useDispatch, useSelector } from "react-redux"
import { onCloseDateModal, onOpenDateModal } from "../store/ui/uiSlice";


export const useUiStore = () => {

    const dispatch = useDispatch();

   const {
        isDateModalOpen
   } = useSelector( state => state.ui );

   const OpenDateModal = () => {
    dispatch( onOpenDateModal() );

   }

   const closeDateModal = () => {
        dispatch( onCloseDateModal() )

   }

   const toggleDateModal = () => {
        (isDateModalOpen)
            ? OpenDateModal()
            : closeDateModal();
   }



   return {

    isDateModalOpen,

    OpenDateModal,
    closeDateModal,
    toggleDateModal

   }
}