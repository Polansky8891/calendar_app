import { configureStore } from "@reduxjs/toolkit"
import { authSlice } from "../../src/store/auth/authSlice"
import { initialState, notAuthenticatedState } from "../fixtures/authStates"
import { renderHook, act, waitFor } from "@testing-library/react"
import { useAuthStore } from "../../src/hooks/useAuthStore"
import { Provider } from "react-redux"
import { testUserCredentials } from "../fixtures/testUser"
import calendarApi from "../../src/api/calendarApi"


const getMockStore = ( initialState ) => {
    return configureStore({
        reducer: {
            auth: authSlice.reducer,
        },
        preloadedState: {
            auth: { ...initialState }
        }
    })
}


describe('pruebas en useAuthStore', () => { 

    beforeEach(() => localStorage.clear() );

    test('debe de regresar los valores por defecto', () => { 

        const mockStore = getMockStore({ ...initialState });

        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });

        expect(result.current).toEqual({
            errorMessage: undefined,
            status: 'checking',
            user: {},
            checkAuthToken: expect.any(Function),
            startLogin: expect.any(Function),
            startLogout: expect.any(Function),
            startRegister: expect.any(Function),
        });
     });

     test('startLogin debe de realizar el login correctamente', async() => {
        
        const mockStore = getMockStore({ ...notAuthenticatedState });
        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });

        await act(async() => {
            await result.current.startLogin( testUserCredentials )
        })

        const { errorMessage, status, user } = result.current;
        expect({ errorMessage, status, user }).toEqual({
            errorMessage: undefined,
            status: 'authenticated',
            user: { name: 'Test user', uid: '6853b439994f0262c2236e4e' }
        });

        expect( localStorage.getItem('token') ).toEqual( expect.any(String) );
        expect( localStorage.getItem('token-init-date') ).toEqual( expect.any(String) );
        
    });

    test('startLogin debe de fallar la autenticación', async() => {
        const mockStore = getMockStore({ ...notAuthenticatedState });
        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });

        await act(async() => {
            await result.current.startLogin( {email: 'algo@google.com', password: '1241242' } )
        });

        const { errorMessage, status, user } = result.current;
        expect(localStorage.getItem('token')).toBe(null);
        expect({ errorMessage, status, user }).toEqual({
            errorMessage: 'Credenciales incorrectas',
            status: 'not-authenticated',
            user: {}
        });

        await waitFor(
            () => expect( result.current.errorMessage ).toBe(undefined)
        );

    });

    test('startRegister debe de crear un usuario', async() => { 

        const newUser = { email: 'algo@google.com', password: '1241242', name: 'test user 2'}

        const mockStore = getMockStore({ ...notAuthenticatedState });
        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });

        const spy = jest.spyOn( calendarApi, 'post' ).mockReturnValue({
            data: {
                ok: true,
                uid: "6853b439994f0262c2236e4e",
                name: "Test user",
                token: "ALGUN-TOKEN"
            
            }
        })

        await act(async() => {
            await result.current.startRegister( newUser );
        });

        const { errorMessage, status, user } = result.current;

        expect({ errorMessage, status, user }).toEqual(

            {
                errorMessage: undefined,
                status: 'authenticated',
                user: { name: 'Test user', uid: '6853b439994f0262c2236e4e' }
            }
        );

        spy.mockRestore();
     });

     test('startRegister debe de fallar en la creación', async() => { 

        const mockStore = getMockStore({ ...notAuthenticatedState });
        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });

        await act(async() => {
            await result.current.startRegister( testUserCredentials );
        });

        const { errorMessage, status, user } = result.current;

        expect({ errorMessage, status, user }).toEqual(

            {
                errorMessage: 'El usuario ya existe',
                status: 'not-authenticated',
                user: {}
            }
        );

      });

      test('checkAuthToken debe de fallar si no hay token', async() => { 

        const mockStore = getMockStore({ ...initialState });
        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });

        await act(async() => {
            await result.current.checkAuthToken();
        });

        const { errorMessage, status, user } = result.current;
        expect({ errorMessage, status, user }).toEqual({
            errorMessage: undefined,
            status: 'not-authenticated',
            user: {}
        })
       });

       test('checkAuthToken debe de autenticar el usuario si hay un token', async () => { 

            const { data } = await calendarApi.post( '/auth', testUserCredentials );
            localStorage.setItem('token', data.token);

            const mockStore = getMockStore({ ...initialState });
            const { result } = renderHook( () => useAuthStore(), {
                wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
            });

            await act(async() => {
                await result.current.checkAuthToken();
            });

            const { errorMessage, status, user } = result.current;
            expect({ errorMessage, status, user }).toEqual({

                errorMessage: undefined,
                status: 'authenticated',
                user: { name: 'Test user', uid: '6853b439994f0262c2236e4e' }
                
            });
        
        });
 })