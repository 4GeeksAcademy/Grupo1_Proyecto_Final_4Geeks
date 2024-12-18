const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            message: null,
            user: null,
            demo: [
                {
                    title: "FIRST",
                    background: "white",
                    initial: "white"
                },
                {
                    title: "SECOND",
                    background: "white",
                    initial: "white"
                }
            ]
        },
        actions: {
            // Acción para iniciar sesión
            login: async (email, password) => {
                try {
                    const resp = await fetch(process.env.BACKEND_URL + "/api/login", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email, password })
                    });
                    const data = await resp.json();
                    if (!resp.ok) throw new Error(data.message || "Error al iniciar sesión");

                    // Guardar el access_token en localStorage
                    localStorage.setItem("access_token", data.access_token);

                    // Guardar el user en el store
                    setStore({ user: data.user });

                    return { success: true, user: data.user }; // Retorna éxito y el usuario
                } catch (error) {
                    console.error("Error en login:", error);
                    return { success: false, user: null }; // Retorna fallo y usuario null
                }
            },

            // Acción para cerrar sesión
            logout: () => {
                localStorage.removeItem("access_token");
                setStore({ user: null });
            },

            // Acción para verificar si hay un token en localStorage y obtener el user si es necesario
            // Esta acción la puedes llamar en el layout o en App para restaurar la sesión del usuario
            syncUserFromLocalStorage: async () => {
                const store = getStore();
                const token = localStorage.getItem("access_token");
                if (token && !store.user) {
                    // Si existe el token en localStorage pero no hay usuario en el store,
                    // deberías hacer una petición al backend para obtener la info del usuario.
                    // Esto depende de tu backend, aquí mostramos un ejemplo genérico:

                    try {
                        const resp = await fetch(process.env.BACKEND_URL + "/api/protected", {
                            headers: { "Authorization": "Bearer " + token }
                        });
                        const data = await resp.json();
                        if (resp.ok && data.user) {
                            setStore({ user: data.user });
                        } else {
                            // Si el token no es válido, limpiar
                            localStorage.removeItem("access_token");
                            setStore({ user: null });
                        }
                    } catch (error) {
                        console.error("Error al sincronizar usuario desde localStorage:", error);
                        localStorage.removeItem("access_token");
                        setStore({ user: null });
                    }
                }
            },

            // Ejemplo de una función ya existente
            exampleFunction: () => {
                getActions().changeColor(0, "green");
            },

            getMessage: async () => {
                try {
                    // fetching data from the backend
                    const resp = await fetch(process.env.BACKEND_URL + "/api/hello")
                    const data = await resp.json()
                    setStore({ message: data.message })
                    return data;
                } catch (error) {
                    console.log("Error loading message from backend", error)
                }
            },

            changeColor: (index, color) => {
                const store = getStore();
                const demo = store.demo.map((elm, i) => {
                    if (i === index) elm.background = color;
                    return elm;
                });
                setStore({ demo: demo });
            }
        }
    };
};

export default getState;
