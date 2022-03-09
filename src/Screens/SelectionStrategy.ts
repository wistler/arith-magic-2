import _ from "lodash";
import { detectBrowser } from "../util/browser";
import type { Coord } from "../lib/game";

function swipeSelectionStrategy(node: HTMLElement): SvelteActionReturnType {

    let inProgress = false;
    let activeSelection: Coord[] = [];

    const setInProgress = (status: boolean) => {
        if (inProgress !== status) {
            inProgress = status;
            if (!inProgress) {
                activeSelection.splice(0)
            }
            node.dispatchEvent(new CustomEvent('selectionInProgress', { detail: { inProgress } }))
        }
    }

    const isAlreadySelected = (c: Coord) =>
        _.findIndex(activeSelection, c) !== -1

    const selectTile = (c: Coord) => {
        activeSelection.push(c)
        node.dispatchEvent(new CustomEvent('selectTile', { detail: { add: c, activeSelection } }))
    }

    const deselectTile = (c: Coord) => {
        if (_.isEqual(activeSelection.at(-2), c)) {
            node.dispatchEvent(new CustomEvent('deselectTile', { detail: { remove: activeSelection.pop(), activeSelection } }))
        }
    }

    const pointerMove = (event: PointerEvent) => {
        if (!inProgress) { //} || complete) {
            return;
        }

        const target = document.elementFromPoint(event.clientX, event.clientY);
        // TODO only process target if we swype through the center

        console.debug({ pointermove: target })
        if (!node.contains(target)) {
            // do we not care about this ??
            return;
        }

        const dataset = (target as HTMLElement).parentElement.dataset;
        const { row, col } = dataset;
        const coord = { row: +row, col: +col }
        if (row !== undefined && col !== undefined) {
            if (!isAlreadySelected(coord)) {
                selectTile(coord);
            } else {
                deselectTile(coord);
            }
        }
    }

    const pointerDown = (event: PointerEvent) => {
        console.debug("pointerDown");
        setInProgress(true)
    }
    const pointerUp = (event: PointerEvent) => {
        console.debug("pointerUp");
        setInProgress(false)
    }

    node.addEventListener('pointermove', pointerMove, false)
    node.addEventListener('pointerup', pointerUp, true)
    node.addEventListener('pointerdown', pointerDown, true)

    return {
        destroy() {
            node.removeEventListener('pointermove', pointerMove, true)
            node.removeEventListener('pointerup', pointerUp, true)
            node.removeEventListener('pointerdown', pointerDown, true)
        }
    }
}


function tapSelectionStrategy(node: HTMLElement): SvelteActionReturnType {

    let inProgress = false;
    let activeSelection: Coord[] = [];

    const setInProgress = (status: boolean) => {
        if (inProgress !== status) {
            inProgress = status;
            if (!inProgress) {
                activeSelection.splice(0)
            }
            node.dispatchEvent(new CustomEvent('selectionInProgress', { detail: { inProgress } }))
        }
    }

    const isAlreadySelected = (c: Coord) =>
        _.findIndex(activeSelection, c) !== -1

    const selectTile = (c: Coord) => {
        activeSelection.push(c)
        node.dispatchEvent(new CustomEvent('selectTile', { detail: { add: c, activeSelection } }))
    }

    const deselectTile = (c: Coord) => {
        if (_.isEqual(activeSelection.at(-1), c)) {
            node.dispatchEvent(new CustomEvent('deselectTile', { detail: { remove: activeSelection.pop(), activeSelection } }))
        }
    }

    const handleClick = (event: PointerEvent) => {
        const { target } = event
        console.debug({ click: target })

        const dataset = (target as HTMLElement).parentElement.dataset;
        const { row, col } = dataset;
        const coord = { row: +row, col: +col }
        if (row !== undefined && col !== undefined) {
            if (!isAlreadySelected(coord)) {
                if (activeSelection.length === 0) {
                    setInProgress(true);
                }
                selectTile(coord);
                if (activeSelection.length === 3) {
                    setInProgress(false)
                }
            } else {
                deselectTile(coord);
            }
        }
    }

    const handleClickOutside = (event: PointerEvent) => {
        if (node === event.target || !node.contains(event.target as any)) {
            setInProgress(false);
        }
    }

    node.addEventListener('click', handleClick, false);
    document.addEventListener('click', handleClickOutside, true);

    return {
        destroy() {
            node.removeEventListener('click', handleClick, true);
            document.removeEventListener('click', handleClickOutside, true);
        }
    }
}

const browser = detectBrowser()

// FIXME: Need to get swipe working in Chrome/Edge. Only firefox support.
export default (browser === 'firefox') ?
    swipeSelectionStrategy : tapSelectionStrategy
