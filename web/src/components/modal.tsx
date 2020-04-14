import { Component, h, Fragment, FunctionalComponent, ComponentChild } from 'preact'
import { useEffect, useState } from 'preact/hooks'
import classNames from 'classnames'
import styles from './modal.module.scss'
import EventEmitter from 'events'

export const Modal: FunctionalComponent<{ onCloseClick: () => void, className?: string }> =
    ({ children, onCloseClick, className }) => (
        <div className={classNames(styles.modal, className)}>
            {children}
            <div className={styles.close} onClick={onCloseClick} >
                ×
            </div>
        </div>
    )
export const ModalHeader: FunctionalComponent = ({ children }) => <h2 className={styles.modalHeader}>{children}</h2>
export const ModalBody: FunctionalComponent = ({ children }) => <div className={styles.modalBody}>{children}</div>

const emitter = new EventEmitter()

export interface ModalControl<T> {
    resolve: (value: T | PromiseLike<T>) => void
    close: () => void
}

/**
 * `openModal` opens a modal and returns a promise that is fulfilled when the
 * modal is closed.
 *
 * @param content a functional component that renders the content of the modal
 */
export function openModal(Content: FunctionalComponent<ModalControl<never>>): Promise<void>
export function openModal<T>(Content: FunctionalComponent<ModalControl<T>>, defaultValue: T): Promise<T>
export function openModal<T = void>(Content: FunctionalComponent<ModalControl<T>>, defaultValue?: T): Promise<T> {
    return new Promise<T>(resolve => {
        let wrapper: HTMLDivElement | null = null
        let modal: ComponentChild
        let unlisten: (() => void) | undefined

        /**
         * `close` will close the modal and return the value passed in
         *
         * @param value the value `openModal` will return
         */
        const close = (value: T | PromiseLike<T> | undefined) => {
            emitter.emit('close', modal)
            resolve(value)
            unlisten?.()
        }

        // if the user navigates while a modal is open it will close and return
        // the default value
        // unlisten = staticModalController?.props.history.listen(() => {
        //     close(defaultValue)
        // })

        // if the user clicks the x in the modal it will close and return the
        // default value
        const modalClose = (e: MouseEvent) => {
            if (e.target === wrapper) {
                close(defaultValue)
            }
        }

        modal = <div ref={e => wrapper = e} className={styles.modalWrapper} onClick={modalClose}>
            <Content resolve={close} close={() => close(defaultValue)} />
        </div>


        emitter.emit('open', modal)
    })
}

/**
 * openInfoModal is a helper that opens a simple modal with a static title and
 * body
 *
 * @param title the title of the modal
 * @param body the text in the modal body
 */
export async function openInfoModal(title: ComponentChild, body: ComponentChild): Promise<void> {
    return openModal(ctx => <Modal onCloseClick={ctx.close}>
        <ModalHeader>
            {title}
        </ModalHeader>
        <ModalBody>
            {body}
        </ModalBody>
    </Modal>)
}


export const ModalController: FunctionalComponent = () => {
    const [openModals, setOpenModals] = useState<ComponentChild[]>([])

    useEffect(() => {
        const open = (modal: ComponentChild) => setOpenModals(m => m.concat([modal]))

        emitter.on('open', open)
        return () => emitter.off('open', open)
    }, [setOpenModals])

    useEffect(() => {
        const close = (modal: ComponentChild) => setOpenModals(ms => ms.filter(m => m !== modal))

        emitter.on('close', close)
        return () => emitter.off('close', close)
    }, [setOpenModals])

    return <div>
        {openModals}
    </div>
}