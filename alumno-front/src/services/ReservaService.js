import { reservasApi } from "../config/apiConfig";

const RESERVA_ENDPOINT = "/api/reserva";

export const listarReservas = () => reservasApi.get(RESERVA_ENDPOINT);

export const crearReserva = (reserva) => reservasApi.post(RESERVA_ENDPOINT, reserva);

export const getReservaById = (idReserva) => reservasApi.get(`${RESERVA_ENDPOINT}/${idReserva}`);

export const updateReserva = (idReserva, reserva) => reservasApi.put(`${RESERVA_ENDPOINT}/${idReserva}`, reserva);

export const deleteReserva = (idReserva) => reservasApi.delete(`${RESERVA_ENDPOINT}/${idReserva}`);