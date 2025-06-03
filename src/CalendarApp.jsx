import { BrowserRouter } from "react-router"
import AppRouter from "./router/AppRouter"



export const CalendarApp = () => {
  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  )
}
