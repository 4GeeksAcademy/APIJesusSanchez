import React, { useState, useEffect } from 'react';

const API_URL = 'https://playground.4geeks.com/todo/';
const NombreDeUsuario = 'JesusSanchez356';

const TodoList = () => {
    const [tarea, setTarea] = useState('');
    const [lista, setLista] = useState([]);

   
    const cargarTareas = () => {
        fetch(`${API_URL}users/${NombreDeUsuario}`)
            .then((res) => res.json())
            .then((data) => setLista(data.todos))
            .catch((error) => console.error('Error al cargar tareas:', error));
    };

    
    const agregarTarea = (texto) => {
        fetch(`${API_URL}todos/${NombreDeUsuario}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ label: texto, is_done: false }),
        })
            .then((res) => res.json())
            .then(() => cargarTareas())
            .catch((error) => console.error('Error al agregar tarea:', error));
    };

    
    const eliminarTarea = (item) => {
        fetch(`${API_URL}todos/${item.id}`, {
            method: 'DELETE',
        })
            .then((res) => {
                if (res.ok) {
                    setLista(lista.filter((t) => t.id !== item.id));
                }
            })
            .catch((error) => console.error('Error al eliminar tarea:', error));
    };

    
    const eliminarTodo = () => {
        const promesas = lista.map((item) =>
            fetch(`${API_URL}todos/${item.id}`, { method: 'DELETE' })
        );

        Promise.all(promesas)
            .then(() => setLista([]))
            .catch((error) => console.error('Error al eliminar todas:', error));
    };

 
    const manejarEnter = (event) => {
        if (event.key === 'Enter' && tarea.trim() !== '') {
            agregarTarea(tarea.trim());
            setTarea('');
        }
    };

    useEffect(() => {
        cargarTareas();
    }, []);

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h3 className="text-center mb-4">Todo</h3>

                            <div className="input-group mb-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Escribe una tarea..."
                                    value={tarea}
                                    onChange={(e) => setTarea(e.target.value)}
                                    onKeyDown={manejarEnter}
                                />
                            </div>

                            <ul className="list-group mb-3">
                                {lista.length === 0 ? (
                                    <li className="list-group-item text-center text-muted">
                                        No hay tareas
                                    </li>
                                ) : (
                                    lista.map((item) => (
                                        <li
                                            key={item.id}
                                            className="list-group-item d-flex justify-content-between align-items-center"
                                        >
                                            <span>{item.label}</span>
                                            <button
                                                className="btn-close btn-sm"
                                                onClick={() => eliminarTarea(item)}
                                            ></button>
                                        </li>
                                    ))
                                )}
                            </ul>

                            <div className="Contador">
                                {lista.length} tarea{lista.length !== 1 ? 's' : ''}
                            </div>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="btn btn-danger mt-4"
                        onClick={eliminarTodo}
                    >
                        Eliminar Todo!
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TodoList;



