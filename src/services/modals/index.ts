import {createEvent, createStore} from "effector";
import modalTypes from "./modalTypes";

export const modal$ = createStore<any>({type: '', props: {}})

export const showModal = createEvent<any>()

modal$.on(showModal, (_, payload) => payload)